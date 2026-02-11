from http.server import BaseHTTPRequestHandler
import json
import os
import sys
import subprocess

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        # 1. Get CWD and list files
        cwd = os.getcwd()
        ls_root = os.listdir(cwd)
        
        # 2. Walk src to see what's there
        src_files = []
        for root, dirs, files in os.walk(os.path.join(cwd, "src")):
            for file in files:
                src_files.append(os.path.join(root, file))
                
        # 3. Check imports
        try:
            import fastapi
            fastapi_version = fastapi.__version__
        except ImportError:
            fastapi_version = "MISSING"
            
        try:
            import sqlalchemy
            sqlalchemy_version = sqlalchemy.__version__
        except ImportError:
            sqlalchemy_version = "MISSING"

        # 4. Response
        data = {
            "status": "debug_extended",
            "cwd": cwd,
            "root_files": ls_root,
            "src_files_sample": src_files[:20], # Limit output
            "src_files_count": len(src_files),
            "python_version": sys.version,
            "fastapi": fastapi_version,
            "sqlalchemy": sqlalchemy_version,
            "sys_path": sys.path
        }
        
        self.wfile.write(json.dumps(data, default=str).encode('utf-8'))
        return
