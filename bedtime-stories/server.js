const express = require('express');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

// Initialize Bedrock client
const bedrockClient = new BedrockRuntimeClient({ region: 'us-east-1' });

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Store stories in memory (in production, use a database)
let stories = [];

// Store active SSE connections
const sseConnections = new Map();

// Load existing stories on startup
async function loadStories() {
  try {
    const data = await fs.readFile('stories.json', 'utf8');
    stories = JSON.parse(data);
  } catch (error) {
    console.log('No existing stories file found, starting fresh');
    stories = [];
  }
}

// Save stories to file
async function saveStories() {
  await fs.writeFile('stories.json', JSON.stringify(stories, null, 2));
}

// Extract main characters from prompt
async function extractCharacters(prompt) {
  const payload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 200,
    messages: [
      {
        role: "user",
        content: `Analyze this story prompt and identify the main characters: "${prompt}". 
        List only the main characters in a simple, comma-separated format. 
        Focus on the primary protagonists and important characters that should appear in illustrations.
        Example response: "a brave mouse knight, a wise owl wizard, a friendly dragon"`
      }
    ]
  };

  const command = new InvokeModelCommand({
    modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
    body: JSON.stringify(payload),
    contentType: 'application/json'
  });

  const response = await bedrockClient.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  return responseBody.content[0].text.trim();
}

// Generate story using Claude Haiku 3
async function generateStory(prompt, age) {
  const payload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `Write a creative story based on this prompt: "${prompt}". 
        This story should be for someone ${age} years old.
        Structure the story with clear paragraph breaks. Each paragraph should be substantial enough to stand alone as a page. 
        Make it engaging and vivid with descriptive imagery appropriate for the target age.`
      }
    ]
  };

  const command = new InvokeModelCommand({
    modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
    body: JSON.stringify(payload),
    contentType: 'application/json'
  });

  const response = await bedrockClient.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  return responseBody.content[0].text;
}

// Create a generic, content-filter-safe image prompt using the model
async function createGenericImagePrompt(originalText, characters) {
  const payload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 100,
    messages: [
      {
        role: "user",
        content: `Create an image description based on this text: "${originalText.substring(0, 300)}". 
        Remove any potentially problematic content. 
        Keep it under 50 words and focus on setting, mood, and activities.
        Example: "Characters in a neon city driving through the streets"`
      }
    ]
  };

  const command = new InvokeModelCommand({
    modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
    body: JSON.stringify(payload),
    contentType: 'application/json'
  });

  const response = await bedrockClient.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  return responseBody.content[0].text.trim();
}

// Clean text for image generation to avoid content filters
function cleanImagePrompt(text) {
  // Remove potentially problematic words and replace with child-friendly alternatives
  const cleanText = text
    .replace(/\b(bad guys?|villain|evil|fight|attack|destroy|kill|death|weapon|gun|sword|battle)\b/gi, 'characters')
    .replace(/\b(scary|frightening|terrifying|horrible)\b/gi, 'interesting')
    .replace(/\b(dark|darkness)\b/gi, 'mysterious')
    .replace(/\b(danger|dangerous)\b/gi, 'adventure')
    .replace(/\b(crime|criminal)\b/gi, 'mischief')
    .replace(/\b(steal|theft|rob)\b/gi, 'take')
    .replace(/\b(angry|mad|furious)\b/gi, 'determined')
    .trim();
  
  // Keep it short and focused on visual elements
  return cleanText.substring(0, 150);
}

// Generate image using Nova Canvas
async function generateImage(description, characters = '') {
  const cleanedPrompt = cleanImagePrompt(description);
  const characterPrompt = characters ? `${characters}. ` : '';
  
  const payload = {
    taskType: "TEXT_IMAGE",
    textToImageParams: {
      text: `Realistic style: ${characterPrompt}${cleanedPrompt}. Do not use words in the pictures.`,
      negativeText: "blurry, low quality, distorted, scary, dark, violent, inappropriate, text, words, letters, writing"
    },
    imageGenerationConfig: {
      numberOfImages: 1,
      height: 512,
      width: 512,
      cfgScale: 8.0,
      seed: Math.floor(Math.random() * 1000000)
    }
  };

  const command = new InvokeModelCommand({
    modelId: 'amazon.nova-canvas-v1:0',
    body: JSON.stringify(payload),
    contentType: 'application/json'
  });

  const response = await bedrockClient.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  return responseBody.images[0];
}

