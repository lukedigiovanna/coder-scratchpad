from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit

app = Flask(__name__)
socketio = SocketIO(app)

@socketio.on('connect')
def handle_connect():
    print('Client connected')
    send("Welcome to the WebSocket server!")

@socketio.on('message')
def handle_message(data):
    print(f"Received message: {data}")
    send(f"Server received your message: {data}")

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app, debug=True)
