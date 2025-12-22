#!/usr/bin/env python3
"""
Simple Flask server for the Snake Game
Serves the game on http://localhost:8005
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

@app.route('/style.css')
def styles():
    """Serve the CSS file"""
    return send_from_directory(BASE_DIR, 'style.css', mimetype='text/css')

@app.route('/script.js')
def script():
    """Serve the JavaScript file"""
    return send_from_directory(BASE_DIR, 'script.js', mimetype='application/javascript')

@app.route('/img/<path:filename>')
def images(filename):
    """Serve image files from the img directory"""
    return send_from_directory(os.path.join(BASE_DIR, 'img'), filename)

@app.route('/audio/<path:filename>')
def audio(filename):
    """Serve audio files from the audio directory"""
    return send_from_directory(os.path.join(BASE_DIR, 'audio'), filename)

@app.route('/health')
def health():
    """Health check endpoint"""
    return {"status": "healthy", "game": "Snake Game", "port": 8005}

if __name__ == '__main__':
    print("🐍 Starting Snake Game Server...")
    print("🌐 Game will be available at: http://localhost:8005")
    print("🎮 Features: CSS Art Background, Snake Images, Progressive Speed")
    print("🍎 Controls: Arrow Keys/WASD + Start/Pause Buttons")
    print("⭐ Press Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        app.run(
            host='0.0.0.0',
            port=8005,
            debug=True,
            use_reloader=True
        )
    except KeyboardInterrupt:
        print("\n👋 Game server stopped. Thanks for playing!")
    except Exception as e:
        print(f"❌ Error starting server: {e}")