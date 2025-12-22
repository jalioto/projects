#!/bin/bash

# Game Arcade Launcher Script
echo "🎮 Welcome to Game Arcade!"
echo "=========================="

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed or not in PATH"
    echo "Please install Python 3 to run the game servers"
    exit 1
fi

# Check if required packages are installed
echo "📦 Checking dependencies..."

# Check for Flask
if ! python3 -c "import flask" &> /dev/null; then
    echo "📦 Flask not found. Installing Flask..."
    pip3 install flask
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Flask"
        echo "Please install Flask manually: pip3 install flask"
        exit 1
    fi
fi

# Check for requests
if ! python3 -c "import requests" &> /dev/null; then
    echo "📦 Requests not found. Installing requests..."
    pip3 install requests
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install requests"
        echo "Please install requests manually: pip3 install requests"
        exit 1
    fi
fi

echo "✅ All dependencies satisfied!"
echo ""

# Start the master server
echo "🚀 Starting Game Arcade Master Server..."
echo "🌐 Game Selector will be available at: http://localhost:8000"
echo ""
echo "🎯 Available Games:"
echo "   • Tower Defense: http://localhost:8001"
echo "   • Joke Generator: http://localhost:8002"
echo "   • Memory Match: http://localhost:8003"
echo "   • Tic-Tac-Toe: http://localhost:8004"
echo "   • Snake Game: http://localhost:8005"
echo "   • One Punch Man: http://localhost:8006"
echo ""
echo "💡 Press Ctrl+C to stop all servers"
echo "=========================="

python3 game-launcher.py