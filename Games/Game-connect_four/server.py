#!/usr/bin/env python3
"""
Simple HTTP server for the Connect Four Game
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
    return send_from_directory('.', 'connect_four.html')

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files"""
    try:
        return send_from_directory('.', filename)
    except FileNotFoundError:
        # Try static subdirectory
        try:
            return send_from_directory('static', filename)
        except FileNotFoundError:
            return "File not found", 404

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return {
        'status': 'healthy',
        'game': 'Connect Four',
        'port': 8007
    }

if __name__ == '__main__':
    print("🔴 Starting Connect Four Game Server...")
    print("🚀 Server starting on http://localhost:8007")
    print("🎯 Game ready to play!")
    
    try:
        app.run(debug=False, host='0.0.0.0', port=8007)
    except Exception as e:
        logger.error(f"Failed to start server: {e}")
        sys.exit(1)