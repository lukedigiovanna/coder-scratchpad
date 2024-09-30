from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit

import multiprocessing
import subprocess
import random
import os

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

def make_temp_file_path(extension=''):
    rand_str = ''
    for _ in range(6):
        rand_str += chr(random.randint(97, 122))
    ext = f'.{extension}' if len(extension) > 0 else ''
    return f'./tmp_{rand_str}{ext}'

@socketio.on('connect')
def handle_connect():
    # Nothing to do for now
    pass

def get_extension(language):
    if language == "python":
        return "py"
    elif language == "c++":
        return "cpp"
    elif language == "c":
        return "c"
    return None

@socketio.on('execute')
def handle_message(data):
    code = data["code"]
    language = data["language"]

    extension = get_extension(language)
    temp_file = make_temp_file_path(extension)

    # Write code to temporary file
    with open(temp_file, "w") as f:
        f.write(code)

    try:
        if language == "python":
            p = subprocess.Popen(['python', temp_file],
                                 stdout=subprocess.PIPE,
                                 stderr=subprocess.PIPE,
                                 text=True)

        for line in p.stdout:
            emit("output", line)
        for line in p.stderr:
            emit("output", line)

        p.wait()
    except:
        emit("error", "Error creating thing")
    finally:
        if os.path.exists(temp_file):
            os.remove(temp_file)
    
    emit("exited", "")
    
@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app, debug=True)
