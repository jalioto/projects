#!/usr/bin/env python3
"""
Simple Flask server for the Themed Tic-Tac-Toe Game
Serves the game on http://localhost:8004
"""

from flask import Flask, render_template_string, send_from_directory
import os

app = Flask(__name__)

# Get the directory where this script is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@app.route('/')
def index():
    """Serve the main game page"""
    try:
        with open(os.path.join(BASE_DIR, 'index.html'), 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return "Game files not found. Please ensure index.html exists in the same directory.", 404

@app.route('/styles.css')
def styles():
    """Serve the CSS file"""
    return send_from_directory(BASE_DIR, 'styles.css', mimetype='text/css')

@app.route('/script.js')
def script():
    """Serve the JavaScript file"""
    return send_from_directory(BASE_DIR, 'script.js', mimetype='application/javascript')

@app.route('/health')
def health():
    """Health check endpoint"""
    return {"status": "healthy", "game": "Themed Tic-Tac-Toe", "port": 8004}

if __name__ == '__main__':
    print("🎮 Starting Themed Tic-Tac-Toe Game Server...")
    print("🌐 Game will be available at: http://localhost:8004")
    print("🎯 Features: 3 Themes, Score Tracking, Professional Design")
    print("⭐ Press Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        app.run(
            host='0.0.0.0',
            port=8004,
            debug=True,
            use_reloader=True
        )
    except KeyboardInterrupt:
        print("\n👋 Game server stopped. Thanks for playing!")
    except Exception as e:
        print(f"❌ Error starting server: {e}")