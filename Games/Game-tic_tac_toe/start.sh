#!/bin/bash

# Themed Tic-Tac-Toe Game Server Startup Script
# Runs on port 8004

echo "🎮 Themed Tic-Tac-Toe Game Server"
echo "=================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    echo "Please install Python 3 and try again."
    exit 1
fi

# Check if Flask is installed
if ! python3 -c "import flask" 2>/dev/null; then
    echo "📦 Installing Flask..."
    pip3 install -r requirements.txt
fi

echo "🚀 Starting server on port 8004..."
echo "🌐 Open http://localhost:8004 in your browser"
echo "⭐ Press Ctrl+C to stop"
echo ""

# Start the server
python3 server.py