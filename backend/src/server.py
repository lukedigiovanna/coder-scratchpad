from aiohttp import web
from pathlib import Path
import asyncio
import json
import uuid
import os

# Written for Linux

language_extensions = {
    "python": "py",
    "c": "c",
    "c++": "cpp",
    "haskell": "hs",
    "rust": "rs",
    "javascript": "js"
}


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
# Executes the given code in the language and streams the stdout/stderr back
# to the websocket as it comes in.
async def execute_code(ws, code, language):
    try:
        tmp_file = write_code_to_temp_file(code, language)
        await send_event(ws, "output", tmp_file)
        await send_event(ws, "exit", { "status": 0 })
    except:
        pass
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
