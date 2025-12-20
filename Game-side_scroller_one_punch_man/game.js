class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Load Saitama images for walking animation
        this.saitamaStandImage = new Image();
        this.saitamaStandImage.src = 'images/characters/Saitama_stand.png';
        this.saitamaWalkImage = new Image();
        this.saitamaWalkImage.src = 'images/characters/Saitama_walk.png';
        this.saitamaPunchingImage = new Image();
        this.saitamaPunchingImage.src = 'images/characters/Saitama_punching.png';
        this.saitamaStandLoaded = false;
        this.saitamaWalkLoaded = false;
        this.saitamaPunchingLoaded = false;
        
        // Walking animation
        this.walkAnimationFrame = 0;
        this.walkAnimationSpeed = 20; // Frames per animation cycle
        
        // Load boss images
        this.bossImages = {};
        this.bossImageFiles = ['Boros.png', 'Crablant.png', 'SeaKing.png', 'volcano.png', 'meteor.png'];
        this.bossNames = ['Lord Boros', 'Crablante', 'Deep Sea King', 'Volcano Lord', 'Meteor'];
        this.bossImagesLoaded = 0;
        
        // City image (will be set by menu selection)
        this.cityImage = null;
        this.cityLoaded = false;
        this.selectedCity = null;
        
        // Distance selection
        this.selectedDistance = null;
        this.gameEndDistance = 5000; // Default distance
        
        // Game state
        this.gameStarted = false;
        this.gameRunning = false;
        this.score = 0;
        this.distance = 0;
        this.gameSpeed = 3;
        this.maxSpeed = 8;
        
        // Player (Saitama)
        this.player = {
            x: 100,
            y: this.height - 150,
            width: 60,
            height: 80,
            velocityY: 0,
            jumping: false,
            punching: false,
            punchCooldown: 0,
            groundY: this.height - 150
        };
        
        // Game objects
        this.enemies = [];
        this.bosses = [];
        this.particles = [];
        this.explosions = [];
        this.speechBubbles = [];
        this.obstacles = []; // New obstacle system
        
        // Background
        this.backgroundX = 0;
        this.buildings = this.generateBuildings();
        
        // Boss system
        this.currentBoss = null;
        this.bossSpawnDistance = 1000;
        this.nextBossDistance = 1000;
        
        // Audio
        this.musicEnabled = true;
        this.backgroundMusic = null;
        this.punchSound = null;
        this.explosionSound = null;
        this.audioContext = null;
        this.audioUnlocked = false;
        
        // Initialize audio
        this.initAudio();
        
        // Enemy types
        this.enemyTypes = ['👹', '👾', '🦖', '🐙', '🤖', '👻', '🐉'];
        
        // Obstacle types
        this.obstacleTypes = ['wall', 'ramp'];
        
        // Jump physics - calculate max jump height
        this.maxJumpHeight = this.calculateMaxJumpHeight();
        
        // Event listener tracking
        this.gameListenersAdded = false;
        
        this.init();
    }
    
    initAudio() {
        try {
            console.log('Initializing audio...'); // Debug
            
            // Background music
            this.backgroundMusic = new Audio('audio/background-music.mp3');
            this.backgroundMusic.loop = true;
            this.backgroundMusic.volume = 0.3;
            
            // Sound effects
            this.punchSound = new Audio('audio/punch.mp3');
            this.punchSound.volume = 0.5;
            
            this.explosionSound = new Audio('audio/explosion.mp3');
            this.explosionSound.volume = 0.4;
            
            console.log('Audio objects created:', {
                backgroundMusic: this.backgroundMusic,
                punchSound: this.punchSound,
                explosionSound: this.explosionSound
            }); // Debug
            
            // Test if punch sound loads
            this.punchSound.addEventListener('canplaythrough', () => {
                console.log('Punch sound loaded successfully');
            });
            
            this.punchSound.addEventListener('error', (e) => {
                console.log('Punch sound failed to load:', e);
            });
            
            console.log('Audio initialized');
        } catch (error) {
            console.log('Audio initialization failed:', error);
        }
    }
    
    init() {
        // Load Saitama images
        this.saitamaStandImage.onload = () => {
            this.saitamaStandLoaded = true;
        };
        
        this.saitamaWalkImage.onload = () => {
            this.saitamaWalkLoaded = true;
        };
        
        this.saitamaPunchingImage.onload = () => {
            this.saitamaPunchingLoaded = true;
        };
        
        // Load boss images
        this.bossImageFiles.forEach((filename, index) => {
            const img = new Image();
            img.src = `images/characters/bosses/${filename}`;
            img.onload = () => {
                this.bossImagesLoaded++;
            };
            this.bossImages[filename] = img;
        });
        
        // Setup menu event listeners (with delay to ensure DOM is ready)
        setTimeout(() => {
            this.setupMenuListeners();
        }, 100);
        
        // Start rendering loop (for menu background)
        this.gameLoop();
    }
    
    setupMenuListeners() {
        console.log('setupMenuListeners called'); // Debug
        
        const cityOptions = document.querySelectorAll('.cityOption');
        const distanceOptions = document.querySelectorAll('.distanceOption');
        const startButton = document.getElementById('startButton');
        
        console.log('Elements found:', {
            cityOptions: cityOptions.length,
            distanceOptions: distanceOptions.length,
            startButton: startButton ? 'found' : 'NOT FOUND'
        }); // Debug
        
        if (cityOptions.length === 0) {
            console.error('No city options found!');
            return;
        }
        
        if (distanceOptions.length === 0) {
            console.error('No distance options found!');
            return;
        }
        
        if (!startButton) {
            console.error('Start button not found!');
            return;
        }
        
        // City selection
        cityOptions.forEach((option, index) => {
            console.log(`Adding listener to city option ${index}:`, option); // Debug
            option.addEventListener('click', (e) => {
                console.log('City clicked:', option.getAttribute('data-city'), e); // Debug
                e.preventDefault();
                e.stopPropagation();
                
                // Remove selected class from all options
                cityOptions.forEach(opt => opt.classList.remove('selected'));
                
                // Add selected class to clicked option
                option.classList.add('selected');
                
                // Get selected city
                const cityFile = option.getAttribute('data-city');
                this.selectedCity = cityFile;
                
                console.log('Selected city:', this.selectedCity); // Debug
                
                // Load the selected city image
                this.loadCityImage(cityFile);
                
                // Check if both city and distance are selected
                this.checkStartButtonState();
            });
        });
        
        // Distance selection
        distanceOptions.forEach((option, index) => {
            console.log(`Adding listener to distance option ${index}:`, option); // Debug
            option.addEventListener('click', (e) => {
                console.log('Distance clicked:', option.getAttribute('data-distance'), e); // Debug
                e.preventDefault();
                e.stopPropagation();
                
                // Remove selected class from all options
                distanceOptions.forEach(opt => opt.classList.remove('selected'));
                
                // Add selected class to clicked option
                option.classList.add('selected');
                
                // Get selected distance
                const distance = parseInt(option.getAttribute('data-distance'));
                this.selectedDistance = distance;
                this.gameEndDistance = distance * 10; // Convert meters to game units
                
                console.log('Selected distance:', this.selectedDistance); // Debug
                
                // Check if both city and distance are selected
                this.checkStartButtonState();
            });
        });
        
        // Start button
        startButton.addEventListener('click', (e) => {
            console.log('Start button clicked', e); // Debug
            e.preventDefault();
            e.stopPropagation();
            
            if (this.selectedCity && this.selectedDistance) {
                console.log('Starting game with:', this.selectedCity, this.selectedDistance); // Debug
                this.startGame();
            } else {
                console.log('Cannot start - missing selections:', {
                    city: this.selectedCity,
                    distance: this.selectedDistance
                }); // Debug
            }
        });
        
        console.log('Menu listeners setup complete'); // Debug
    }
    
    checkStartButtonState() {
        const startButton = document.getElementById('startButton');
        startButton.disabled = !(this.selectedCity && this.selectedDistance);
    }
    
    loadCityImage(cityFile) {
        this.cityLoaded = false;
        this.cityImage = new Image();
        this.cityImage.src = `images/landscapes/${cityFile}`;
        
        this.cityImage.onload = () => {
            this.cityLoaded = true;
            console.log('City loaded:', cityFile);
        };
        
        this.cityImage.onerror = () => {
            console.error('Failed to load city:', cityFile);
        };
    }
    
    startGame() {
        console.log('Starting game...'); // Debug log
        
        // Unlock audio on first user interaction
        this.unlockAudio();
        
        // Hide main menu
        document.getElementById('mainMenu').style.display = 'none';
        
        // Initialize game
        this.gameStarted = true;
        this.gameRunning = true;
        
        // Start background music
        this.playBackgroundMusic();
        
        console.log('Game state:', this.gameStarted, this.gameRunning); // Debug log
        
        // Setup game event listeners
        this.setupGameListeners();
        
        // Spawn initial enemies and obstacles
        this.spawnInitialEnemies();
        this.spawnInitialObstacles();
        
        console.log('Game started successfully'); // Debug log
    }
    
    setupGameListeners() {
        // Only add listeners if not already added
        if (this.gameListenersAdded) return;
        this.gameListenersAdded = true;
        
        // Mouse click for punching
        this.canvas.addEventListener('click', () => {
            if (this.gameRunning) {
                this.punch();
            }
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning) return;
            
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    this.jump();
                    break;
                case 'KeyF':
                    e.preventDefault();
                    this.punch();
                    break;
                case 'Enter':
                    this.punch();
                    break;
            }
        });
        
        // Restart button
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restart();
        });
        
        // Music toggle
        document.getElementById('musicToggle').addEventListener('click', () => {
            this.toggleMusic();
        });
    }
    
    generateBuildings() {
        const buildings = [];
        for (let i = 0; i < 20; i++) {
            buildings.push({
                x: i * 200,
                height: 100 + Math.random() * 200,
                width: 80 + Math.random() * 40,
                color: `hsl(${200 + Math.random() * 60}, 50%, ${30 + Math.random() * 20}%)`
            });
        }
        return buildings;
    }
    
    spawnInitialEnemies() {
        for (let i = 0; i < 5; i++) {
            this.spawnEnemy(this.width + i * 300);
        }
    }
    
    spawnInitialObstacles() {
        for (let i = 0; i < 3; i++) {
            this.spawnObstacle(this.width + 200 + i * 400);
        }
    }
    
    calculateMaxJumpHeight() {
        // Simulate jump physics to calculate max height
        let velocity = -15; // Initial jump velocity
        let height = 0;
        let maxHeight = 0;
        
        while (velocity < 0) {
            height += Math.abs(velocity);
            velocity += 0.8; // Gravity
            maxHeight = Math.max(maxHeight, height);
        }
        
        return maxHeight;
    }
    
    spawnEnemy(x = this.width + Math.random() * 200) {
        const enemyType = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
        this.enemies.push({
            x: x,
            y: this.height - 120,
            width: 40,
            height: 40,
            emoji: enemyType,
            speed: 1 + Math.random() * 2,
            health: 1,
            type: 'normal'
        });
    }
    
    spawnObstacle(x = this.width + Math.random() * 300) {
        const obstacleType = this.obstacleTypes[Math.floor(Math.random() * this.obstacleTypes.length)];
        
        if (obstacleType === 'wall') {
            // Walls can be jumped over or punched through
            // Make walls shorter than max jump height so they can be jumped over
            const wallHeight = 60 + Math.random() * 40; // 60-100 pixels (jumpable)
            this.obstacles.push({
                x: x,
                y: this.height - 50 - wallHeight,
                width: 30,
                height: wallHeight,
                type: 'wall',
                health: 1,
                color: '#8B4513',
                destroyed: false
            });
        } else if (obstacleType === 'ramp') {
            // Ramps allow smooth passage
            const rampWidth = 80 + Math.random() * 40;
            const rampHeight = 40 + Math.random() * 30;
            this.obstacles.push({
                x: x,
                y: this.height - 50 - rampHeight,
                width: rampWidth,
                height: rampHeight,
                type: 'ramp',
                color: '#696969',
                destroyed: false
            });
        }
    }
    
    spawnBoss() {
        const bossIndex = Math.floor(Math.random() * this.bossImageFiles.length);
        const bossFile = this.bossImageFiles[bossIndex];
        const bossName = this.bossNames[bossIndex];
        
        const boss = {
            x: this.width + 100,
            y: this.height - 313, // Adjusted for larger boss (250 * 1.25 = 312.5)
            width: 250, // 25% bigger (200 * 1.25 = 250)
            height: 250, // 25% bigger (200 * 1.25 = 250)
            imageFile: bossFile,
            image: this.bossImages[bossFile],
            speed: 0.5,
            health: 100,
            maxHealth: 100,
            type: 'boss',
            name: bossName,
            isVolcano: bossFile === 'volcano.png',
            isMeteor: bossFile === 'meteor.png',
            lavaParticles: [],
            meteorTrail: [],
            meteorShake: 0
        };
        
        this.bosses.push(boss);
        this.currentBoss = boss;
        this.showBossHealthBar();
        this.nextBossDistance += 1000;
    }
    
    showBossHealthBar() {
        document.getElementById('bossHealthBar').style.display = 'block';
    }
    
    hideBossHealthBar() {
        document.getElementById('bossHealthBar').style.display = 'none';
    }
    
    updateBossHealthBar() {
        if (this.currentBoss) {
            const healthPercent = (this.currentBoss.health / this.currentBoss.maxHealth) * 100;
            document.getElementById('bossHealthFill').style.width = healthPercent + '%';
            document.getElementById('bossName').textContent = this.currentBoss.name;
        }
    }
    
    jump() {
        if (!this.player.jumping) {
            this.player.velocityY = -15;
            this.player.jumping = true;
        }
    }
    
    punch() {
        console.log('Punch called, cooldown:', this.player.punchCooldown); // Debug
        if (this.player.punchCooldown <= 0) {
            this.player.punching = true;
            this.player.punchCooldown = 20;
            
            // Create punch effect
            this.createPunchEffect();
            
            // Check for enemy hits
            this.checkPunchHits();
            
            // Play punch sound
            console.log('About to play punch sound'); // Debug
            this.playSound(this.punchSound);
            
            // Add "OK" speech bubble
            this.addSpeechBubble("OK");
        } else {
            console.log('Punch on cooldown'); // Debug
        }
    }
    
    createPunchEffect() {
        const punchX = this.player.x + this.player.width;
        const punchY = this.player.y + this.player.height / 2;
        
        // Create punch particles
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: punchX,
                y: punchY,
                velocityX: 5 + Math.random() * 10,
                velocityY: (Math.random() - 0.5) * 10,
                life: 20,
                maxLife: 20,
                color: `hsl(${Math.random() * 60 + 30}, 100%, 50%)`
            });
        }
    }
    
    checkPunchHits() {
        const punchRange = 80;
        const punchX = this.player.x + this.player.width;
        const punchY = this.player.y + this.player.height / 2;
        
        // Check regular enemies
        this.enemies.forEach((enemy, index) => {
            if (!enemy.destroyed) {
                const distance = Math.sqrt(
                    Math.pow(enemy.x + enemy.width/2 - punchX, 2) + 
                    Math.pow(enemy.y + enemy.height/2 - punchY, 2)
                );
                
                if (distance < punchRange) {
                    this.destroyEnemy(index);
                }
            }
        });
        
        // Check bosses with proper hitbox detection
        this.bosses.forEach((boss, index) => {
            if (!boss.destroyed) {
                // Check if punch overlaps with boss hitbox
                const punchLeft = punchX - punchRange/2;
                const punchRight = punchX + punchRange/2;
                const punchTop = punchY - punchRange/2;
                const punchBottom = punchY + punchRange/2;
                
                const bossLeft = boss.x;
                const bossRight = boss.x + boss.width;
                const bossTop = boss.y;
                const bossBottom = boss.y + boss.height;
                
                // Check for overlap between punch area and boss hitbox
                if (punchRight > bossLeft && 
                    punchLeft < bossRight && 
                    punchBottom > bossTop && 
                    punchTop < bossBottom) {
                    this.destroyBoss(index);
                }
            }
        });
        
        // Check obstacles (walls can be punched)
        this.obstacles.forEach((obstacle, index) => {
            if (!obstacle.destroyed && obstacle.type === 'wall') {
                const punchLeft = punchX - punchRange/2;
                const punchRight = punchX + punchRange/2;
                const punchTop = punchY - punchRange/2;
                const punchBottom = punchY + punchRange/2;
                
                const obstacleLeft = obstacle.x;
                const obstacleRight = obstacle.x + obstacle.width;
                const obstacleTop = obstacle.y;
                const obstacleBottom = obstacle.y + obstacle.height;
                
                // Check for overlap between punch area and obstacle hitbox
                if (punchRight > obstacleLeft && 
                    punchLeft < obstacleRight && 
                    punchBottom > obstacleTop && 
                    punchTop < obstacleBottom) {
                    this.destroyObstacle(index);
                }
            }
        });
    }
    
    destroyEnemy(index) {
        const enemy = this.enemies[index];
        
        // Make enemy fly towards top right
        enemy.destroyed = true;
        enemy.flyVelocityX = 8 + Math.random() * 5;
        enemy.flyVelocityY = -12 - Math.random() * 5;
        enemy.rotation = 0;
        enemy.rotationSpeed = 0.3 + Math.random() * 0.2;
        enemy.flyTime = 0;
        enemy.maxFlyTime = 60; // Frames before explosion
        
        this.score += 10;
        this.updateScore();
    }
    
    destroyBoss(index) {
        const boss = this.bosses[index];
        
        // Dramatic health bar depletion
        boss.health = 0;
        this.updateBossHealthBar();
        
        // Make boss fly towards top right (bigger effect)
        boss.destroyed = true;
        boss.flyVelocityX = 6 + Math.random() * 4;
        boss.flyVelocityY = -10 - Math.random() * 4;
        boss.rotation = 0;
        boss.rotationSpeed = 0.2 + Math.random() * 0.15;
        boss.flyTime = 0;
        boss.maxFlyTime = 80; // Longer fly time for bosses
        
        this.score += 100;
        this.updateScore();
    }
    
    destroyObstacle(index) {
        const obstacle = this.obstacles[index];
        
        // Create explosion effect
        this.createExplosion(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2, false);
        
        // Mark as destroyed
        obstacle.destroyed = true;
        
        // Add score for destroying obstacle
        this.score += 5;
        this.updateScore();
        
        // Remove obstacle after a short delay to show explosion
        setTimeout(() => {
            const obstacleIndex = this.obstacles.indexOf(obstacle);
            if (obstacleIndex > -1) {
                this.obstacles.splice(obstacleIndex, 1);
            }
        }, 100);
    }
    
    createExplosion(x, y, isBoss = false, isVolcano = false, isMeteor = false) {
        const particleCount = isBoss ? 40 : 25;
        const size = isBoss ? 4 : 3;
        const speed = isBoss ? 20 : 15;
        
        // Play explosion sound
        this.playSound(this.explosionSound);
        
        // Create main explosion particles
        for (let i = 0; i < particleCount; i++) {
            let color;
            if (isMeteor) {
                // White to blue colors for meteor
                color = `hsl(${200 + Math.random() * 60}, 100%, ${70 + Math.random() * 30}%)`;
            } else if (isVolcano) {
                // Orange/red for volcano
                color = `hsl(${Math.random() * 30 + 15}, 100%, ${50 + Math.random() * 30}%)`;
            } else {
                // Normal colors
                color = `hsl(${Math.random() * 60 + 15}, 100%, ${50 + Math.random() * 30}%)`;
            }
                
            this.explosions.push({
                x: x,
                y: y,
                velocityX: (Math.random() - 0.5) * speed,
                velocityY: (Math.random() - 0.5) * speed,
                life: isBoss ? 40 : 30,
                maxLife: isBoss ? 40 : 30,
                size: size + Math.random() * 2,
                color: color
            });
        }
        
        // Create secondary explosion ring
        const ringParticles = isBoss ? 20 : 12;
        for (let i = 0; i < ringParticles; i++) {
            const angle = (i / ringParticles) * Math.PI * 2;
            const ringSpeed = isBoss ? 12 : 8;
            let color;
            if (isMeteor) {
                color = `hsl(${200 + Math.random() * 60}, 100%, 80%)`;
            } else if (isVolcano) {
                color = `hsl(${30 + Math.random() * 30}, 100%, 70%)`;
            } else {
                color = `hsl(${30 + Math.random() * 30}, 100%, 70%)`;
            }
                
            this.explosions.push({
                x: x,
                y: y,
                velocityX: Math.cos(angle) * ringSpeed,
                velocityY: Math.sin(angle) * ringSpeed,
                life: isBoss ? 35 : 25,
                maxLife: isBoss ? 35 : 25,
                size: size * 0.8,
                color: color
            });
        }
        
        // Create sparks
        const sparkCount = isBoss ? 15 : 8;
        for (let i = 0; i < sparkCount; i++) {
            let sparkColor = '#FFFFFF';
            if (isMeteor) sparkColor = '#87CEEB';
            if (isVolcano) sparkColor = '#FF4500';
            
            this.explosions.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                velocityX: (Math.random() - 0.5) * 25,
                velocityY: (Math.random() - 0.5) * 25,
                life: 20,
                maxLife: 20,
                size: 1 + Math.random(),
                color: sparkColor
            });
        }
        
        // Extra boss-specific effects
        if (isBoss) {
            if (isVolcano) {
                // Create lava chunks
                for (let i = 0; i < 10; i++) {
                    this.explosions.push({
                        x: x,
                        y: y,
                        velocityX: (Math.random() - 0.5) * 15,
                        velocityY: -5 - Math.random() * 10,
                        life: 60,
                        maxLife: 60,
                        size: 3 + Math.random() * 4,
                        color: '#FF6600'
                    });
                }
            } else if (isMeteor) {
                // Create shockwave effect
                for (let i = 0; i < 15; i++) {
                    const angle = (i / 15) * Math.PI * 2;
                    this.explosions.push({
                        x: x,
                        y: y,
                        velocityX: Math.cos(angle) * 25,
                        velocityY: Math.sin(angle) * 25,
                        life: 40,
                        maxLife: 40,
                        size: 1,
                        color: '#FFFFFF'
                    });
                }
                
                // Create ice/crystal fragments
                for (let i = 0; i < 8; i++) {
                    this.explosions.push({
                        x: x,
                        y: y,
                        velocityX: (Math.random() - 0.5) * 20,
                        velocityY: -3 - Math.random() * 8,
                        life: 50,
                        maxLife: 50,
                        size: 2 + Math.random() * 3,
                        color: '#B0E0E6'
                    });
                }
            }
        }
    }
    
    addSpeechBubble(text) {
        this.speechBubbles.push({
            x: this.player.x + this.player.width + 10,
            y: this.player.y - 20,
            text: text,
            life: 60,
            maxLife: 60
        });
    }
    
    update() {
        if (!this.gameRunning || !this.gameStarted) return;
        
        // Update distance and speed
        this.distance += this.gameSpeed;
        if (this.gameSpeed < this.maxSpeed) {
            this.gameSpeed += 0.001;
        }
        
        // Update player physics
        this.updatePlayer();
        
        // Update background
        this.backgroundX -= this.gameSpeed;
        
        // Spawn enemies and obstacles
        if (Math.random() < 0.01) {
            this.spawnEnemy();
        }
        
        if (Math.random() < 0.005) {
            this.spawnObstacle();
        }
        
        // Spawn boss
        if (this.distance >= this.nextBossDistance && !this.currentBoss) {
            this.spawnBoss();
        }
        
        // Update enemies
        this.updateEnemies();
        
        // Update bosses
        this.updateBosses();
        
        // Update obstacles
        this.updateObstacles();
        
        // Update particles and effects
        this.updateParticles();
        this.updateExplosions();
        this.updateSpeechBubbles();
        
        // Update UI
        this.updateDistance();
        
        // Check game end condition
        if (this.distance >= this.gameEndDistance) {
            this.endGame();
        }
    }
    
    updatePlayer() {
        // Update walking animation
        this.walkAnimationFrame++;
        
        // Gravity
        if (this.player.jumping) {
            this.player.velocityY += 0.8;
            this.player.y += this.player.velocityY;
            
            if (this.player.y >= this.player.groundY) {
                this.player.y = this.player.groundY;
                this.player.jumping = false;
                this.player.velocityY = 0;
            }
        }
        
        // Check obstacle collisions
        this.checkObstacleCollisions();
        
        // Punch cooldown
        if (this.player.punchCooldown > 0) {
            this.player.punchCooldown--;
        } else {
            this.player.punching = false;
        }
    }
    
    updateEnemies() {
        this.enemies.forEach((enemy, index) => {
            if (enemy.destroyed) {
                // Update flying enemy
                enemy.x += enemy.flyVelocityX;
                enemy.y += enemy.flyVelocityY;
                enemy.flyVelocityY += 0.3; // Gravity effect
                enemy.rotation += enemy.rotationSpeed;
                enemy.flyTime++;
                
                // Create explosion when fly time is up or enemy goes off screen
                if (enemy.flyTime >= enemy.maxFlyTime || enemy.y < -100 || enemy.x > this.width + 100) {
                    this.createExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2, false);
                    this.enemies.splice(index, 1);
                }
            } else {
                // Normal enemy movement
                enemy.x -= this.gameSpeed + enemy.speed;
                
                // Remove enemies that are off screen
                if (enemy.x + enemy.width < 0) {
                    this.enemies.splice(index, 1);
                }
            }
        });
    }
    
    updateBosses() {
        this.bosses.forEach((boss, index) => {
            if (boss.destroyed) {
                // Update flying boss
                boss.x += boss.flyVelocityX;
                boss.y += boss.flyVelocityY;
                boss.flyVelocityY += 0.25; // Gravity effect (slower for bosses)
                boss.rotation += boss.rotationSpeed;
                boss.flyTime++;
                
                // Create explosion when fly time is up or boss goes off screen
                if (boss.flyTime >= boss.maxFlyTime || boss.y < -350 || boss.x > this.width + 350) {
                    this.createExplosion(boss.x + boss.width/2, boss.y + boss.height/2, true, boss.isVolcano, boss.isMeteor);
                    this.bosses.splice(index, 1);
                    if (boss === this.currentBoss) {
                        this.currentBoss = null;
                        this.hideBossHealthBar();
                    }
                }
            } else {
                // Normal boss movement
                boss.x -= this.gameSpeed + boss.speed;
                
                // Special volcano boss effects
                if (boss.isVolcano) {
                    this.updateVolcanoBoss(boss);
                }
                
                // Special meteor boss effects
                if (boss.isMeteor) {
                    this.updateMeteorBoss(boss);
                }
                
                // Update boss health bar
                if (boss === this.currentBoss) {
                    this.updateBossHealthBar();
                }
                
                // Remove bosses that are off screen
                if (boss.x + boss.width < 0) {
                    this.bosses.splice(index, 1);
                    if (boss === this.currentBoss) {
                        this.currentBoss = null;
                        this.hideBossHealthBar();
                    }
                }
            }
        });
    }
    
    updateVolcanoBoss(boss) {
        // Create lava particles periodically
        if (Math.random() < 0.3) {
            boss.lavaParticles.push({
                x: boss.x + boss.width/2 + (Math.random() - 0.5) * boss.width,
                y: boss.y + boss.height,
                velocityX: (Math.random() - 0.5) * 3,
                velocityY: -2 - Math.random() * 3,
                life: 30 + Math.random() * 20,
                maxLife: 50,
                size: 2 + Math.random() * 3
            });
        }
        
        // Update existing lava particles
        boss.lavaParticles.forEach((particle, index) => {
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
            particle.velocityY += 0.1; // Gravity
            particle.life--;
            
            if (particle.life <= 0) {
                boss.lavaParticles.splice(index, 1);
            }
        });
    }
    
    updateMeteorBoss(boss) {
        // Create meteor trail particles
        if (Math.random() < 0.8) {
            boss.meteorTrail.push({
                x: boss.x + Math.random() * boss.width,
                y: boss.y + Math.random() * boss.height,
                velocityX: -2 - Math.random() * 3,
                velocityY: (Math.random() - 0.5) * 2,
                life: 20 + Math.random() * 15,
                maxLife: 35,
                size: 1 + Math.random() * 2
            });
        }
        
        // Update existing meteor trail particles
        boss.meteorTrail.forEach((particle, index) => {
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
            particle.life--;
            
            if (particle.life <= 0) {
                boss.meteorTrail.splice(index, 1);
            }
        });
        
        // Create screen shake effect
        boss.meteorShake = Math.sin(Date.now() * 0.01) * 2;
    }
    
    updateObstacles() {
        this.obstacles.forEach((obstacle, index) => {
            if (!obstacle.destroyed) {
                obstacle.x -= this.gameSpeed;
                
                // Remove obstacles that are off screen
                if (obstacle.x + obstacle.width < 0) {
                    this.obstacles.splice(index, 1);
                }
            }
        });
    }
    
    checkObstacleCollisions() {
        this.obstacles.forEach(obstacle => {
            if (!obstacle.destroyed && obstacle.type === 'wall') {
                // Check collision with wall
                if (this.checkCollision(this.player, obstacle)) {
                    // Player hits wall - stop forward movement (in a real game, you might handle this differently)
                    // For now, we'll just let the player pass through since Saitama is overpowered
                    // But you could add game over logic here if desired
                }
            } else if (!obstacle.destroyed && obstacle.type === 'ramp') {
                // Ramps don't block movement, they're just visual
                // You could add logic here to make the player follow the ramp slope
            }
        });
    }
    
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    updateParticles() {
        this.particles.forEach((particle, index) => {
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
            particle.life--;
            
            if (particle.life <= 0) {
                this.particles.splice(index, 1);
            }
        });
    }
    
    updateExplosions() {
        this.explosions.forEach((explosion, index) => {
            explosion.x += explosion.velocityX;
            explosion.y += explosion.velocityY;
            explosion.velocityX *= 0.95;
            explosion.velocityY *= 0.95;
            explosion.life--;
            
            if (explosion.life <= 0) {
                this.explosions.splice(index, 1);
            }
        });
    }
    
    updateSpeechBubbles() {
        this.speechBubbles.forEach((bubble, index) => {
            bubble.life--;
            bubble.y -= 1;
            
            if (bubble.life <= 0) {
                this.speechBubbles.splice(index, 1);
            }
        });
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw background
        this.drawBackground();
        
        // Only draw game elements if game has started
        if (this.gameStarted) {
            // Draw player (Saitama)
            this.drawPlayer();
            
            // Draw enemies
            this.drawEnemies();
            
            // Draw bosses
            this.drawBosses();
            
            // Draw obstacles
            this.drawObstacles();
            
            // Draw effects
            this.drawParticles();
            this.drawExplosions();
            this.drawSpeechBubbles();
        }
    }
    
    drawBackground() {
        // Draw city landscape if loaded, otherwise use gradient
        if (this.cityLoaded && this.cityImage && this.cityImage.complete) {
            // Draw scrolling city background
            const cityWidth = this.cityImage.width;
            const cityHeight = this.cityImage.height;
            const scale = this.height / cityHeight;
            const scaledWidth = cityWidth * scale;
            
            // Calculate background position for parallax scrolling
            const bgX = (this.backgroundX * 0.3) % scaledWidth;
            
            // Draw multiple copies of the city for seamless scrolling
            for (let i = -1; i <= Math.ceil(this.width / scaledWidth) + 1; i++) {
                this.ctx.drawImage(
                    this.cityImage,
                    bgX + i * scaledWidth,
                    0,
                    scaledWidth,
                    this.height
                );
            }
        } else {
            // Fallback: Sky gradient
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
            gradient.addColorStop(0, '#87CEEB');
            gradient.addColorStop(1, '#98FB98');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.width, this.height);
            
            // Draw simple buildings as fallback
            if (this.gameStarted) {
                this.buildings.forEach(building => {
                    const x = building.x + this.backgroundX * 0.5;
                    if (x > -building.width && x < this.width) {
                        this.ctx.fillStyle = building.color;
                        this.ctx.fillRect(x, this.height - building.height, building.width, building.height);
                        
                        // Building windows
                        this.ctx.fillStyle = '#FFD700';
                        for (let i = 0; i < 3; i++) {
                            for (let j = 0; j < Math.floor(building.height / 30); j++) {
                                if (Math.random() > 0.7) {
                                    this.ctx.fillRect(x + 10 + i * 20, this.height - building.height + 10 + j * 30, 8, 8);
                                }
                            }
                        }
                    }
                });
            }
        }
        
        // Ground overlay (always draw for consistency)
        if (this.gameStarted) {
            this.ctx.fillStyle = 'rgba(139, 69, 19, 0.8)';
            this.ctx.fillRect(0, this.height - 50, this.width, 50);
        }
    }
    
    drawPlayer() {
        const player = this.player;
        
        // Determine which Saitama image to use
        let currentSaitamaImage = null;
        
        if (player.punching && this.saitamaPunchingLoaded) {
            // Use punching image when punching
            currentSaitamaImage = this.saitamaPunchingImage;
        } else if (this.saitamaStandLoaded && this.saitamaWalkLoaded) {
            // Alternate between stand and walk images for walking animation
            const animationCycle = Math.floor(this.walkAnimationFrame / this.walkAnimationSpeed) % 2;
            currentSaitamaImage = animationCycle === 0 ? this.saitamaStandImage : this.saitamaWalkImage;
        } else if (this.saitamaStandLoaded) {
            currentSaitamaImage = this.saitamaStandImage;
        } else if (this.saitamaWalkLoaded) {
            currentSaitamaImage = this.saitamaWalkImage;
        }
        
        if (currentSaitamaImage && currentSaitamaImage.complete) {
            // Draw Saitama image
            this.ctx.save();
            
            // Scale and position the image
            let imageWidth = player.width;
            let imageHeight = player.height;
            
            // Make punching image 20% bigger
            if (player.punching && this.saitamaPunchingLoaded && currentSaitamaImage === this.saitamaPunchingImage) {
                imageWidth = player.width * 1.2;
                imageHeight = player.height * 1.2;
                // Adjust position to keep it centered
                this.ctx.drawImage(currentSaitamaImage, 
                    player.x - (imageWidth - player.width) / 2, 
                    player.y - (imageHeight - player.height) / 2, 
                    imageWidth, imageHeight);
            } else if (player.punching && !this.saitamaPunchingLoaded) {
                // If punching image not loaded, add a slight forward lean
                this.ctx.translate(player.x + imageWidth/2, player.y + imageHeight/2);
                this.ctx.rotate(0.1); // Slight forward lean
                this.ctx.drawImage(currentSaitamaImage, -imageWidth/2, -imageHeight/2, imageWidth, imageHeight);
            } else {
                this.ctx.drawImage(currentSaitamaImage, player.x, player.y, imageWidth, imageHeight);
            }
            
            this.ctx.restore();
        } else {
            // Fallback to original drawing if images not loaded
            this.ctx.fillStyle = '#FFD700';
            this.ctx.fillRect(player.x, player.y + 20, player.width, player.height - 20);
            
            this.ctx.fillStyle = '#FF0000';
            this.ctx.fillRect(player.x - 10, player.y + 15, 15, 50);
            
            this.ctx.fillStyle = '#FDBCB4';
            this.ctx.beginPath();
            this.ctx.arc(player.x + player.width/2, player.y + 15, 15, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.fillStyle = '#000';
            this.ctx.fillRect(player.x + player.width/2 - 8, player.y + 10, 3, 2);
            this.ctx.fillRect(player.x + player.width/2 + 5, player.y + 10, 3, 2);
        }
        
        // Punch effect
        if (player.punching) {
            this.ctx.fillStyle = 'rgba(255, 255, 0, 0.7)';
            this.ctx.beginPath();
            this.ctx.arc(player.x + player.width + 20, player.y + player.height/2, 30, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.lineWidth = 3;
            for (let i = 0; i < 5; i++) {
                const angle = (i * Math.PI * 2) / 5;
                const startX = player.x + player.width + 20 + Math.cos(angle) * 15;
                const startY = player.y + player.height/2 + Math.sin(angle) * 15;
                const endX = player.x + player.width + 20 + Math.cos(angle) * 35;
                const endY = player.y + player.height/2 + Math.sin(angle) * 35;
                
                this.ctx.beginPath();
                this.ctx.moveTo(startX, startY);
                this.ctx.lineTo(endX, endY);
                this.ctx.stroke();
            }
        }
    }
    
    drawEnemies() {
        this.enemies.forEach(enemy => {
            this.ctx.save();
            
            if (enemy.destroyed) {
                // Draw flying/rotating enemy
                this.ctx.translate(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
                this.ctx.rotate(enemy.rotation);
                
                // Add a trail effect for flying enemies
                this.ctx.globalAlpha = 0.8;
                this.ctx.font = `${enemy.height}px Arial`;
                this.ctx.textAlign = 'center';
                this.ctx.fillText(enemy.emoji, 0, enemy.height/3);
                
                // Add motion blur effect
                this.ctx.globalAlpha = 0.4;
                this.ctx.fillText(enemy.emoji, -enemy.flyVelocityX * 0.5, enemy.height/3 - enemy.flyVelocityY * 0.5);
            } else {
                // Draw normal enemy
                this.ctx.font = `${enemy.height}px Arial`;
                this.ctx.textAlign = 'center';
                this.ctx.fillText(enemy.emoji, enemy.x + enemy.width/2, enemy.y + enemy.height);
            }
            
            this.ctx.restore();
        });
    }
    
    drawBosses() {
        this.bosses.forEach(boss => {
            this.ctx.save();
            
            // Draw volcano boss lava particles first (behind the boss)
            if (boss.isVolcano && !boss.destroyed) {
                boss.lavaParticles.forEach(particle => {
                    const alpha = particle.life / particle.maxLife;
                    const red = Math.floor(255 * alpha);
                    const green = Math.floor(100 * alpha);
                    this.ctx.fillStyle = `rgba(${red}, ${green}, 0, ${alpha})`;
                    this.ctx.beginPath();
                    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    this.ctx.fill();
                });
            }
            
            // Draw meteor boss trail particles (behind the boss)
            if (boss.isMeteor && !boss.destroyed) {
                boss.meteorTrail.forEach(particle => {
                    const alpha = particle.life / particle.maxLife;
                    // Create fiery trail colors (white to orange to red)
                    const intensity = alpha * 255;
                    const red = 255;
                    const green = Math.floor(intensity * 0.7);
                    const blue = Math.floor(intensity * 0.3);
                    this.ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
                    this.ctx.beginPath();
                    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    this.ctx.fill();
                });
            }
            
            if (boss.destroyed) {
                // Draw flying/rotating boss
                this.ctx.translate(boss.x + boss.width/2, boss.y + boss.height/2);
                this.ctx.rotate(boss.rotation);
                
                if (boss.image && boss.image.complete) {
                    // Draw boss image with trail effect
                    this.ctx.globalAlpha = 0.8;
                    this.ctx.drawImage(boss.image, -boss.width/2, -boss.height/2, boss.width, boss.height);
                    
                    // Add motion blur effect
                    this.ctx.globalAlpha = 0.4;
                    this.ctx.drawImage(boss.image, 
                        -boss.width/2 - boss.flyVelocityX * 0.5, 
                        -boss.height/2 - boss.flyVelocityY * 0.5, 
                        boss.width, boss.height);
                } else {
                    // Fallback to emoji
                    this.ctx.globalAlpha = 0.8;
                    this.ctx.font = `${boss.height/4}px Arial`;
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText('👹', 0, boss.height/6);
                }
                
                // Add glow effect even when flying
                let glowColor = '#FF0000';
                if (boss.isVolcano) glowColor = '#FF4500';
                if (boss.isMeteor) glowColor = '#FFFFFF';
                
                this.ctx.shadowColor = glowColor;
                this.ctx.shadowBlur = 25;
                this.ctx.globalAlpha = 0.6;
                if (boss.image && boss.image.complete) {
                    this.ctx.drawImage(boss.image, -boss.width/2, -boss.height/2, boss.width, boss.height);
                }
            } else {
                // Apply meteor shake effect
                let shakeX = 0, shakeY = 0;
                if (boss.isMeteor) {
                    shakeX = boss.meteorShake;
                    shakeY = boss.meteorShake * 0.5;
                }
                
                // Draw normal boss
                if (boss.image && boss.image.complete) {
                    // Draw boss image
                    this.ctx.drawImage(boss.image, boss.x + shakeX, boss.y + shakeY, boss.width, boss.height);
                    
                    // Special boss glow effects
                    let glowColor = '#FF0000';
                    let glowIntensity = 30;
                    let glowAlpha = 0.7;
                    
                    if (boss.isVolcano) {
                        glowColor = '#FF4500';
                        glowIntensity = 35;
                        glowAlpha = 0.8;
                    } else if (boss.isMeteor) {
                        glowColor = '#FFFFFF';
                        glowIntensity = 40;
                        glowAlpha = 0.9;
                    }
                    
                    this.ctx.shadowColor = glowColor;
                    this.ctx.shadowBlur = glowIntensity;
                    this.ctx.globalAlpha = glowAlpha;
                    this.ctx.drawImage(boss.image, boss.x + shakeX, boss.y + shakeY, boss.width, boss.height);
                    
                    // Extra effects
                    if (boss.isVolcano) {
                        // Add heat shimmer effect
                        this.ctx.shadowColor = '#FFFF00';
                        this.ctx.shadowBlur = 15;
                        this.ctx.globalAlpha = 0.3;
                        this.ctx.drawImage(boss.image, boss.x + shakeX, boss.y + shakeY, boss.width, boss.height);
                    } else if (boss.isMeteor) {
                        // Add blue-white core glow
                        this.ctx.shadowColor = '#87CEEB';
                        this.ctx.shadowBlur = 20;
                        this.ctx.globalAlpha = 0.5;
                        this.ctx.drawImage(boss.image, boss.x + shakeX, boss.y + shakeY, boss.width, boss.height);
                    }
                } else {
                    // Fallback to emoji
                    let emoji = '👹';
                    if (boss.isVolcano) emoji = '🌋';
                    if (boss.isMeteor) emoji = '☄️';
                    
                    this.ctx.font = `${boss.height/4}px Arial`;
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(emoji, boss.x + boss.width/2 + shakeX, boss.y + boss.height/2 + shakeY);
                    
                    // Boss glow effect
                    let glowColor = '#FF0000';
                    if (boss.isVolcano) glowColor = '#FF4500';
                    if (boss.isMeteor) glowColor = '#FFFFFF';
                    
                    this.ctx.shadowColor = glowColor;
                    this.ctx.shadowBlur = 30;
                    this.ctx.fillText(emoji, boss.x + boss.width/2 + shakeX, boss.y + boss.height/2 + shakeY);
                }
            }
            
            this.ctx.shadowBlur = 0;
            this.ctx.restore();
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            this.ctx.fillStyle = particle.color.replace(')', `, ${alpha})`).replace('hsl', 'hsla');
            this.ctx.fillRect(particle.x, particle.y, 4, 4);
        });
    }
    
    drawExplosions() {
        this.explosions.forEach(explosion => {
            const alpha = explosion.life / explosion.maxLife;
            this.ctx.fillStyle = explosion.color.replace(')', `, ${alpha})`).replace('hsl', 'hsla');
            this.ctx.beginPath();
            this.ctx.arc(explosion.x, explosion.y, explosion.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    drawSpeechBubbles() {
        this.speechBubbles.forEach(bubble => {
            const alpha = bubble.life / bubble.maxLife;
            
            this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
            this.ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
            this.ctx.lineWidth = 2;
            
            const bubbleWidth = 40;
            const bubbleHeight = 25;
            
            this.ctx.fillRect(bubble.x, bubble.y, bubbleWidth, bubbleHeight);
            this.ctx.strokeRect(bubble.x, bubble.y, bubbleWidth, bubbleHeight);
            
            this.ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(bubble.text, bubble.x + bubbleWidth/2, bubble.y + bubbleHeight/2 + 5);
        });
    }
    
    drawObstacles() {
        this.obstacles.forEach(obstacle => {
            if (!obstacle.destroyed) {
                this.ctx.fillStyle = obstacle.color;
                
                if (obstacle.type === 'wall') {
                    // Draw rectangular wall
                    this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                    
                    // Add some texture lines
                    this.ctx.strokeStyle = '#654321';
                    this.ctx.lineWidth = 2;
                    for (let i = 0; i < 3; i++) {
                        const lineY = obstacle.y + (obstacle.height / 4) * (i + 1);
                        this.ctx.beginPath();
                        this.ctx.moveTo(obstacle.x, lineY);
                        this.ctx.lineTo(obstacle.x + obstacle.width, lineY);
                        this.ctx.stroke();
                    }
                } else if (obstacle.type === 'ramp') {
                    // Draw triangular ramp
                    this.ctx.beginPath();
                    this.ctx.moveTo(obstacle.x, obstacle.y + obstacle.height); // Bottom left
                    this.ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height); // Bottom right
                    this.ctx.lineTo(obstacle.x + obstacle.width, obstacle.y); // Top right
                    this.ctx.closePath();
                    this.ctx.fill();
                    
                    // Add outline
                    this.ctx.strokeStyle = '#555555';
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();
                }
            }
        });
    }
    
    updateScore() {
        document.getElementById('score').textContent = this.score;
    }
    
    updateDistance() {
        document.getElementById('distance').textContent = Math.floor(this.distance / 10);
    }
    
    endGame() {
        this.gameRunning = false;
        this.stopBackgroundMusic();
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').style.display = 'block';
    }
    
    restart() {
        // Show main menu again
        document.getElementById('mainMenu').style.display = 'flex';
        document.getElementById('gameOver').style.display = 'none';
        
        // Reset game state
        this.gameStarted = false;
        this.gameRunning = false;
        this.score = 0;
        this.distance = 0;
        this.gameSpeed = 3;
        this.backgroundX = 0;
        
        // Reset distance selection
        this.selectedDistance = null;
        this.gameEndDistance = 5000;
        
        // Reset walking animation
        this.walkAnimationFrame = 0;
        
        // Reset player
        this.player.y = this.player.groundY;
        this.player.velocityY = 0;
        this.player.jumping = false;
        this.player.punching = false;
        this.player.punchCooldown = 0;
        
        // Clear arrays
        this.enemies = [];
        this.bosses = [];
        this.particles = [];
        this.explosions = [];
        this.speechBubbles = [];
        this.obstacles = [];
        
        // Reset boss system
        this.currentBoss = null;
        this.nextBossDistance = 1000;
        this.hideBossHealthBar();
        
        // Clear menu selections
        document.querySelectorAll('.cityOption').forEach(opt => opt.classList.remove('selected'));
        document.querySelectorAll('.distanceOption').forEach(opt => opt.classList.remove('selected'));
        document.getElementById('startButton').disabled = true;
        
        // Reset UI
        this.updateScore();
        this.updateDistance();
    }
    
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        const button = document.getElementById('musicToggle');
        button.textContent = this.musicEnabled ? '🎵 Music: ON' : '🔇 Music: OFF';
        
        if (this.musicEnabled) {
            this.playBackgroundMusic();
        } else {
            this.stopBackgroundMusic();
        }
    }
    
    playBackgroundMusic() {
        if (this.musicEnabled && this.backgroundMusic) {
            this.backgroundMusic.play().catch(error => {
                console.log('Could not play background music:', error);
            });
        }
    }
    
    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
    }
    
    playSound(sound) {
        console.log('Attempting to play sound:', sound); // Debug
        if (this.musicEnabled && sound) {
            console.log('Sound enabled, playing...'); // Debug
            sound.currentTime = 0; // Reset to beginning
            sound.play().catch(error => {
                console.log('Could not play sound:', error);
            });
        } else {
            console.log('Sound not played - musicEnabled:', this.musicEnabled, 'sound:', sound); // Debug
        }
    }
    
    unlockAudio() {
        if (!this.audioUnlocked) {
            console.log('Unlocking audio...'); // Debug
            
            // Create a silent audio context to unlock audio
            try {
                if (this.punchSound) {
                    this.punchSound.play().then(() => {
                        this.punchSound.pause();
                        this.punchSound.currentTime = 0;
                        this.audioUnlocked = true;
                        console.log('Audio unlocked successfully'); // Debug
                    }).catch(error => {
                        console.log('Audio unlock failed:', error); // Debug
                    });
                }
            } catch (error) {
                console.log('Audio unlock error:', error); // Debug
            }
        }
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start the game when page loads
window.addEventListener('load', () => {
    console.log('Page loaded, creating game...'); // Debug
    new Game();
});
