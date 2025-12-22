#!/bin/bash

# Snake Game Server Startup Script
echo "🐍 Starting Snake Game Server..."
echo "================================"

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed or not in PATH"
    echo "Please install Python 3 to run the server"
    exit 1
fi

# Check if Flask is installed
if ! python3 -c "import flask" &> /dev/null; then
    echo "📦 Flask not found. Installing Flask..."
    pip3 install flask
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Flask"
        echo "Please install Flask manually: pip3 install flask"
        exit 1
    fi
fi

# Start the server
echo "🚀 Launching Snake Game on http://localhost:8005"
echo "🎮 Features: CSS Art Background, Snake Images, Progressive Speed"
echo "🍎 Use Arrow Keys/WASD to move, buttons to Start/Pause"
echo ""
echo "Press Ctrl+C to stop the server"
echo "================================"

python3 server.py