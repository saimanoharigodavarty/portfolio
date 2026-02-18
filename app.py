"""
Portfolio Website – Local Development Server
Run: python app.py
"""

from http.server import HTTPServer, SimpleHTTPRequestHandler
import os
import webbrowser
import threading

PORT = 5000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))


class PortfolioHandler(SimpleHTTPRequestHandler):
    """Serve static files from the project directory."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Add CORS and cache-control headers for development
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

    def log_message(self, format, *args):
        print(f"  [REQUEST] {args[0]}")


def open_browser():
    """Open the portfolio in the default browser after a short delay."""
    webbrowser.open(f"http://localhost:{PORT}")


if __name__ == "__main__":
    os.chdir(DIRECTORY)
    server = HTTPServer(("0.0.0.0", PORT), PortfolioHandler)
    print(f"\n  ╔══════════════════════════════════════════╗")
    print(f"  ║   Portfolio Server Running                ║")
    print(f"  ║   http://localhost:{PORT}                   ║")
    print(f"  ║   Press Ctrl+C to stop                    ║")
    print(f"  ╚══════════════════════════════════════════╝\n")

    # Open browser automatically
    threading.Timer(1.0, open_browser).start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n  Server stopped.")
        server.server_close()
