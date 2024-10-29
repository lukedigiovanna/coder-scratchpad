from aiohttp import web
from pathlib import Path
import asyncio

# WebSocket handler
async def websocket_handler(request):
    ws = web.WebSocketResponse()
    await ws.prepare(request)

    print("WebSocket connection established")

    async for msg in ws:
        if msg.type == web.WSMsgType.TEXT:
            await ws.send_str(f"Echo: {msg.data}")
        elif msg.type == web.WSMsgType.ERROR:
            print(f"WebSocket connection closed with exception {ws.exception()}")

    print("WebSocket connection closed")
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
