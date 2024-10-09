from flask import Flask, render_template
from flask_socketio import SocketIO, emit, disconnect

import subprocess
import random
import os
import select
import io
import traceback

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

def make_temp_file_path(extension=''):
    rand_str = ''
    for _ in range(6):
        rand_str += chr(random.randint(97, 122))
    return f'/tmp/csp_{rand_str}'

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
    temp_code_file = f"{temp_file}.{extension}"

    # Write code to temporary file
    with open(temp_code_file, "w") as f:
        f.write(code)

    exit_status = 0
    try:
        if language == "python":
            p = subprocess.Popen(['python3', '-u', temp_code_file],
                                 stdout=subprocess.PIPE,
                                 stderr=subprocess.PIPE,
                                 bufsize=1,
                                 text=True)
        # elif language == "c++":
        #     c = subprocess.Popen(['g++', '-o', temp_file, temp_code_file])
        #     c.wait()
        #     # assume no compile errors :)


        # set streams to non blocking so 
        os.set_blocking(p.stdout.fileno(), False)
        os.set_blocking(p.stderr.fileno(), False)

        while p.poll() is None:
            ready, _, _ = select.select([p.stdout, p.stderr], [], [], 0.1)
            if p.stdout in ready:
                output = p.stdout.read()
                if output:
                    emit("output", output)
            if p.stderr in ready:
                error = p.stderr.read()
                if error:
                    modified_traceback = error.replace(temp_code_file, "<main.py>")
                    emit("output", modified_traceback)
        p.stdout.close()
        p.stderr.close()
        
        exit_status = p.wait()       
    except Exception as e:
        # Create a string buffer to capture the traceback
        buffer = io.StringIO()
        traceback.print_exc(file=buffer)  # Capture the traceback in the buffer
        error_message = buffer.getvalue()  # Get the string from the buffer

        # Now you have the entire traceback as a string
        emit("error", error_message)  # Emit the error string as needed
    finally:
        if os.path.exists(temp_code_file):
            os.remove(temp_code_file)
    
    emit("exit", exit_status)
    disconnect()
    
    
@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app, debug=True)
