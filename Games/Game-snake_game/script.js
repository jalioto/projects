class SnakeGame {
    constructor() {
        // Check if all required DOM elements exist
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas?.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('highScore');
        this.speedElement = document.getElementById('speed');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.pauseScreen = document.getElementById('pauseScreen');
        this.finalScoreElement = document.getElementById('finalScore');
        this.startPauseBtn = document.getElementById('startPauseBtn');
        this.restartBtn = document.getElementById('restartBtn');
        this.playAgainBtn = document.getElementById('playAgainBtn');
        this.fruitsBtn = document.getElementById('fruitsBtn');
        this.savoryBtn = document.getElementById('savoryBtn');
        this.desertsBtn = document.getElementById('desertsBtn');
        
        // Verify all elements exist
        if (!this.canvas || !this.ctx || !this.scoreElement || !this.highScoreElement || 
            !this.speedElement || !this.gameOverScreen || !this.pauseScreen || 
            !this.finalScoreElement || !this.startPauseBtn || !this.restartBtn || 
            !this.playAgainBtn || !this.fruitsBtn || !this.savoryBtn || !this.desertsBtn) {
            console.error('Required DOM elements not found');
            return;
        }
        
        // Game settings
        this.gridSize = 30;
        this.tileCount = this.canvas.width / this.gridSize;
        
        // Game state
        this.snake = [
            {x: 10, y: 10},
            {x: 9, y: 10},
            {x: 8, y: 10}
        ];
        this.dx = 1;
        this.dy = 0;
        this.food = this.generateFood();
        this.score = 0;
        this.speed = 1;
        this.gameRunning = false;
        this.gameStarted = false;
        this.paused = false;
        this.gameOver = false;
        
        // Animation
        this.lastTime = 0;
        this.gameSpeed = 400; // milliseconds between moves
        
        // Food animation
        this.foodScale = 1;
        this.foodScaleDirection = 1;
        this.foodRotation = 0;
        
        // Food emojis - three categories
        this.foodCategories = {
            fruits: ['🍎', '🍊', '🍌', '🍇', '🍓', '🥝', '🍑', '🍒', '🥭', '🍍'],
            savory: ['🍕', '🍔', '🌭', '🥪', '🌮', '🌯', '🥙', '🧆', '🍗', '🍖'],
            desserts: ['🍰', '🎂', '🧁', '🍪', '🍩', '🍫', '🍬', '🍭', '🍮', '🍯']
        };
        this.currentFoodCategory = 'fruits';
        this.currentFoodEmoji = this.foodCategories.fruits[0];
        
        // Load high score
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.highScoreElement.textContent = this.highScore;
        
        // Load snake images
        this.snakeHeadImg = new Image();
        this.snakeBodyImg = new Image();
        this.imagesLoaded = 0;
        this.totalImages = 2;
        
        this.snakeHeadImg.onload = () => {
            this.imagesLoaded++;
            if (this.imagesLoaded === this.totalImages) {
                this.allImagesLoaded = true;
            }
        };
        
        this.snakeBodyImg.onload = () => {
            this.imagesLoaded++;
            if (this.imagesLoaded === this.totalImages) {
                this.allImagesLoaded = true;
            }
        };
        
        this.snakeHeadImg.src = 'img/snake_head.png';
        this.snakeBodyImg.src = 'img/snake_body.png';
        this.allImagesLoaded = false;
        
        // Audio context for sound effects
        this.audioContext = null;
        this.backgroundMusic = null;
        this.initAudio();
        
        this.setupEventListeners();
        
        // Only start the game loop if initialization was successful
        if (this.canvas && this.ctx) {
            this.gameLoop(); // Start the continuous drawing loop
        }
    }
    
    initAudio() {
        try {
            // @ts-ignore - webkitAudioContext is for Safari compatibility
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
        
        // Initialize background music
        this.backgroundMusic = new Audio('audio/background_music.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.3; // Set to 30% volume
        
        // Handle audio loading errors
        this.backgroundMusic.addEventListener('error', (e) => {
            console.log('Background music failed to load:', e);
        });
    }
    
    playEatSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }
    
    playGameOverSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.5);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }
    
    startBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.currentTime = 0; // Start from beginning
            this.backgroundMusic.play().catch(e => {
                console.log('Could not play background music:', e);
            });
        }
    }
    
    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0; // Reset to beginning
        }
    }
    
    setupEventListeners() {
        // Ensure elements exist before adding listeners
        if (!this.startPauseBtn || !this.restartBtn || !this.playAgainBtn || 
            !this.fruitsBtn || !this.savoryBtn || !this.desertsBtn) {
            console.error('Button elements not found');
            return;
        }
        
        // Food category button listeners
        this.fruitsBtn.addEventListener('click', () => {
            this.setFoodCategory('fruits');
        });
        
        this.savoryBtn.addEventListener('click', () => {
            this.setFoodCategory('savory');
        });
        
        this.desertsBtn.addEventListener('click', () => {
            this.setFoodCategory('desserts');
        });
        
        // Button event listeners
        this.startPauseBtn.addEventListener('click', () => {
            if (!this.gameStarted) {
                this.startGame();
            } else {
                this.togglePause();
            }
        });
        
        this.restartBtn.addEventListener('click', () => {
            this.restartGame();
        });
        
        this.playAgainBtn.addEventListener('click', () => {
            this.restartGame();
        });
        
        // Keyboard event listeners (only for movement and legacy support)
        document.addEventListener('keydown', (e) => {
            // Enable audio context on first user interaction
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            
            // Legacy keyboard controls for pause/restart
            if (this.gameOver && e.key === 'Enter') {
                this.restartGame();
                return;
            }
            
            if (e.key === ' ') {
                e.preventDefault();
                if (!this.gameStarted) {
                    this.startGame();
                } else {
                    this.togglePause();
                }
                return;
            }
            
            if (this.paused || this.gameOver || !this.gameStarted) return;
            
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    if (this.dy !== 1) {
                        this.dx = 0;
                        this.dy = -1;
                    }
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    if (this.dy !== -1) {
                        this.dx = 0;
                        this.dy = 1;
                    }
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    if (this.dx !== 1) {
                        this.dx = -1;
                        this.dy = 0;
                    }
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    if (this.dx !== -1) {
                        this.dx = 1;
                        this.dy = 0;
                    }
                    break;
            }
        });
    }
    
    setFoodCategory(category) {
        // Don't allow changing food category during gameplay
        if (this.gameStarted && !this.gameOver) return;
        
        // Validate category exists
        if (!this.foodCategories || !this.foodCategories[category]) {
            console.error('Invalid food category:', category);
            return;
        }
        
        this.currentFoodCategory = category;
        
        // Update button states
        if (this.fruitsBtn) this.fruitsBtn.classList.remove('active');
        if (this.savoryBtn) this.savoryBtn.classList.remove('active');
        if (this.desertsBtn) this.desertsBtn.classList.remove('active');
        
        if (category === 'fruits' && this.fruitsBtn) {
            this.fruitsBtn.classList.add('active');
        } else if (category === 'savory' && this.savoryBtn) {
            this.savoryBtn.classList.add('active');
        } else if (category === 'desserts' && this.desertsBtn) {
            this.desertsBtn.classList.add('active');
        }
        
        // Generate new food with the selected category
        this.food = this.generateFood();
    }
    
    generateFood() {
        if (!this.snake || this.snake.length === 0) {
            console.error('Snake array is not initialized');
            return {x: 15, y: 15}; // Default position
        }
        
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (this.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
        
        // Change food emoji from current category with safety checks
        if (this.foodCategories && this.currentFoodCategory) {
            const currentFoodArray = this.foodCategories[this.currentFoodCategory];
            if (currentFoodArray && currentFoodArray.length > 0) {
                this.currentFoodEmoji = currentFoodArray[Math.floor(Math.random() * currentFoodArray.length)];
            } else {
                // Fallback to fruits if category is invalid
                this.currentFoodEmoji = this.foodCategories.fruits[0];
            }
        } else {
            // Fallback emoji if categories aren't initialized
            this.currentFoodEmoji = '🍎';
        }
        this.foodScale = 0.5; // Start small for spawn animation
        
        return newFood;
    }
    
    update(currentTime) {
        if (this.paused || this.gameOver || !this.gameStarted) return;
        
        if (currentTime - this.lastTime < this.gameSpeed) return;
        this.lastTime = currentTime;
        
        // Move snake
        const head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        
        // Check wall collision
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            this.endGame();
            return;
        }
        
        // Check self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.endGame();
            return;
        }
        
        this.snake.unshift(head);
        
        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.scoreElement.textContent = this.score;
            this.playEatSound();
            this.createParticleEffect(this.food.x * this.gridSize + this.gridSize/2, this.food.y * this.gridSize + this.gridSize/2);
            
            // Increase speed every 5 food eaten
            if (this.score % 50 === 0) {
                this.speed++;
                this.speedElement.textContent = this.speed;
                this.gameSpeed = Math.max(80, this.gameSpeed - 10);
            }
            
            this.food = this.generateFood();
        } else {
            this.snake.pop();
        }
    }
    
    createParticleEffect(x, y) {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'];
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.width = '8px';
            particle.style.height = '8px';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            const angle = (i / 8) * Math.PI * 2;
            const distance = 30 + Math.random() * 20;
            particle.style.setProperty('--dx', Math.cos(angle) * distance + 'px');
            particle.style.setProperty('--dy', Math.sin(angle) * distance + 'px');
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
    }
    
    draw() {
        if (!this.ctx || !this.canvas) {
            console.error('Canvas or context not available');
            return;
        }
        
        // Clear canvas
        this.ctx.fillStyle = '#ecf0f1';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid pattern
        this.ctx.strokeStyle = 'rgba(189, 195, 199, 0.3)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i <= this.tileCount; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }
        
        // Draw snake
        if (this.snake && this.snake.length > 0 && this.allImagesLoaded) {
            this.snake.forEach((segment, index) => {
                const x = segment.x * this.gridSize;
                const y = segment.y * this.gridSize;
                
                if (index === 0) {
                    // Head - calculate rotation based on direction
                    this.ctx.save();
                    this.ctx.translate(x + this.gridSize/2, y + this.gridSize/2);
                    
                    // Rotate head based on movement direction
                    let rotation = 0;
                    if (this.dx === 1) rotation = 0; // Right
                    else if (this.dx === -1) rotation = Math.PI; // Left
                    else if (this.dy === 1) rotation = Math.PI/2; // Down
                    else if (this.dy === -1) rotation = -Math.PI/2; // Up
                    
                    this.ctx.rotate(rotation);
                    this.ctx.drawImage(this.snakeHeadImg, -this.gridSize/2, -this.gridSize/2, this.gridSize, this.gridSize);
                    this.ctx.restore();
                } else {
                    // Body
                    this.ctx.drawImage(this.snakeBodyImg, x, y, this.gridSize, this.gridSize);
                }
            });
        } else if (this.snake && this.snake.length > 0 && !this.allImagesLoaded) {
            // Fallback to gradient rectangles while images are loading
            this.snake.forEach((segment, index) => {
                const x = segment.x * this.gridSize;
                const y = segment.y * this.gridSize;
                
                if (index === 0) {
                    // Head
                    const gradient = this.ctx.createRadialGradient(
                        x + this.gridSize/2, y + this.gridSize/2, 0,
                        x + this.gridSize/2, y + this.gridSize/2, this.gridSize/2
                    );
                    gradient.addColorStop(0, '#2ecc71');
                    gradient.addColorStop(1, '#27ae60');
                    this.ctx.fillStyle = gradient;
                } else {
                    // Body
                    const gradient = this.ctx.createLinearGradient(x, y, x + this.gridSize, y + this.gridSize);
                    gradient.addColorStop(0, '#58d68d');
                    gradient.addColorStop(1, '#2ecc71');
                    this.ctx.fillStyle = gradient;
                }
                
                this.ctx.fillRect(x + 2, y + 2, this.gridSize - 4, this.gridSize - 4);
                
                // Add shine effect
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                this.ctx.fillRect(x + 4, y + 4, this.gridSize - 12, this.gridSize/3);
            });
        }
        
        // Animate food scale
        this.foodScale += this.foodScaleDirection * 0.02;
        if (this.foodScale >= 1.2) {
            this.foodScaleDirection = -1;
        } else if (this.foodScale <= 0.8) {
            this.foodScaleDirection = 1;
        }
        
        // Rotate food
        this.foodRotation += 0.05;
        
        // Draw food
        if (this.food && this.currentFoodEmoji) {
            const foodX = this.food.x * this.gridSize + this.gridSize/2;
            const foodY = this.food.y * this.gridSize + this.gridSize/2;
            
            this.ctx.save();
            this.ctx.translate(foodX, foodY);
            this.ctx.rotate(this.foodRotation);
            this.ctx.scale(this.foodScale, this.foodScale);
            
            // Draw food emoji
            this.ctx.font = `${this.gridSize}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(this.currentFoodEmoji, 0, 0);
            
            this.ctx.restore();
        }
    }
    
    togglePause() {
        if (this.gameOver || !this.gameStarted) return;
        
        this.paused = !this.paused;
        if (this.paused) {
            this.pauseScreen.classList.remove('hidden');
            this.startPauseBtn.textContent = '▶️ Resume';
            this.startPauseBtn.classList.add('pause');
            // Pause background music
            if (this.backgroundMusic) {
                this.backgroundMusic.pause();
            }
        } else {
            this.pauseScreen.classList.add('hidden');
            this.startPauseBtn.textContent = '⏸️ Pause';
            this.startPauseBtn.classList.remove('pause');
            // Resume background music
            if (this.backgroundMusic) {
                this.backgroundMusic.play().catch(e => {
                    console.log('Could not resume background music:', e);
                });
            }
        }
    }
    
    endGame() {
        this.gameOver = true;
        this.gameRunning = false;
        this.gameStarted = false;
        this.playGameOverSound();
        
        // Stop background music
        this.stopBackgroundMusic();
        
        // Update button states
        this.startPauseBtn.textContent = '▶️ Start';
        this.startPauseBtn.classList.remove('pause');
        this.restartBtn.classList.add('hidden');
        
        // Flash effect
        document.body.classList.add('flash');
        setTimeout(() => {
            document.body.classList.remove('flash');
        }, 1500);
        
        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.highScoreElement.textContent = this.highScore;
            localStorage.setItem('snakeHighScore', this.highScore);
        }
        
        this.finalScoreElement.textContent = this.score;
        this.gameOverScreen.classList.remove('hidden');
    }
    
    restartGame() {
        // Reset game state
        this.snake = [
            {x: 10, y: 10},
            {x: 9, y: 10},
            {x: 8, y: 10}
        ];
        this.dx = 1;
        this.dy = 0;
        this.food = this.generateFood();
        this.score = 0;
        this.speed = 1;
        this.gameSpeed = 150;
        this.gameOver = false;
        this.paused = false;
        this.gameRunning = true;
        this.gameStarted = true;
        
        // Start background music
        this.startBackgroundMusic();
        
        // Update UI
        this.scoreElement.textContent = this.score;
        this.speedElement.textContent = this.speed;
        this.gameOverScreen.classList.add('hidden');
        this.pauseScreen.classList.add('hidden');
        
        // Update button states
        this.startPauseBtn.textContent = '⏸️ Pause';
        this.startPauseBtn.classList.remove('pause');
        this.restartBtn.classList.remove('hidden');
    }
    
    startGame() {
        if (this.gameStarted) return;
        
        // Enable audio context on first user interaction
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        this.gameRunning = true;
        this.gameStarted = true;
        
        // Start background music
        this.startBackgroundMusic();
        
        // Update button states
        this.startPauseBtn.textContent = '⏸️ Pause';
        this.restartBtn.classList.remove('hidden');
    }
    
    gameLoop() {
        const currentTime = Date.now();
        
        if (this.gameRunning && this.gameStarted) {
            this.update(currentTime);
        }
        
        this.draw();
        
        if (this.gameRunning || !this.gameStarted) {
            requestAnimationFrame(() => this.gameLoop());
        }
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new SnakeGame();
});