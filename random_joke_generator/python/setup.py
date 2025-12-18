#!/usr/bin/env python3
"""
Setup script for Kid's Joke Generator
Helps users configure AWS credentials and test the setup
"""

import os
import sys
import subprocess

def print_banner():
    print("🎭" + "="*50 + "🎭")
    print("    Kid's Joke Generator Setup")
    print("🎭" + "="*50 + "🎭")
    print()

def check_dependencies():
    """Check if required packages are installed"""
    print("📦 Checking dependencies...")
    
    try:
        import strands
        import flask
        import flask_cors
        print("✅ All dependencies are installed!")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Please run: pip install -r requirements.txt")
        return False

def check_aws_credentials():
    """Check if AWS credentials are configured"""
    print("\n🔑 Checking AWS credentials...")
    
    # Check environment variables first
    bedrock_key = os.environ.get('AWS_BEDROCK_API_KEY')
    aws_access_key = os.environ.get('AWS_ACCESS_KEY_ID')
    aws_secret_key = os.environ.get('AWS_SECRET_ACCESS_KEY')
    
    if bedrock_key:
        print("✅ Bedrock API key found in environment!")
        return True
    elif aws_access_key and aws_secret_key:
        print("✅ AWS credentials found in environment!")
        return True
    
    # Test if AWS CLI credentials work by trying to import boto3 and create a session
    try:
        import boto3
        from botocore.exceptions import NoCredentialsError, PartialCredentialsError
        
        # Try to create a session and get credentials
        session = boto3.Session()
        credentials = session.get_credentials()
        
        if credentials:
            print("✅ AWS credentials found via AWS CLI/IAM role!")
            return True
        else:
            raise NoCredentialsError("No credentials found")
            
    except (NoCredentialsError, PartialCredentialsError):
        print("❌ No AWS credentials found!")
        print("\nPlease set up your credentials:")
        print("\nOption 1 - Bedrock API Key (Recommended for development):")
        print("1. Go to: https://console.aws.amazon.com/bedrock")
        print("2. Navigate to 'API keys' in the left sidebar")
        print("3. Click 'Generate long-term API key'")
        print("4. Copy the key and run:")
        print("   export AWS_BEDROCK_API_KEY=your_key_here")
        print("\nOption 2 - AWS CLI (if you can run 'aws s3 ls'):")
        print("   Your credentials should already work!")
        print("\nOption 3 - Environment Variables:")
        print("   export AWS_ACCESS_KEY_ID=your_access_key")
        print("   export AWS_SECRET_ACCESS_KEY=your_secret_key")
        print("   export AWS_REGION=us-west-2")
        return False
    except Exception as e:
        print(f"⚠️  Could not verify AWS credentials: {e}")
        print("But if you can run 'aws s3 ls', your credentials should work!")
        return True  # Assume credentials are working if we can't verify

def test_agent():
    """Test if the Strands agent can be initialized"""
    print("\n🤖 Testing agent initialization...")
    
    try:
        from strands import Agent
        
        # Try to create a simple agent
        agent = Agent(
            system_prompt="You are a test agent. Respond with 'Hello, world!'"
        )
        
        print("✅ Agent initialized successfully!")
        
        # Try a simple test
        print("🧪 Testing joke generation...")
        response = agent("Generate a simple, clean joke for kids.")
        
        # Handle the response properly (it's an AgentResult object)
        if hasattr(response, 'content'):
            joke_text = response.content
        else:
            joke_text = str(response)
            
        print(f"📝 Test response: {joke_text[:100]}...")
        
        return True
        
    except Exception as e:
        print(f"❌ Agent initialization failed: {e}")
        print("\nCommon issues:")
        print("- Model access not enabled in Bedrock console")
        print("- Invalid or expired API key")
        print("- Network connectivity issues")
        return False

def main():
    print_banner()
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Check AWS credentials
    if not check_aws_credentials():
        print("\n⚠️  Please set up your AWS credentials and run this script again.")
        sys.exit(1)
    
    # Test agent
    if not test_agent():
        print("\n⚠️  Agent test failed. Please check your setup.")
        sys.exit(1)
    
    print("\n🎉 Setup complete! Your joke generator is ready!")
    print("\nTo start the server, run:")
    print("   python server.py")
    print("\nThen open: http://localhost:5000")
    print("\nHave fun generating jokes! 😄")

if __name__ == "__main__":
    main()