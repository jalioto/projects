#!/usr/bin/env python3
"""
Simple HTTP server for the Emoji Memory Match Game
"""

from flask import Flask, send_from_directory
from flask_cors import CORS
import os
import sys
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

@app.route('/')
def serve_index():
    """Serve the main HTML file"""
    return send_from_directory('.', 'emoji-memory-game.html')

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files"""
    try:
        return send_from_directory('.', filename)
    except FileNotFoundError:
        return "File not found", 404

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return {
        'status': 'healthy',
        'game': 'Emoji Memory Match',
        'port': 8003
    }

if __name__ == '__main__':
    print("🎮 Starting Emoji Memory Match Game Server...")
    print("🚀 Server starting on http://localhost:8003")
    print("📱 Game ready to play!")
    
    try:
        app.run(debug=False, host='0.0.0.0', port=8003)
    except Exception as e:
        logger.error(f"Failed to start server: {e}")
        sys.exit(1)