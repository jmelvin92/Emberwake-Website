#!/usr/bin/env python3
"""
Development server with clean URL support (no .html extensions)
Run with: python3 dev-server.py
"""

import http.server
import socketserver
import os
from pathlib import Path

PORT = 8000

class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Store original path for logging
        original_path = self.path
        
        # Get the requested path
        path = self.path.split('?')[0]  # Remove query string if present
        path = path.split('#')[0]  # Remove fragment if present
        
        # If path is just /, serve index.html
        if path == '/':
            self.path = '/index.html'
            return super().do_GET()
        
        # Remove trailing slash if present
        if path.endswith('/') and len(path) > 1:
            path = path[:-1]
        
        # Remove leading slash for file checking
        check_path = path[1:] if path.startswith('/') else path
        
        # Check if the exact file exists
        if os.path.isfile(check_path):
            self.path = path
            return super().do_GET()
        
        # If not, try adding .html
        html_path = check_path + '.html'
        if os.path.isfile(html_path):
            # Update the path to include .html for the parent class
            self.path = '/' + html_path if not html_path.startswith('/') else html_path
            print(f"✓ Serving {html_path} for {original_path}")
            return super().do_GET()
        
        # If still not found, check for index.html in directory
        if os.path.isdir(check_path):
            index_path = os.path.join(check_path, 'index.html')
            if os.path.isfile(index_path):
                self.path = '/' + index_path
                return super().do_GET()
        
        # Not found, return 404
        print(f"✗ 404: {original_path} not found")
        self.path = path
        return super().do_GET()

    def end_headers(self):
        # Add cache control headers for development
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Expires', '0')
        super().end_headers()

if __name__ == "__main__":
    Handler = CleanURLHandler
    
    # Change to the script's directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"🚀 Development server running at http://localhost:{PORT}")
        print("📝 Clean URLs enabled - no .html extensions needed")
        print("Press Ctrl+C to stop the server")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n👋 Server stopped")