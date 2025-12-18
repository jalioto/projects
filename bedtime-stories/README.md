# AI Story Generator

A local web application that creates age-appropriate illustrated stories using Amazon Bedrock's Claude Haiku 3 for text generation and Nova Canvas for image generation. Features immersive full-screen reading mode, consistent character appearances, and real-time progress tracking.

## ✨ Features

- **Age-Targeted Stories**: Select age ranges from 2-3 years to 17+ for appropriate content
- **Character Consistency**: AI extracts main characters and ensures they appear in all illustrations
- **Immersive Reading**: Full-screen story pages with text overlays and navigation
- **Real-Time Progress**: Live updates showing image generation progress (e.g., "Generating image 3/5")
- **Random Backgrounds**: Previous story images rotate as website backgrounds
- **Transparent UI**: 80% transparent interface elements show background images
- **Story Library**: Browse and revisit all previously generated stories
- **Mobile Responsive**: Works seamlessly on desktop and mobile devices

## 🛠️ Prerequisites

- **Node.js** (v16 or higher)
- **AWS Account** with access to:
  - Amazon Bedrock (Claude Haiku 3 and Nova Canvas models)
  - Proper IAM permissions for Bedrock service

## 🚀 Quick Start

### 1. Clone and Install
```bash
# Clone the repository (if from git)
# cd ai-story-generator

# Install dependencies
npm install
```

### 2. Configure AWS Credentials

**Option A - Environment Variables:**
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your AWS credentials
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
```

**Option B - AWS CLI Profile:**
```bash
# Configure AWS CLI
aws configure

# Or use a specific profile
export AWS_PROFILE=your_profile_name
```

### 3. Enable Bedrock Models
1. Go to [AWS Console > Bedrock > Model Access](https://console.aws.amazon.com/bedrock/home#/modelaccess)
2. Request access to:
   - **Anthropic Claude 3 Haiku** (`anthropic.claude-3-haiku-20240307-v1:0`)
   - **Amazon Nova Canvas** (`amazon.nova-canvas-v1:0`)
3. Wait for approval (usually instant for Claude, may take time for Nova Canvas)

### 4. Start the Application
```bash
# Start the server
npm start

# For development with auto-reload
npm run dev
```

### 5. Open Your Browser
Navigate to: **http://localhost:3000**

## 📖 How to Use

### Creating Stories
1. **Select Target Age**: Choose appropriate age range from dropdown
2. **Enter Story Prompt**: Describe your story idea (e.g., "A brave mouse who dreams of becoming a knight")
3. **Click "Generate Story"**: Watch real-time progress as your story is created
4. **Enjoy Your Story**: Navigate through pages with Previous/Next buttons

### Reading Experience
- **Click any story page** to enter full-screen immersive mode
- **Use arrow keys** or navigation buttons to move between pages
- **Press Escape** to exit full-screen mode
- **Click "🎨 New Background"** to change the website background image

### Story Library
- **Browse Previous Stories**: All stories are saved and listed by creation date
- **Click any story card** to re-read previous stories
- **Stories show**: Title, creation date/time, and page count

## 🔧 API Endpoints

- `POST /api/generate-story` - Generate a new story with age and character data
- `GET /api/stories` - Get list of all stories with metadata
- `GET /api/stories/:id` - Get specific story by ID
- `GET /api/random-background` - Get random image for background
- `GET /api/progress/:sessionId` - Server-sent events for progress tracking

## 📁 Project Structure

```
ai-story-generator/
├── server.js              # Express server with Bedrock integration
├── package.json           # Dependencies and scripts
├── stories.json           # Persistent story storage (auto-created)
├── backup/                # Backup of original files
├── public/
│   ├── index.html         # Main web interface
│   ├── styles.css         # Responsive styling with glassmorphism
│   └── script.js          # Frontend JavaScript with SSE support
├── .env.example           # AWS credentials template
├── .gitignore            # Git ignore file
└── README.md             # This documentation
```

## 🔍 Troubleshooting

### AWS Issues
- **Credentials Error**: Verify AWS credentials are correctly configured
- **Model Access Denied**: Ensure you have requested access to both Claude Haiku 3 and Nova Canvas
- **Region Issues**: Default region is `us-east-1`, modify in `server.js` if needed
- **Permission Errors**: Your AWS user/role needs `bedrock:InvokeModel` permissions

### Application Issues
- **Port 3000 in use**: Change `PORT` variable in `server.js` or kill existing processes
- **Stories not saving**: Check file permissions in the project directory
- **Images not generating**: Verify Nova Canvas model access and check console for errors
- **Progress not updating**: Ensure browser supports Server-Sent Events

### Content Filter Issues
The application includes intelligent fallback systems:
1. **Primary**: Uses original paragraph text
2. **AI Fallback**: Creates safer version using Claude
3. **Generic Fallback**: Uses completely safe generic prompts
4. **Placeholder**: Simple image as last resort

## 💰 Cost Estimates

**Per Story Generation:**
- **Claude Haiku 3**: ~$0.01-0.05 (text generation and character extraction)
- **Nova Canvas**: ~$0.04 per image × number of paragraphs
- **Total**: Typically $0.10-0.50 per story depending on length

**Monthly Usage Examples:**
- **Light use** (5 stories/month): ~$2-5
- **Regular use** (20 stories/month): ~$8-20
- **Heavy use** (50 stories/month): ~$20-50

## 🎨 Features in Detail

### Age-Appropriate Content
Stories are tailored with language, themes, and complexity appropriate for the selected age range.

### Character Consistency
- AI analyzes your prompt to identify main characters
- Characters appear consistently across all story illustrations
- Fallback systems maintain character consistency even when content is filtered

### Immersive Reading Mode
- Full-screen story display with large images
- Text appears below images for optimal reading
- Keyboard and touch navigation support

### Real-Time Progress
- Live updates during story generation
- Progress bar and status messages
- "Generating image X/Y" counter for each illustration

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve the application.

## 📄 License

MIT License - feel free to use and modify for your projects.