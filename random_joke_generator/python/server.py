#!/usr/bin/env python3
"""
Kid-friendly joke generator server using Amazon Bedrock with Anthropic models
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import sys
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialize the agent
agent = None

def initialize_agent():
    """Initialize the Strands agent with Bedrock"""
    global agent
    try:
        from strands import Agent
        
        # Create agent with kid-friendly system prompt
        agent = Agent(
            system_prompt="""You are a kid-friendly joke generator. Your job is to create clean, 
            appropriate, and funny jokes for children aged 5-12. Follow these rules:
            
            1. Keep jokes completely clean and appropriate for kids
            2. Use simple language that children can understand
            3. Make jokes about everyday things kids know: animals, food, school, family
            4. Avoid scary, violent, or inappropriate content
            5. Keep jokes short and punchy
            6. Use wordplay, puns, and silly scenarios
            7. Make sure the punchline is clearly funny to kids
            8. Format as: Setup line, then punchline
            
            Examples of good kid jokes:
            - Why don't elephants use computers? Because they're afraid of the mouse!
            - What do you call a sleeping bull? A bulldozer!
            - Why did the banana go to the doctor? It wasn't peeling well!
            
            Generate ONE joke at a time based on the requested category."""
        )
        logger.info("Agent initialized successfully with Bedrock")
        return True
    except Exception as e:
        logger.error(f"Failed to initialize agent: {e}")
        return False

@app.route('/')
def serve_index():
    """Serve the main HTML file"""
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files"""
    return send_from_directory('.', filename)

@app.route('/api/joke', methods=['POST'])
def generate_joke():
    """Generate a kid-friendly joke"""
    global agent
    
    if agent is None:
        return jsonify({'error': 'Agent not initialized. Please check your AWS credentials.'}), 500
    
    try:
        data = request.get_json()
        category = data.get('category', 'general')
        
        # Map categories to kid-friendly prompts
        category_prompts = {
            'general': 'Generate a funny, clean joke for kids about anything fun and silly.',
            'animals': 'Generate a funny, clean joke for kids about animals.',
            'food': 'Generate a funny, clean joke for kids about food.',
            'school': 'Generate a funny, clean joke for kids about school.',
            'knock-knock': 'Generate a knock-knock joke that kids will love.'
        }
        
        prompt = category_prompts.get(category, category_prompts['general'])
        
        # Generate joke using the agent
        response = agent(prompt)
        
        # Handle the response properly (it's an AgentResult object)
        if hasattr(response, 'content'):
            joke = response.content.strip()
        else:
            joke = str(response).strip()
        
        # Ensure we have a proper joke format
        if not joke:
            joke = "Why don't scientists trust atoms? Because they make up everything! 😄"
        
        return jsonify({
            'joke': joke,
            'category': category,
            'success': True
        })
        
    except Exception as e:
        logger.error(f"Error generating joke: {e}")
        return jsonify({
            'error': 'Sorry, I had trouble thinking of a joke right now. Try again!',
            'success': False
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'agent_initialized': agent is not None
    })

if __name__ == '__main__':
    print("🎭 Starting Kid's Joke Generator Server...")
    
    # Initialize the agent
    if initialize_agent():
        print("✅ Agent initialized successfully!")
        print("🚀 Server starting on http://localhost:8002") # Change port here: :XXXX
        app.run(debug=True, host='0.0.0.0', port=8002)  # Change port here: port=XXXX
    else:
        print("❌ Failed to initialize agent. Please check your setup and try again.")
        sys.exit(1)