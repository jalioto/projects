let currentStory = null;
let currentPage = 0;

// DOM Elements
const storyForm = document.getElementById('storyForm');
const generateBtn = document.getElementById('generateBtn');
const loading = document.getElementById('loading');
const loadingText = document.getElementById('loadingText');
const progressInfo = document.getElementById('progressInfo');
const progressFill = document.getElementById('progressFill');
// Removed progressText - using loadingText only
const storyDisplay = document.getElementById('storyDisplay');
const storyTitle = document.getElementById('storyTitle');
const pageImage = document.getElementById('pageImage');
const pageText = document.getElementById('pageText');
const pageInfo = document.getElementById('pageInfo');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const newStoryBtn = document.getElementById('newStoryBtn');
const storiesList = document.getElementById('storiesList');
const refreshBgBtn = document.getElementById('refreshBgBtn');

// Fullscreen elements
const fullscreenOverlay = document.getElementById('fullscreenOverlay');
const fullscreenImage = document.getElementById('fullscreenImage');
const fullscreenText = document.getElementById('fullscreenText');
const fullscreenInfo = document.getElementById('fullscreenInfo');
const fullscreenClose = document.getElementById('fullscreenClose');
const fullscreenPrev = document.getElementById('fullscreenPrev');
const fullscreenNext = document.getElementById('fullscreenNext');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadPreviousStories();
    setRandomBackground();
});

// Form submission
storyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const prompt = document.getElementById('prompt').value.trim();
    const age = document.getElementById('age').value;
    
    if (!prompt) {
        alert('Please enter a story prompt');
        return;
    }
    
    if (!age) {
        alert('Please select a target age');
        return;
    }
    
    // Show loading
    loading.classList.remove('hidden');
    generateBtn.disabled = true;
    storyDisplay.classList.add('hidden');
    
    // Generate session ID for progress tracking
    const sessionId = Date.now().toString();
    
    // Set up progress tracking
    setupProgressTracking(sessionId);
    
    try {
        const response = await fetch('/api/generate-story', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt, age, sessionId })
        });
        
        if (!response.ok) {
            throw new Error('Failed to generate story');
        }
        
        currentStory = await response.json();
        currentPage = 0;
        
        // Display story
        displayStory();
        
        // Reload previous stories and update background
        loadPreviousStories();
        setRandomBackground();
        
        // Reset form
        storyForm.reset();
        
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to generate story. Please try again.');
    } finally {
        loading.classList.add('hidden');
        generateBtn.disabled = false;
        cleanupProgressTracking();
    }
});

// Display current story page
function displayStory() {
    if (!currentStory || !currentStory.pages.length) return;
    
    storyDisplay.classList.remove('hidden');
    storyTitle.textContent = currentStory.title;
    
    const page = currentStory.pages[currentPage];
    pageImage.src = `data:image/png;base64,${page.image}`;
    pageText.textContent = page.text;
    
    // Update page info
    pageInfo.textContent = `Page ${currentPage + 1} of ${currentStory.pages.length}`;
    
    // Update navigation buttons
    prevPageBtn.disabled = currentPage === 0;
    nextPageBtn.disabled = currentPage === currentStory.pages.length - 1;
    
    // Scroll to story
    storyDisplay.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Navigation
prevPageBtn.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        displayStory();
    }
});

nextPageBtn.addEventListener('click', () => {
    if (currentPage < currentStory.pages.length - 1) {
        currentPage++;
        displayStory();
    }
});