// Generate story title from content
async function generateTitle(storyContent) {
  const payload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 50,
    messages: [
      {
        role: "user",
        content: `Create a short, catchy title (maximum 6 words) for this story: "${storyContent.substring(0, 500)}..."`
      }
    ]
  };

  const command = new InvokeModelCommand({
    modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
    body: JSON.stringify(payload),
    contentType: 'application/json'
  });

  const response = await bedrockClient.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  return responseBody.content[0].text.replace(/['"]/g, '').trim();
}

// API Routes
app.post('/api/generate-story', async (req, res) => {
  try {
    const { prompt, age, sessionId } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    if (!age) {
      return res.status(400).json({ error: 'Age is required' });
    }

    console.log('Generating story for prompt:', prompt, 'Age:', age);
    
    // Extract main characters
    console.log('Extracting main characters...');
    sendProgressUpdate(sessionId, 0, 1, 'Extracting main characters...');
    const characters = await extractCharacters(prompt);
    console.log('Main characters identified:', characters);
    
    // Generate story
    sendProgressUpdate(sessionId, 0, 1, 'Generating story text...');
    const storyText = await generateStory(prompt, age);
    
    // Split into paragraphs
    const paragraphs = storyText.split('\n\n').filter(p => p.trim().length > 0);
    
    // Generate title
    const title = await generateTitle(storyText);
    
    // Generate images for each paragraph
    const pages = [];
    for (let i = 0; i < paragraphs.length; i++) {
      console.log(`Generating image for paragraph ${i + 1}/${paragraphs.length}`);
      sendProgressUpdate(sessionId, i + 1, paragraphs.length, `Generating image ${i + 1}/${paragraphs.length}`);
      
      let imageBase64;
      try {
        // Create a concise image prompt from the paragraph
        const imagePrompt = paragraphs[i].substring(0, 200) + (paragraphs[i].length > 200 ? '...' : '');
        imageBase64 = await generateImage(imagePrompt, characters);
      } catch (imageError) {
        console.error(`Error generating image for paragraph ${i + 1}:`, imageError.message);
        
        // If content filter blocks it, try to create a more generic version using the model
        try {
          console.log(`Creating generic version for paragraph ${i + 1}`);
          const genericPrompt = await createGenericImagePrompt(paragraphs[i], characters);
          imageBase64 = await generateImage(genericPrompt, characters);
        } catch (genericError) {
          console.error(`Generic prompt also failed for paragraph ${i + 1}:`, genericError.message);
          
          // Try with a completely generic fallback prompt
          try {
            console.log(`Retrying with generic fallback for paragraph ${i + 1}`);
            imageBase64 = await generateImage("A colorful illustration in cyberpunk setting", characters);
          } catch (fallbackError) {
            console.error(`All fallback attempts failed for paragraph ${i + 1}`);
            // Use a placeholder - create a simple base64 encoded 1x1 pixel image
            imageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
          }
        }
      }
      
      pages.push({
        id: i + 1,
        text: paragraphs[i],
        image: imageBase64
      });
    }
    
    // Create story object
    const story = {
      id: uuidv4(),
      title,
      prompt,
      age,
      characters,
      pages,
      createdAt: new Date().toISOString()
    };
    
    // Save story
    stories.unshift(story); // Add to beginning for newest first
    await saveStories();
    
    res.json(story);
    
  } catch (error) {
    console.error('Error generating story:', error);
    res.status(500).json({ error: 'Failed to generate story' });
  }
});

app.get('/api/stories', (req, res) => {
  const storiesWithMetadata = stories.map(story => ({
    id: story.id,
    title: story.title,
    createdAt: story.createdAt,
    pageCount: story.pages.length
  }));
  
  res.json(storiesWithMetadata);
});

app.get('/api/stories/:id', (req, res) => {
  const story = stories.find(s => s.id === req.params.id);
  if (!story) {
    return res.status(404).json({ error: 'Story not found' });
  }
  res.json(story);
});

app.get('/api/random-background', (req, res) => {
  if (stories.length === 0) {
    return res.status(404).json({ error: 'No stories available' });
  }
  
  // Get all images from all stories
  const allImages = [];
  stories.forEach(story => {
    story.pages.forEach(page => {
      if (page.image) {
        allImages.push(page.image);
      }
    });
  });
  
  if (allImages.length === 0) {
    return res.status(404).json({ error: 'No images available' });
  }
  
  // Return a random image
  const randomImage = allImages[Math.floor(Math.random() * allImages.length)];
  res.json({ image: randomImage });
});

// Server-Sent Events endpoint for progress updates
app.get('/api/progress/:sessionId', (req, res) => {
  const sessionId = req.params.sessionId;
  
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });
  
  // Store the connection
  sseConnections.set(sessionId, res);
  
  // Send initial connection confirmation
  res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);
  
  // Clean up on client disconnect
  req.on('close', () => {
    sseConnections.delete(sessionId);
  });
});

// Function to send progress updates
function sendProgressUpdate(sessionId, current, total, message) {
  const connection = sseConnections.get(sessionId);
  if (connection) {
    const data = {
      type: 'progress',
      current,
      total,
      message,
      percentage: Math.round((current / total) * 100)
    };
    connection.write(`data: ${JSON.stringify(data)}\n\n`);
  }
}

// Start server
app.listen(PORT, async () => {
  await loadStories();
  console.log(`Server running at http://localhost:${PORT}`);
});