from aiohttp import web
from pathlib import Path
import asyncio
import json
import uuid
import os

import subprocess
import os
import select
import io
import traceback

# Written for Linux

language_extensions = {
    "python": "py",
    "c": "c",
    "c++": "cpp",
    "haskell": "hs",
    "rust": "rs",
    "javascript": "js"
}

PYTHON_INTERPRETER = "python3"


# Writes the code to a temp file on disk with the extension of the given language
def write_code_to_temp_file(code, language):
    ext = language_extensions[language]
    tmp_file = f'./{uuid.uuid4()}.{ext}'
    with open(tmp_file, "w") as f:
        f.write(code)
    return tmp_file

async def send_event(ws, event, args):
    message = json.dumps({
        "event": event,
        "args": args
    })
    await ws.send_str(message)

async def start_program_python(code_file):
    return await asyncio.create_subprocess_exec(PYTHON_INTERPRETER, '-u', code_file,
                            stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE,
                            # bufsize=1,
                            # text=True
                            )

# Executes the given code in the language and streams the stdout/stderr back
# to the websocket as it comes in.
async def execute_code(ws, code, language):
    try:
        tmp_file = write_code_to_temp_file(code, language)

        process = None
        if language == "python":
            process = await start_program_python(tmp_file)
        else:
            await send_event(ws, "error", { "message": f"unknown language {language}"})
            await send_event(ws, "exit", { "status": 1 })
            return

        while True:
            # Wait for output or error asynchronously
            stdout_line = await process.stdout.readline()
            stderr_line = await process.stderr.readline()

            if stdout_line:
                await send_event(ws, "output", stdout_line.decode())
            if stderr_line:
                modified_traceback = stderr_line.decode().replace(tmp_file, "<main.py>")
                await send_event(ws, "output", modified_traceback)

            if process.stdout.at_eof() and process.stderr.at_eof():
                break

        # Retrieve and send the exit code
        exit_status = await process.wait()
        await send_event(ws, "exit", { "status": exit_status })

        # os.set_blocking(p.stdout.fileno(), False)
        # os.set_blocking(p.stderr.fileno(), False)

        # while p.poll() is None:
        #     ready, _, _ = select.select([p.stdout, p.stderr], [], [], 0.1)
        #     if p.stdout in ready:
        #         output = p.stdout.read()
        #         if output:
        #             await send_event(ws, "output", output)
        #     if p.stderr in ready:
        #         error = p.stderr.read()
        #         if error:
        #             modified_traceback = error.replace(tmp_file, "<main.py>")
        #             await send_event(ws, "output", modified_traceback)
        
        # p.stdout.close()
        # p.stderr.close()

        # exit_status = p.wait()

        # await send_event(ws, "exit", { "status": exit_status })
    except Exception:
        # Create a string buffer to capture the traceback
        buffer = io.StringIO()
        traceback.print_exc(file=buffer)  # Capture the traceback in the buffer
        error_message = buffer.getvalue()  # Get the string from the buffer

        print(error_message)

        # Now you have the entire traceback as a string
        await send_event(ws, "error", { "message": error_message })  # Emit the error string as needed
    finally:
        if os.path.exists(tmp_file):
            os.remove(tmp_file)

# WebSocket handler
async def websocket_handler(request):
    ws = web.WebSocketResponse()
    await ws.prepare(request)

    async for msg in ws:
        if msg.type == web.WSMsgType.TEXT:
            data = json.loads(msg.data)
            command = data["event"]
            if command == "execute":
                await execute_code(ws, data["args"]["code"], data["args"]["language"])
        elif msg.type == web.WSMsgType.ERROR:
            print(f"WebSocket connection closed with exception {ws.exception()}")
    return ws

app = web.Application()

# setup websocket handler
app.router.add_route("GET", "/ws", websocket_handler)

# Serve the webpage at the root
async def index(_):
    return web.FileResponse(Path("static") / "index.html")
app.router.add_get("/", index)
app.router.add_static("/", path="static", show_index=True)

if __name__ == "__main__":
    web.run_app(app, host="localhost", port=8080)
