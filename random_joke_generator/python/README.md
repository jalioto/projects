# 🎭 Kid's Joke Generator

A colorful, kid-friendly joke generator website powered by Amazon Bedrock with Anthropic models. Features clean, appropriate jokes for children aged 5-12 with a fun, interactive interface.

## Features

- 🎨 Colorful, kid-friendly design
- 🤖 AI-powered joke generation using Amazon Bedrock
- 📚 Multiple joke categories (General, Animals, Food, School, Knock-Knock)
- ✨ Animated interface with floating emojis
- 🔒 Safe, appropriate content for children
- 📱 Responsive design for all devices

## Quick Start

### 1. Run Setup (Recommended)

First, run the setup script to verify everything is working:

```bash
python setup.py
```

**What setup.py does:**
- ✅ Checks if all required dependencies are installed
- ✅ Verifies AWS credentials are configured (environment variables, AWS CLI, or IAM roles)
- ✅ Tests agent initialization with Amazon Bedrock
- ✅ Generates a test joke to confirm everything works
- 📋 Provides helpful error messages and setup instructions if anything is missing

### 2. Start the Server

```bash
python server.py
```

**Or use the convenient launcher:**
```bash
./start.sh
```

### 3. Open in Browser

Visit: **http://localhost:8002**

## Configuration

### Changing the Server Port

To change the port from the default 8002, edit line 108 in `server.py`:

```python
app.run(debug=True, host='0.0.0.0', port=8002)  # Change port here: port=XXXX
```

For example, to use port 5000:
```python
app.run(debug=True, host='0.0.0.0', port=5000)  # Change port here: port=XXXX
```

### AWS Credentials

The application works with any of these credential methods:
- **AWS CLI**: If you can run `aws s3 ls`, you're all set!
- **Environment Variables**: `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
- **Bedrock API Key**: `AWS_BEDROCK_API_KEY` (development only)
- **IAM Roles**: For EC2 instances or containers

## Project Structure

```
random_joke_generator/
├── index.html          # Main HTML page with colorful design
├── styles.css          # CSS with animations and kid-friendly styling
├── script.js           # Frontend JavaScript with interactive features
├── server.py           # Flask backend with Strands agent (PORT CONFIGURED HERE)
├── setup.py            # Setup verification and testing script
├── start.sh            # Convenient launcher script
├── requirements.txt    # Python dependencies
└── README.md          # This file
```

## How It Works

1. **Frontend**: Colorful HTML/CSS/JS interface with joke categories and animations
2. **Backend**: Flask server using Strands Agents SDK with Amazon Bedrock
3. **AI Model**: Anthropic Claude via Bedrock generates kid-appropriate jokes
4. **Safety**: System prompt ensures all content is clean and age-appropriate

## Joke Categories

- **General Fun**: Silly jokes about everyday things
- **Animals**: Jokes about pets, farm animals, and wildlife  
- **Food**: Funny food-related puns and wordplay
- **School**: Clean jokes about teachers, homework, and learning
- **Knock Knock**: Classic knock-knock joke format

## Files Explained

### `setup.py`
**Purpose**: Verification and testing script
- Checks all dependencies are installed
- Verifies AWS credentials work with Bedrock
- Tests agent initialization and joke generation
- Provides clear error messages and setup guidance
- **Run this first** to ensure everything is configured correctly

### `server.py` 
**Purpose**: Main Flask web server
- **Line 108**: Configure server port (`port=8002`)
- Initializes Strands agent with kid-friendly prompts
- Handles joke generation API endpoints
- Serves static files (HTML, CSS, JS)
- Contains safety filtering and error handling

### `start.sh`
**Purpose**: Convenient launcher script
- Installs dependencies automatically
- Checks for basic AWS credentials
- Starts the server with one command

## Troubleshooting

### Setup Issues
Run `python setup.py` first - it will identify and help fix most issues:
- Missing dependencies
- AWS credential problems  
- Model access issues
- Agent initialization errors

### Common Solutions

**"Agent not initialized" Error**
- Run `python setup.py` to diagnose the issue
- Verify model access is enabled in Bedrock console
- Check AWS credentials are working

**"Module not found" Error**
```bash
pip install -r requirements.txt
```

**Port Already in Use**
- Change the port in `server.py` line 108
- Or kill the process using the port: `lsof -ti:8002 | xargs kill`

## Customization

### Adding New Joke Categories
Edit the `category_prompts` dictionary in `server.py`:

```python
category_prompts = {
    'your_category': 'Generate a funny, clean joke for kids about [topic].',
}
```

### Changing the AI Model
Modify the agent initialization in `server.py`:

```python
agent = Agent(
    model="anthropic.claude-3-5-sonnet-20241022-v2:0",  # Different model
    system_prompt="Your custom prompt here..."
)
```

### Styling Changes
Edit `styles.css` to customize colors, fonts, and animations.

## Safety Features

- System prompt specifically designed for kid-appropriate content
- Content filtering ensures clean, safe jokes
- No user-generated content or external API calls
- Offline-capable once loaded

## License

MIT License - Feel free to use and modify for your projects!

---

Made with ❤️ for kids who love to laugh! 🎭