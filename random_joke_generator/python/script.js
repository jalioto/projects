// Kid's Joke Generator - Frontend JavaScript

class JokeGenerator {
    constructor() {
        this.jokeDisplay = document.getElementById('joke-display');
        this.generateButton = document.getElementById('generate-joke');
        this.categorySelect = document.getElementById('category');
        this.loading = document.getElementById('loading');
        
        this.initializeEventListeners();
        this.checkServerHealth();
    }
    
    initializeEventListeners() {
        this.generateButton.addEventListener('click', () => this.generateJoke());
        
        // Allow Enter key to generate joke
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.generateJoke();
            }
        });
    }
    
    async checkServerHealth() {
        try {
            const response = await fetch('/api/health');
            const data = await response.json();
            
            if (!data.agent_initialized) {
                this.showError('Server is starting up. Please wait a moment and try again.');
            }
        } catch (error) {
            console.warn('Could not check server health:', error);
        }
    }
    
    async generateJoke() {
        const category = this.categorySelect.value;
        
        // Show loading state
        this.showLoading();
        this.generateButton.disabled = true;
        
        try {
            const response = await fetch('/api/joke', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ category })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.displayJoke(data.joke);
            } else {
                this.showError(data.error || 'Sorry, I couldn\'t think of a joke right now!');
            }
            
        } catch (error) {
            console.error('Error generating joke:', error);
            this.showError('Oops! Something went wrong. Make sure the server is running!');
        } finally {
            this.hideLoading();
            this.generateButton.disabled = false;
        }
    }
    
    displayJoke(joke) {
        // Clean up the joke text
        const cleanJoke = this.formatJoke(joke);
        
        // Add animation class
        this.jokeDisplay.classList.remove('new-joke');
        
        // Update content
        this.jokeDisplay.innerHTML = `<p>${cleanJoke}</p>`;
        
        // Trigger animation
        setTimeout(() => {
            this.jokeDisplay.classList.add('new-joke');
        }, 10);
        
        // Add some fun emojis based on content
        this.addJokeEmojis();
    }
    
    formatJoke(joke) {
        // Remove any markdown formatting
        let formatted = joke.replace(/\*\*(.*?)\*\*/g, '$1');
        formatted = formatted.replace(/\*(.*?)\*/g, '$1');
        
        // Ensure proper line breaks for setup/punchline
        formatted = formatted.replace(/\n/g, '<br>');
        
        // Add some basic formatting for knock-knock jokes
        if (formatted.toLowerCase().includes('knock knock')) {
            formatted = formatted.replace(/(knock[,\s]*knock)/gi, '<strong>$1</strong>');
            formatted = formatted.replace(/(who's there\?)/gi, '<strong>$1</strong>');
        }
        
        return formatted;
    }
    
    addJokeEmojis() {
        const jokeText = this.jokeDisplay.textContent.toLowerCase();
        let emoji = '😄';
        
        // Choose emoji based on joke content
        if (jokeText.includes('animal') || jokeText.includes('dog') || jokeText.includes('cat') || 
            jokeText.includes('elephant') || jokeText.includes('cow') || jokeText.includes('chicken')) {
            emoji = '🐾';
        } else if (jokeText.includes('food') || jokeText.includes('pizza') || jokeText.includes('banana') || 
                   jokeText.includes('cookie') || jokeText.includes('sandwich')) {
            emoji = '🍕';
        } else if (jokeText.includes('school') || jokeText.includes('teacher') || jokeText.includes('homework')) {
            emoji = '📚';
        } else if (jokeText.includes('knock knock')) {
            emoji = '🚪';
        }
        
        // Add emoji to the display
        const currentContent = this.jokeDisplay.innerHTML;
        this.jokeDisplay.innerHTML = currentContent + ` ${emoji}`;
    }
    
    showLoading() {
        this.jokeDisplay.style.display = 'none';
        this.loading.style.display = 'flex';
    }
    
    hideLoading() {
        this.loading.style.display = 'none';
        this.jokeDisplay.style.display = 'block';
    }
    
    showError(message) {
        this.jokeDisplay.innerHTML = `<p style="color: #e74c3c;">😅 ${message}</p>`;
        this.jokeDisplay.classList.remove('new-joke');
        setTimeout(() => {
            this.jokeDisplay.classList.add('new-joke');
        }, 10);
    }
}

// Fun background animations
class BackgroundAnimations {
    constructor() {
        this.createFloatingEmojis();
    }
    
    createFloatingEmojis() {
        const emojis = ['😄', '😂', '🤣', '😊', '🎭', '🎪', '🎨', '🌟', '⭐', '✨'];
        
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% chance every interval
                this.createFloatingEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
            }
        }, 3000);
    }
    
    createFloatingEmoji(emoji) {
        const emojiElement = document.createElement('div');
        emojiElement.textContent = emoji;
        emojiElement.style.cssText = `
            position: fixed;
            font-size: 2em;
            pointer-events: none;
            z-index: -1;
            opacity: 0.3;
            left: ${Math.random() * 100}vw;
            top: 100vh;
            animation: float-up 8s linear forwards;
        `;
        
        document.body.appendChild(emojiElement);
        
        // Remove element after animation
        setTimeout(() => {
            if (emojiElement.parentNode) {
                emojiElement.parentNode.removeChild(emojiElement);
            }
        }, 8000);
    }
}

// Add floating animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes float-up {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.3;
        }
        50% {
            opacity: 0.6;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new JokeGenerator();
    new BackgroundAnimations();
    
    console.log('🎭 Kid\'s Joke Generator loaded successfully!');
});