// New story button
newStoryBtn.addEventListener('click', () => {
    currentStory = null;
    currentPage = 0;
    storyDisplay.classList.add('hidden');
    document.getElementById('prompt').focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Refresh background button
refreshBgBtn.addEventListener('click', () => {
    setRandomBackground();
});

// Fullscreen functionality
function openFullscreen() {
    if (!currentStory || !currentStory.pages.length) return;
    
    updateFullscreenContent();
    fullscreenOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeFullscreen() {
    fullscreenOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function updateFullscreenContent() {
    if (!currentStory || !currentStory.pages.length) return;
    
    const page = currentStory.pages[currentPage];
    fullscreenImage.src = `data:image/png;base64,${page.image}`;
    fullscreenText.textContent = page.text;
    fullscreenInfo.textContent = `Page ${currentPage + 1} of ${currentStory.pages.length}`;
    
    fullscreenPrev.disabled = currentPage === 0;
    fullscreenNext.disabled = currentPage === currentStory.pages.length - 1;
}

// Fullscreen event listeners
fullscreenClose.addEventListener('click', closeFullscreen);

fullscreenPrev.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        displayStory();
        updateFullscreenContent();
    }
});

fullscreenNext.addEventListener('click', () => {
    if (currentPage < currentStory.pages.length - 1) {
        currentPage++;
        displayStory();
        updateFullscreenContent();
    }
});

// Click story page to open fullscreen
document.addEventListener('click', (e) => {
    if (e.target.closest('.story-page') && currentStory) {
        openFullscreen();
    }
});

// Keyboard navigation in fullscreen
document.addEventListener('keydown', (e) => {
    if (!fullscreenOverlay.classList.contains('active')) return;
    
    switch(e.key) {
        case 'Escape':
            closeFullscreen();
            break;
        case 'ArrowLeft':
            if (currentPage > 0) {
                currentPage--;
                displayStory();
                updateFullscreenContent();
            }
            break;
        case 'ArrowRight':
            if (currentPage < currentStory.pages.length - 1) {
                currentPage++;
                displayStory();
                updateFullscreenContent();
            }
            break;
    }
});

// Load previous stories
async function loadPreviousStories() {
    try {
        const response = await fetch('/api/stories');
        const stories = await response.json();
        
        if (stories.length === 0) {
            storiesList.innerHTML = '<p style="color: #718096; text-align: center;">No stories yet. Create your first story!</p>';
            return;
        }
        
        storiesList.innerHTML = stories.map(story => {
            const date = new Date(story.createdAt);
            const formattedDate = formatDate(date);
            
            return `
                <div class="story-card" onclick="loadStory('${story.id}')">
                    <h3>${escapeHtml(story.title)}</h3>
                    <div class="story-meta">${formattedDate}</div>
                    <div class="story-pages">${story.pageCount} pages</div>
                </div>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Error loading stories:', error);
        storiesList.innerHTML = '<p style="color: #e53e3e;">Failed to load stories</p>';
    }
}

// Load specific story
async function loadStory(storyId) {
    try {
        const response = await fetch(`/api/stories/${storyId}`);
        currentStory = await response.json();
        currentPage = 0;
        displayStory();
    } catch (error) {
        console.error('Error loading story:', error);
        alert('Failed to load story');
    }
}

// Format date as "yyyy-mm-dd HH:mm"
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// Set random background from previous stories
async function setRandomBackground() {
    try {
        const response = await fetch('/api/random-background');
        if (response.ok) {
            const data = await response.json();
            if (data.image) {
                document.body.style.backgroundImage = `url(data:image/png;base64,${data.image})`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
                document.body.style.backgroundAttachment = 'fixed';
                
                // Remove any existing overlay
                const existingOverlay = document.querySelector('.background-overlay');
                if (existingOverlay) {
                    existingOverlay.remove();
                }
            }
        }
    } catch (error) {
        console.log('No background image available yet');
    }
}

// Set up progress tracking with Server-Sent Events
function setupProgressTracking(sessionId) {
    const eventSource = new EventSource(`/api/progress/${sessionId}`);
    
    eventSource.onmessage = function(event) {
        const data = JSON.parse(event.data);
        
        if (data.type === 'progress') {
            // Show progress info
            loadingText.textContent = data.message;
            progressInfo.classList.remove('hidden');
            progressFill.style.width = `${data.percentage}%`;
        }
    };
    
    eventSource.onerror = function(event) {
        console.log('Progress tracking error:', event);
        eventSource.close();
    };
    
    // Store reference to close later
    window.currentEventSource = eventSource;
}

// Clean up progress tracking
function cleanupProgressTracking() {
    if (window.currentEventSource) {
        window.currentEventSource.close();
        window.currentEventSource = null;
    }
    
    // Reset progress UI
    progressInfo.classList.add('hidden');
    progressFill.style.width = '0%';
    loadingText.textContent = 'Creating your story... This may take a few minutes.';
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}