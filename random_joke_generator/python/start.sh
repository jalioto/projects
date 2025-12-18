#!/bin/bash

# Kid's Joke Generator Launcher Script

echo "🎭 Starting Kid's Joke Generator..."
echo

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Check if pip is available
if ! command -v pip &> /dev/null && ! command -v pip3 &> /dev/null; then
    echo "❌ pip is required but not installed."
    exit 1
fi

# Install dependencies if needed
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Check for AWS credentials
if [ -z "$AWS_BEDROCK_API_KEY" ] && [ -z "$AWS_ACCESS_KEY_ID" ]; then
    echo "⚠️  No AWS credentials found!"
    echo
    echo "Please set up your credentials first:"
    echo "For development (recommended):"
    echo "  export AWS_BEDROCK_API_KEY=your_bedrock_api_key"
    echo
    echo "Get your API key from:"
    echo "  https://console.aws.amazon.com/bedrock → API keys"
    echo
    echo "Then run this script again."
    exit 1
fi

# Start the server
echo "🚀 Starting server..."
python3 server.py