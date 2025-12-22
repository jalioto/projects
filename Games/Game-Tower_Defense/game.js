// Game state
const game = {
    canvas: null,
    ctx: null,
    gold: 100,
    lives: 20,
    wave: 1,
    enemies: [],
    towers: [],
    projectiles: [],
    path: [],
    selectedTowerType: null,  // For placing new towers
    selectedTowerIndex: null, // For upgrading existing towers
    selectedLevel: 'grass',
    gameRunning: false,
    enemiesSpawned: 0,
    enemiesKilled: 0,
    waveSize: 10,
    backgroundImages: {}, // Store loaded background images
    waveCountdown: 0, // Countdown timer for next wave
    isCountingDown: false, // Whether countdown is active
    maxWaves: 10 // Game completes after 10 waves
};

// Level definitions with predefined paths and themes (BTD6-inspired complex maps)
const levels = {
    grass: {
        name: 'Monkey Meadow',
        background: '#27ae60',
        backgroundImage: 'static/img/monkey-meadow-bg.jpg',
        pathColor: '#D2691E',
        decorations: ['🌳', '🌸', '🦋', '🐛'],
        // Long winding path with multiple turns - beginner friendly but strategic
        path: [
            {x: 0, y: 300},
            {x: 80, y: 300},
            {x: 120, y: 260},
            {x: 120, y: 180},
            {x: 180, y: 140},
            {x: 260, y: 140},
            {x: 300, y: 180},
            {x: 300, y: 260},
            {x: 340, y: 300},
            {x: 420, y: 300},
            {x: 460, y: 340},
            {x: 460, y: 420},
            {x: 500, y: 460},
            {x: 580, y: 460},
            {x: 620, y: 420},
            {x: 620, y: 340},
            {x: 660, y: 300},
            {x: 740, y: 300},
            {x: 800, y: 300}
        ]
    },
    mountains: {
        name: 'Alpine Run',
        background: '#7f8c8d',
        pathColor: '#5d4e75',
        decorations: ['🏔️', '🌲', '🦅', '⛰️'],
        // Spiral path climbing the mountain - intermediate difficulty
        path: [
            {x: 400, y: 600},
            {x: 400, y: 520},
            {x: 320, y: 480},
            {x: 240, y: 480},
            {x: 180, y: 440},
            {x: 140, y: 380},
            {x: 140, y: 300},
            {x: 180, y: 240},
            {x: 260, y: 200},
            {x: 340, y: 200},
            {x: 400, y: 160},
            {x: 460, y: 200},
            {x: 540, y: 200},
            {x: 620, y: 240},
            {x: 660, y: 300},
            {x: 660, y: 380},
            {x: 620, y: 440},
            {x: 540, y: 480},
            {x: 460, y: 480},
            {x: 400, y: 440},
            {x: 400, y: 380},
            {x: 440, y: 340},
            {x: 500, y: 320},
            {x: 560, y: 320},
            {x: 620, y: 340},
            {x: 680, y: 380},
            {x: 740, y: 420},
            {x: 800, y: 460}
        ]
    },
    desert: {
        name: 'Oasis Loop',
        background: '#f39c12',
        pathColor: '#d68910',
        decorations: ['🌵', '🦂', '🐪', '☀️'],
        // Figure-8 pattern with center crossing - advanced strategy
        path: [
            {x: 0, y: 200},
            {x: 100, y: 200},
            {x: 160, y: 160},
            {x: 200, y: 100},
            {x: 260, y: 60},
            {x: 340, y: 60},
            {x: 400, y: 100},
            {x: 440, y: 160},
            {x: 460, y: 220},
            {x: 460, y: 280},
            {x: 440, y: 340},
            {x: 400, y: 400},
            {x: 340, y: 440},
            {x: 260, y: 440},
            {x: 200, y: 400},
            {x: 160, y: 340},
            {x: 140, y: 280},
            {x: 140, y: 220},
            {x: 160, y: 280},
            {x: 200, y: 340},
            {x: 260, y: 380},
            {x: 340, y: 380},
            {x: 400, y: 340},
            {x: 440, y: 280},
            {x: 460, y: 220},
            {x: 500, y: 200},
            {x: 580, y: 200},
            {x: 640, y: 240},
            {x: 680, y: 300},
            {x: 720, y: 360},
            {x: 780, y: 400},
            {x: 800, y: 420}
        ]
    },
    snow: {
        name: 'Frozen Over',
        background: '#ecf0f1',
        pathColor: '#bdc3c7',
        decorations: ['🌨️', '⛄', '🐧', '🦌'],
        // Multiple parallel paths that merge - expert level
        path: [
            {x: 0, y: 150},
            {x: 100, y: 150},
            {x: 140, y: 120},
            {x: 180, y: 80},
            {x: 240, y: 60},
            {x: 300, y: 80},
            {x: 340, y: 120},
            {x: 360, y: 180},
            {x: 360, y: 250},
            {x: 340, y: 310},
            {x: 300, y: 350},
            {x: 240, y: 370},
            {x: 180, y: 350},
            {x: 140, y: 310},
            {x: 120, y: 250},
            {x: 120, y: 180},
            {x: 140, y: 250},
            {x: 180, y: 290},
            {x: 240, y: 310},
            {x: 300, y: 290},
            {x: 340, y: 250},
            {x: 380, y: 200},
            {x: 440, y: 180},
            {x: 500, y: 200},
            {x: 540, y: 250},
            {x: 560, y: 310},
            {x: 560, y: 380},
            {x: 540, y: 440},
            {x: 500, y: 480},
            {x: 440, y: 500},
            {x: 380, y: 480},
            {x: 340, y: 440},
            {x: 320, y: 380},
            {x: 340, y: 440},
            {x: 400, y: 480},
            {x: 480, y: 500},
            {x: 560, y: 500},
            {x: 620, y: 480},
            {x: 660, y: 440},
            {x: 680, y: 380},
            {x: 720, y: 340},
            {x: 780, y: 320},
            {x: 800, y: 300}
        ]
    },
    ocean: {
        name: 'Archipelago',
        background: '#3498db',
        pathColor: '#2980b9',
        decorations: ['🏝️', '🐠', '🦀', '⛵'],
        // Island hopping with tight corners - master difficulty
        path: [
            {x: 0, y: 300},
            {x: 60, y: 300},
            {x: 100, y: 260},
            {x: 100, y: 200},
            {x: 60, y: 160},
            {x: 100, y: 120},
            {x: 160, y: 100},
            {x: 220, y: 120},
            {x: 260, y: 160},
            {x: 260, y: 220},
            {x: 300, y: 260},
            {x: 360, y: 260},
            {x: 400, y: 220},
            {x: 400, y: 160},
            {x: 360, y: 120},
            {x: 300, y: 100},
            {x: 240, y: 80},
            {x: 180, y: 60},
            {x: 240, y: 40},
            {x: 300, y: 40},
            {x: 360, y: 60},
            {x: 420, y: 100},
            {x: 480, y: 140},
            {x: 540, y: 160},
            {x: 600, y: 160},
            {x: 640, y: 200},
            {x: 660, y: 260},
            {x: 660, y: 320},
            {x: 640, y: 380},
            {x: 600, y: 420},
            {x: 540, y: 440},
            {x: 480, y: 440},
            {x: 420, y: 420},
            {x: 380, y: 380},
            {x: 360, y: 320},
            {x: 360, y: 380},
            {x: 400, y: 440},
            {x: 460, y: 480},
            {x: 520, y: 500},
            {x: 580, y: 500},
            {x: 640, y: 480},
            {x: 680, y: 440},
            {x: 720, y: 400},
            {x: 760, y: 360},
            {x: 800, y: 320}
        ]
    }
};

// Tower types
const towerTypes = {
    archer: {
        emoji: '🏹',
        cost: 20,
        damage: 15,
        range: 100,
        fireRate: 1000,
        projectile: '🏹'
    },
    cannon: {
        emoji: '💣',
        cost: 40,
        damage: 30,
        range: 80,
        fireRate: 1500,
        projectile: '💥'
    },
    magic: {
        emoji: '🔮',
        cost: 60,
        damage: 25,
        range: 120,
        fireRate: 800,
        projectile: '✨'
    },
    ice: {
        emoji: '❄️',
        cost: 50,
        damage: 10,
        range: 90,
        fireRate: 1200,
        projectile: '🧊',
        slowEffect: 0.5
    },
    lightning: {
        emoji: '⚡',
        cost: 80,
        damage: 20,
        range: 110,
        fireRate: 1800,
        projectile: '⚡',
        chainCount: 2,      // Number of additional enemies to chain to
        chainRange: 80,     // Range for chaining to nearby enemies
        chainDamageDecay: 0.7 // Damage multiplier for each chain (70% of previous)
    }
};

// Enemy types
const enemyTypes = {
    basic: {
        emoji: '👹',
        health: 50,
        speed: 1,
        reward: 10,
        size: 30
    },
    fast: {
        emoji: '🏃',
        health: 30,
        speed: 2,
        reward: 15,
        size: 30
    },
    tank: {
        emoji: '🛡️',
        health: 100,
        speed: 0.5,
        reward: 25,
        size: 35
    },
    heavy: {
        emoji: '🦏',
        health: 200,
        speed: 0.4,
        reward: 40,
        size: 40
    },
    armored: {
        emoji: '🤖',
        health: 300,
        speed: 0.6,
        reward: 60,
        size: 45
    },
    giant: {
        emoji: '🐉',
        health: 500,
        speed: 0.3,
        reward: 100,
        size: 50
    },
    boss: {
        emoji: '👑',
        health: 800,
        speed: 0.4,
        reward: 150,
        size: 55
    }
};

// Initialize game
function init() {
    game.canvas = document.getElementById('gameCanvas');
    game.ctx = game.canvas.getContext('2d');
    
    // Set up event listeners
    game.canvas.addEventListener('click', handleCanvasClick);
    game.canvas.addEventListener('mousemove', handleMouseMove);
    
    // Load background images
    loadBackgroundImages();
    
    // Load initial level
    loadLevel('grass');
    
    // Start game loop
    gameLoop();
    updateUI();
}

// Load background images for levels
function loadBackgroundImages() {
    // Load Monkey Meadow background
    const monkeyMeadowImg = new Image();
    monkeyMeadowImg.onload = function() {
        game.backgroundImages['grass'] = monkeyMeadowImg;
        console.log('Monkey Meadow background loaded');
    };
    monkeyMeadowImg.onerror = function() {
        console.log('Failed to load Monkey Meadow background, using fallback color');
    };
    monkeyMeadowImg.src = 'static/img/monkey-meadow-bg.jpg';
}

// Level selection
function selectLevel(levelName) {
    if (game.gameRunning) {
        alert('Cannot change levels during a wave!');
        return;
    }
    
    // Update button states
    document.querySelectorAll('.level-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    loadLevel(levelName);
}

function loadLevel(levelName) {
    game.selectedLevel = levelName;
    const level = levels[levelName];
    
    // Reset game state for new level
    game.enemies = [];
    game.towers = [];
    game.projectiles = [];
    game.path = [...level.path]; // Copy the predefined path
    game.gameRunning = false;
    
    // Update canvas background (only if no background image available)
    if (!game.backgroundImages[levelName]) {
        game.canvas.style.background = level.background;
    } else {
        game.canvas.style.background = 'transparent';
    }
}

// Mouse event handlers
let mouseX = 0;
let mouseY = 0;

function handleMouseMove(e) {
    const rect = game.canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
}

function handleCanvasClick(e) {
    const rect = game.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // First check if clicking on an existing tower
    const clickedTowerIndex = findTowerAtPosition(x, y);
    if (clickedTowerIndex !== -1) {
        selectExistingTower(clickedTowerIndex);
        return;
    }
    
    // If we have a tower type selected for placement
    if (game.selectedTowerType) {
        // Check if position is valid (not on path)
        if (isValidTowerPosition(x, y)) {
            placeTower(x, y);
        } else {
            // Visual feedback for invalid placement
            showInvalidPlacement(x, y);
        }
    } else {
        // Deselect any selected tower
        deselectTower();
    }
}

function showInvalidPlacement(x, y) {
    // Flash red circle to indicate invalid placement
    const originalFillStyle = game.ctx.fillStyle;
    game.ctx.fillStyle = 'rgba(231, 76, 60, 0.5)';
    game.ctx.beginPath();
    game.ctx.arc(x, y, 30, 0, 2 * Math.PI);
    game.ctx.fill();
    game.ctx.fillStyle = originalFillStyle;
    
    setTimeout(() => {
        // The red circle will be cleared on next render
    }, 200);
}

// Tower placement and selection
function selectTower(type) {
    const towerType = towerTypes[type];
    if (game.gold >= towerType.cost) {
        game.selectedTowerType = type;
        game.selectedTowerIndex = null; // Deselect any existing tower
        game.canvas.style.cursor = 'crosshair';
        
        // Update button states
        document.querySelectorAll('.tower-button').forEach(btn => {
            btn.style.background = '#3498db';
        });
        document.getElementById(type + 'Btn').style.background = '#e74c3c';
        
        // Hide tower info panel
        document.getElementById('selectedTowerInfo').style.display = 'none';
    }
}

function findTowerAtPosition(x, y) {
    for (let i = 0; i < game.towers.length; i++) {
        const tower = game.towers[i];
        const distance = Math.sqrt((x - tower.x) ** 2 + (y - tower.y) ** 2);
        if (distance < 30) { // 30px click radius
            return i;
        }
    }
    return -1;
}

function selectExistingTower(towerIndex) {
    game.selectedTowerIndex = towerIndex;
    game.selectedTowerType = null; // Clear tower placement mode
    game.canvas.style.cursor = 'default';
    
    // Clear tower button selection
    document.querySelectorAll('.tower-button').forEach(btn => {
        btn.style.background = '#3498db';
    });
    
    // Show tower info panel
    updateTowerInfoPanel();
}

function deselectTower() {
    game.selectedTowerIndex = null;
    game.selectedTowerType = null;
    game.canvas.style.cursor = 'default';
    
    // Clear tower button selection
    document.querySelectorAll('.tower-button').forEach(btn => {
        btn.style.background = '#3498db';
    });
    
    // Hide tower info panel
    document.getElementById('selectedTowerInfo').style.display = 'none';
}

function updateTowerInfoPanel() {
    if (game.selectedTowerIndex === null) return;
    
    const tower = game.towers[game.selectedTowerIndex];
    const panel = document.getElementById('selectedTowerInfo');
    const details = document.getElementById('towerDetails');
    const upgradeBtn = document.getElementById('upgradeBtn');
    const sellBtn = document.getElementById('sellBtn');
    
    panel.style.display = 'block';
    
    const upgradeCost = getUpgradeCost(tower);
    const sellValue = getSellValue(tower);
    
    let specialStats = '';
    if (tower.slowEffect) {
        specialStats += `<p>Slow Effect: ${Math.round((1-tower.slowEffect)*100)}%</p>`;
    }
    if (tower.type === 'lightning') {
        specialStats += `<p>Chain Count: ${tower.chainCount}</p>`;
        specialStats += `<p>Chain Range: ${Math.round(tower.chainRange)}</p>`;
        specialStats += `<p>Chain Damage: ${Math.round(tower.chainDamageDecay * 100)}%</p>`;
    }
    
    details.innerHTML = `
        <div style="font-size: 12px; color: #bdc3c7;">
            <p><strong>${tower.emoji} ${tower.type.charAt(0).toUpperCase() + tower.type.slice(1)} Tower</strong></p>
            <p>Level: ${tower.level}/3</p>
            <p>Damage: ${Math.round(tower.damage)}</p>
            <p>Range: ${Math.round(tower.range)}</p>
            <p>Fire Rate: ${(1000/tower.fireRate).toFixed(1)}/sec</p>
            ${specialStats}
        </div>
    `;
    
    if (tower.level < 3) {
        upgradeBtn.style.display = 'block';
        upgradeBtn.textContent = `⬆️ Upgrade (${upgradeCost}💰)`;
        upgradeBtn.disabled = game.gold < upgradeCost;
    } else {
        upgradeBtn.style.display = 'none';
    }
    
    sellBtn.textContent = `💰 Sell (+${sellValue}💰)`;
}

function placeTower(x, y) {
    const towerType = towerTypes[game.selectedTowerType];
    
    if (game.gold >= towerType.cost) {
        const tower = {
            x,
            y,
            type: game.selectedTowerType,
            lastFired: 0,
            level: 1,
            totalInvested: towerType.cost, // Track total money invested
            ...towerType
        };
        
        game.towers.push(tower);
        game.gold -= towerType.cost;
        game.selectedTowerType = null;
        game.canvas.style.cursor = 'default';
        
        // Reset button states
        document.querySelectorAll('.tower-button').forEach(btn => {
            btn.style.background = '#3498db';
        });
        
        updateUI();
    }
}

function getUpgradeCost(tower) {
    const baseCost = towerTypes[tower.type].cost;
    return Math.round(baseCost * (0.8 * tower.level)); // Upgrade cost increases with level
}

function getSellValue(tower) {
    return Math.round(tower.totalInvested * 0.7); // Get 70% of invested money back
}

function upgradeTower() {
    if (game.selectedTowerIndex === null) return;
    
    const tower = game.towers[game.selectedTowerIndex];
    const upgradeCost = getUpgradeCost(tower);
    
    if (tower.level >= 3) {
        alert('Tower is already at maximum level!');
        return;
    }
    
    if (game.gold < upgradeCost) {
        alert('Not enough gold to upgrade!');
        return;
    }
    
    // Apply upgrade
    game.gold -= upgradeCost;
    tower.totalInvested += upgradeCost;
    tower.level++;
    
    // Increase tower stats
    const upgradeMultiplier = 1.5;
    tower.damage = Math.round(tower.damage * upgradeMultiplier);
    tower.range = Math.round(tower.range * 1.2);
    tower.fireRate = Math.round(tower.fireRate * 0.8); // Faster firing (lower is faster)
    
    // Special upgrade effects
    if (tower.slowEffect) {
        tower.slowEffect = Math.max(0.2, tower.slowEffect * 0.8); // Better slow effect
    }
    
    // Lightning tower upgrade effects
    if (tower.type === 'lightning') {
        tower.chainCount = Math.min(5, tower.chainCount + 1); // Max 5 chains
        tower.chainRange = Math.round(tower.chainRange * 1.15); // Increase chain range
        tower.chainDamageDecay = Math.max(0.5, tower.chainDamageDecay - 0.05); // Less damage decay (better chaining)
    }
    
    updateTowerInfoPanel();
    updateUI();
}

function sellTower() {
    if (game.selectedTowerIndex === null) return;
    
    const tower = game.towers[game.selectedTowerIndex];
    const sellValue = getSellValue(tower);
    
    if (confirm(`Sell this tower for ${sellValue} gold?`)) {
        game.gold += sellValue;
        game.towers.splice(game.selectedTowerIndex, 1);
        deselectTower();
        updateUI();
    }
}

function isValidTowerPosition(x, y) {
    // Check if too close to path
    for (let point of game.path) {
        const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
        if (distance < 40) return false;
    }
    
    // Check if too close to other towers
    for (let tower of game.towers) {
        const distance = Math.sqrt((x - tower.x) ** 2 + (y - tower.y) ** 2);
        if (distance < 50) return false;
    }
    
    // Check if position conflicts with level obstacles
    const obstacles = getLevelObstacles();
    for (let obstacle of obstacles) {
        const distance = Math.sqrt((x - obstacle.x) ** 2 + (y - obstacle.y) ** 2);
        if (distance < obstacle.radius) return false;
    }
    
    // Check canvas boundaries
    if (x < 30 || x > game.canvas.width - 30 || y < 30 || y > game.canvas.height - 30) {
        return false;
    }
    
    return true;
}

function getLevelObstacles() {
    // Define obstacles for each level that block tower placement
    switch(game.selectedLevel) {
        case 'grass':
            return [
                {x: 150, y: 100, radius: 30},  // Monkey areas (reduced size)
                {x: 650, y: 150, radius: 30},
                {x: 300, y: 400, radius: 25},  // Banana spots
                {x: 500, y: 200, radius: 25}
            ];
        case 'mountains':
            return [
                {x: 100, y: 100, radius: 40},  // Mountain peaks
                {x: 700, y: 100, radius: 40},
                {x: 400, y: 300, radius: 45},  // Center mountain
                {x: 600, y: 300, radius: 35}
            ];
        case 'desert':
            return [
                {x: 300, y: 250, radius: 40},  // Oasis center
                {x: 80, y: 120, radius: 35},   // Large cacti
                {x: 520, y: 120, radius: 35},
                {x: 680, y: 280, radius: 35}
            ];
        case 'snow':
            return [
                {x: 200, y: 200, radius: 35},  // Ice blocks
                {x: 560, y: 320, radius: 35},
                {x: 400, y: 400, radius: 35},
                {x: 80, y: 320, radius: 35}    // Snowmen
            ];
        case 'ocean':
            return [
                {x: 130, y: 180, radius: 40},  // Islands
                {x: 330, y: 180, radius: 40},
                {x: 530, y: 320, radius: 40},
                {x: 200, y: 480, radius: 40},
                {x: 600, y: 480, radius: 40}
            ];
        default:
            return [];
    }
}

// Wave management
function startWave() {
    if (game.path.length < 2) {
        alert('No path available!');
        return;
    }
    
    // Prevent manual start during countdown (except for wave 1)
    if (game.isCountingDown && game.wave > 1) {
        alert(`Next wave starts automatically in ${game.waveCountdown} seconds!`);
        return;
    }
    
    // Prevent starting if game is already running
    if (game.gameRunning) {
        alert('Wave is already in progress!');
        return;
    }
    
    game.gameRunning = true;
    game.enemiesSpawned = 0;
    game.enemiesKilled = 0;
    game.isCountingDown = false; // Stop any countdown
    spawnEnemies();
}

function spawnEnemies() {
    if (game.enemiesSpawned >= game.waveSize) return;
    
    const enemyType = selectEnemyTypeForWave(game.wave);
    const enemyTemplate = enemyTypes[enemyType];
    
    // Scale enemy stats based on wave
    const healthMultiplier = 1 + (game.wave - 1) * 0.25; // 15% more health per wave
    const rewardMultiplier = 1 + (game.wave - 1) * 0.1;  // 10% more reward per wave
    const speedMultiplier = 1 + (game.wave - 1) * 0.25;   // 10% more speed per wave
    
    const scaledHealth = Math.round(enemyTemplate.health * healthMultiplier);
    const scaledReward = Math.round(enemyTemplate.reward * rewardMultiplier);
    const scaledSpeed = enemyTemplate.speed * speedMultiplier;
    
    const enemy = {
        x: game.path[0].x,
        y: game.path[0].y,
        pathIndex: 0,
        pathProgress: 0,
        health: scaledHealth,
        maxHealth: scaledHealth,
        speed: scaledSpeed,
        slowEffect: 1,
        slowDuration: 0,
        reward: scaledReward,
        ...enemyTemplate
    };
    
    game.enemies.push(enemy);
    game.enemiesSpawned++;
    
    if (game.enemiesSpawned < game.waveSize) {
        // Spawn enemies faster in later waves (minimum 200ms between spawns)
        const baseSpawnDelay = 1000;
        const spawnSpeedMultiplier = Math.max(0.2, 1 - (game.wave - 1) * 0.08); // 8% faster per wave
        const spawnDelay = Math.round(baseSpawnDelay * spawnSpeedMultiplier);
        
        setTimeout(spawnEnemies, spawnDelay);
    }
}

function selectEnemyTypeForWave(wave) {
    // Define enemy spawn probabilities based on wave
    const spawnTables = {
        1: { basic: 70, fast: 20, tank: 10 },
        2: { basic: 60, fast: 25, tank: 15 },
        3: { basic: 50, fast: 30, tank: 15, heavy: 5 },
        4: { basic: 40, fast: 25, tank: 20, heavy: 15 },
        5: { basic: 30, fast: 20, tank: 25, heavy: 20, armored: 5 },
        6: { basic: 25, fast: 15, tank: 20, heavy: 25, armored: 15 },
        7: { basic: 20, fast: 10, tank: 15, heavy: 25, armored: 25, giant: 5 },
        8: { basic: 15, fast: 10, tank: 10, heavy: 20, armored: 30, giant: 15 },
        9: { basic: 10, fast: 5, tank: 10, heavy: 15, armored: 25, giant: 30, boss: 5 },
        10: { basic: 5, fast: 5, tank: 5, heavy: 10, armored: 20, giant: 35, boss: 20 }
    };
    
    // Get spawn table for current wave (use wave 10 table for waves beyond 10)
    const currentTable = spawnTables[Math.min(wave, 10)];
    
    // Convert percentages to weighted selection
    const weightedEnemies = [];
    for (const [enemyType, weight] of Object.entries(currentTable)) {
        for (let i = 0; i < weight; i++) {
            weightedEnemies.push(enemyType);
        }
    }
    
    // Select random enemy based on weights
    return weightedEnemies[Math.floor(Math.random() * weightedEnemies.length)];
}

// Game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

function update() {
    updateEnemies();
    updateTowers();
    updateProjectiles();
    updateLightningEffects();
    checkWaveComplete();
    updateUI();
}

function updateEnemies() {
    for (let i = game.enemies.length - 1; i >= 0; i--) {
        const enemy = game.enemies[i];
        
        // Update slow effect
        if (enemy.slowDuration > 0) {
            enemy.slowDuration--;
            if (enemy.slowDuration <= 0) {
                enemy.slowEffect = 1;
            }
        }
        
        // Move enemy along path
        moveEnemyAlongPath(enemy);
        
        // Check if enemy reached end
        if (enemy.pathIndex >= game.path.length - 1) {
            game.lives--;
            game.enemies.splice(i, 1);
            if (game.lives <= 0) {
                gameOver();
            }
        }
        
        // Remove dead enemies
        if (enemy.health <= 0) {
            game.gold += enemy.reward;
            game.enemies.splice(i, 1);
            game.enemiesKilled++;
        }
    }
}

function moveEnemyAlongPath(enemy) {
    if (enemy.pathIndex >= game.path.length - 1) return;
    
    const currentPoint = game.path[enemy.pathIndex];
    const nextPoint = game.path[enemy.pathIndex + 1];
    
    const dx = nextPoint.x - currentPoint.x;
    const dy = nextPoint.y - currentPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const moveDistance = enemy.speed * enemy.slowEffect;
    enemy.pathProgress += moveDistance / distance;
    
    if (enemy.pathProgress >= 1) {
        enemy.pathIndex++;
        enemy.pathProgress = 0;
    }
    
    if (enemy.pathIndex < game.path.length - 1) {
        const current = game.path[enemy.pathIndex];
        const next = game.path[enemy.pathIndex + 1];
        
        enemy.x = current.x + (next.x - current.x) * enemy.pathProgress;
        enemy.y = current.y + (next.y - current.y) * enemy.pathProgress;
    }
}

function updateTowers() {
    const currentTime = Date.now();
    
    for (let tower of game.towers) {
        if (currentTime - tower.lastFired > tower.fireRate) {
            const target = findNearestEnemy(tower);
            if (target) {
                fireTower(tower, target);
                tower.lastFired = currentTime;
            }
        }
    }
}

function findNearestEnemy(tower) {
    let nearest = null;
    let nearestDistance = tower.range;
    
    for (let enemy of game.enemies) {
        const distance = Math.sqrt((tower.x - enemy.x) ** 2 + (tower.y - enemy.y) ** 2);
        if (distance < nearestDistance) {
            nearest = enemy;
            nearestDistance = distance;
        }
    }
    
    return nearest;
}

function fireTower(tower, target) {
    if (tower.type === 'lightning') {
        // Lightning tower creates instant chain lightning
        createChainLightning(tower, target);
    } else {
        // Regular projectile
        const projectile = {
            x: tower.x,
            y: tower.y,
            targetX: target.x,
            targetY: target.y,
            target: target,
            damage: tower.damage,
            speed: 5,
            emoji: tower.projectile,
            slowEffect: tower.slowEffect || null
        };
        
        game.projectiles.push(projectile);
    }
}

function createChainLightning(tower, initialTarget) {
    const hitEnemies = new Set(); // Track which enemies have been hit to avoid double-hitting
    const lightningChains = []; // Store lightning visual effects
    
    // Hit the initial target
    if (initialTarget && game.enemies.includes(initialTarget)) {
        initialTarget.health -= tower.damage;
        hitEnemies.add(initialTarget);
        
        // Create visual lightning bolt from tower to first target
        lightningChains.push({
            fromX: tower.x,
            fromY: tower.y,
            toX: initialTarget.x,
            toY: initialTarget.y,
            duration: 15 // frames to show the lightning
        });
        
        // Chain to nearby enemies
        let currentTarget = initialTarget;
        let currentDamage = tower.damage * tower.chainDamageDecay;
        
        for (let chain = 0; chain < tower.chainCount; chain++) {
            const nextTarget = findNearestEnemyForChain(currentTarget, tower.chainRange, hitEnemies);
            
            if (!nextTarget) break; // No more enemies to chain to
            
            // Damage the chained enemy
            nextTarget.health -= Math.round(currentDamage);
            hitEnemies.add(nextTarget);
            
            // Create visual chain lightning
            lightningChains.push({
                fromX: currentTarget.x,
                fromY: currentTarget.y,
                toX: nextTarget.x,
                toY: nextTarget.y,
                duration: 15
            });
            
            // Prepare for next chain
            currentTarget = nextTarget;
            currentDamage *= tower.chainDamageDecay;
        }
    }
    
    // Add lightning visual effects to game state
    if (!game.lightningEffects) {
        game.lightningEffects = [];
    }
    
    // Add all lightning chains with slight delays for visual effect
    lightningChains.forEach((chain, index) => {
        setTimeout(() => {
            game.lightningEffects.push(chain);
        }, index * 50); // 50ms delay between each chain
    });
}

function findNearestEnemyForChain(fromEnemy, chainRange, hitEnemies) {
    let nearest = null;
    let nearestDistance = chainRange;
    
    for (let enemy of game.enemies) {
        if (hitEnemies.has(enemy)) continue; // Skip already hit enemies
        if (enemy.health <= 0) continue; // Skip dead enemies
        
        const distance = Math.sqrt((fromEnemy.x - enemy.x) ** 2 + (fromEnemy.y - enemy.y) ** 2);
        if (distance < nearestDistance) {
            nearest = enemy;
            nearestDistance = distance;
        }
    }
    
    return nearest;
}

function updateProjectiles() {
    for (let i = game.projectiles.length - 1; i >= 0; i--) {
        const projectile = game.projectiles[i];
        
        // Move projectile towards target
        const dx = projectile.targetX - projectile.x;
        const dy = projectile.targetY - projectile.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < projectile.speed) {
            // Hit target
            if (projectile.target && game.enemies.includes(projectile.target)) {
                projectile.target.health -= projectile.damage;
                
                // Apply slow effect
                if (projectile.slowEffect) {
                    projectile.target.slowEffect = projectile.slowEffect;
                    projectile.target.slowDuration = 120; // 2 seconds at 60fps
                }
            }
            game.projectiles.splice(i, 1);
        } else {
            projectile.x += (dx / distance) * projectile.speed;
            projectile.y += (dy / distance) * projectile.speed;
        }
    }
}

function updateLightningEffects() {
    if (!game.lightningEffects) return;
    
    for (let i = game.lightningEffects.length - 1; i >= 0; i--) {
        const effect = game.lightningEffects[i];
        effect.duration--;
        
        if (effect.duration <= 0) {
            game.lightningEffects.splice(i, 1);
        }
    }
}

function checkWaveComplete() {
    if (game.gameRunning && game.enemies.length === 0 && game.enemiesSpawned >= game.waveSize) {
        game.gameRunning = false;
        game.gold += 50; // Wave completion bonus
        
        // Check if game is complete (10 waves)
        if (game.wave >= game.maxWaves) {
            gameComplete();
            return;
        }
        
        // Start countdown for next wave
        game.wave++;
        game.waveSize = Math.round(game.waveSize * 1.5); // 1.5x enemies each wave
        startWaveCountdown();
    }
}

function startWaveCountdown() {
    game.waveCountdown = 5; // 5 second countdown
    game.isCountingDown = true;
    
    const countdownInterval = setInterval(() => {
        game.waveCountdown--;
        
        if (game.waveCountdown <= 0) {
            clearInterval(countdownInterval);
            game.isCountingDown = false;
            startWave(); // Auto-start next wave
        }
    }, 1000); // Update every second
}

function gameComplete() {
    alert(`🎉 Congratulations! You've completed all ${game.maxWaves} waves! 🎉\n\nFinal Score:\n• Waves Survived: ${game.wave}\n• Gold Remaining: ${game.gold}\n• Lives Remaining: ${game.lives}`);
    resetGame();
}

// Rendering
function render() {
    const level = levels[game.selectedLevel];
    
    // Clear canvas with level background
    if (game.backgroundImages[game.selectedLevel]) {
        // Draw background image
        const bgImg = game.backgroundImages[game.selectedLevel];
        game.ctx.drawImage(bgImg, 0, 0, game.canvas.width, game.canvas.height);
    } else {
        // Fallback to solid color
        game.ctx.fillStyle = level.background;
        game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
    }
    
    // Draw level decorations
    drawLevelDecorations();
    
    // Draw path
    drawPath();
    
    // Draw towers
    drawTowers();
    
    // Draw enemies
    drawEnemies();
    
    // Draw projectiles
    drawProjectiles();
    
    // Draw lightning effects
    drawLightningEffects();
    
    // Draw tower range if selected
    if (game.selectedTowerType) {
        drawTowerRange();
    }
    
    // Draw countdown overlay
    if (game.isCountingDown) {
        drawCountdownOverlay();
    }
}

function drawLevelDecorations() {
    const level = levels[game.selectedLevel];
    
    // Add strategic decorative elements and obstacles based on the theme
    game.ctx.font = '20px Arial';
    game.ctx.textAlign = 'center';
    
    // Static decorations and obstacles for each level type
    switch(game.selectedLevel) {
        case 'grass':
            // Monkey Meadow - minimal decorations since background image has natural elements
            // Only add a few strategic elements that won't interfere with the beautiful background
            drawEmoji('🐒', 150, 100, 25);  // Monkey watching
            drawEmoji('🐒', 650, 150, 25);  // Another monkey
            drawEmoji('🍌', 300, 400, 20);  // Banana
            drawEmoji('🍌', 500, 200, 20);  // Another banana
            break;
        case 'mountains':
            // Alpine Run - rocky peaks and pine forests
            drawEmoji('🏔️', 100, 100, 35);
            drawEmoji('🏔️', 700, 100, 35);
            drawEmoji('🏔️', 400, 300, 40); // Center mountain
            drawEmoji('🌲', 60, 200, 28);
            drawEmoji('🌲', 160, 120, 28);
            drawEmoji('🌲', 640, 120, 28);
            drawEmoji('🌲', 740, 200, 28);
            drawEmoji('🌲', 300, 380, 28);
            drawEmoji('🌲', 500, 380, 28);
            drawEmoji('🦅', 200, 60, 22);
            drawEmoji('⛰️', 600, 300, 32);
            break;
        case 'desert':
            // Oasis Loop - cacti and desert life around the oasis
            drawEmoji('🌵', 80, 120, 30);
            drawEmoji('🌵', 520, 120, 30);
            drawEmoji('🌵', 80, 480, 30);
            drawEmoji('🌵', 520, 480, 30);
            drawEmoji('🌵', 680, 280, 30);
            drawEmoji('🌴', 300, 250, 35); // Oasis center
            drawEmoji('💧', 280, 270, 25); // Oasis water
            drawEmoji('💧', 320, 270, 25);
            drawEmoji('🦂', 160, 500, 20);
            drawEmoji('🐪', 600, 80, 25);
            drawEmoji('☀️', 700, 60, 35);
            break;
        case 'snow':
            // Frozen Over - ice formations and arctic wildlife
            drawEmoji('⛄', 80, 320, 30);
            drawEmoji('⛄', 480, 120, 30);
            drawEmoji('⛄', 680, 520, 30);
            drawEmoji('🧊', 200, 200, 28); // Ice blocks as obstacles
            drawEmoji('🧊', 560, 320, 28);
            drawEmoji('🧊', 400, 400, 28);
            drawEmoji('🌨️', 160, 80, 25);
            drawEmoji('🌨️', 640, 80, 25);
            drawEmoji('🐧', 120, 480, 25);
            drawEmoji('🐧', 280, 520, 25);
            drawEmoji('🦌', 600, 200, 28);
            break;
        case 'ocean':
            // Archipelago - islands and marine life
            drawEmoji('🏝️', 130, 180, 35); // Strategic islands
            drawEmoji('🏝️', 330, 180, 35);
            drawEmoji('🏝️', 530, 320, 35);
            drawEmoji('🏝️', 200, 480, 35);
            drawEmoji('🏝️', 600, 480, 35);
            drawEmoji('🐠', 80, 400, 22);
            drawEmoji('🐠', 280, 320, 22);
            drawEmoji('🐠', 480, 200, 22);
            drawEmoji('🦀', 160, 520, 20);
            drawEmoji('🦀', 640, 360, 20);
            drawEmoji('⛵', 700, 120, 25);
            drawEmoji('🌊', 400, 80, 30); // Wave effects
            break;
    }
}

function drawPath() {
    if (game.path.length < 2) return;
    
    const level = levels[game.selectedLevel];
    
    game.ctx.strokeStyle = level.pathColor;
    game.ctx.lineWidth = 30;
    game.ctx.lineCap = 'round';
    game.ctx.lineJoin = 'round';
    
    game.ctx.beginPath();
    game.ctx.moveTo(game.path[0].x, game.path[0].y);
    
    for (let i = 1; i < game.path.length; i++) {
        game.ctx.lineTo(game.path[i].x, game.path[i].y);
    }
    
    game.ctx.stroke();
    
    // Draw start and end markers
    if (game.path.length > 0) {
        drawEmoji('🚪', game.path[0].x, game.path[0].y, 30);
        drawEmoji('🏁', game.path[game.path.length - 1].x, game.path[game.path.length - 1].y, 30);
    }
}

function drawTowers() {
    for (let i = 0; i < game.towers.length; i++) {
        const tower = game.towers[i];
        const isSelected = game.selectedTowerIndex === i;
        
        // Draw selection highlight
        if (isSelected) {
            game.ctx.strokeStyle = '#f1c40f';
            game.ctx.lineWidth = 3;
            game.ctx.beginPath();
            game.ctx.arc(tower.x, tower.y, 35, 0, 2 * Math.PI);
            game.ctx.stroke();
            
            // Draw range circle for selected tower
            game.ctx.strokeStyle = 'rgba(241, 196, 15, 0.6)';
            game.ctx.fillStyle = 'rgba(241, 196, 15, 0.1)';
            game.ctx.lineWidth = 2;
            game.ctx.beginPath();
            game.ctx.arc(tower.x, tower.y, tower.range, 0, 2 * Math.PI);
            game.ctx.fill();
            game.ctx.stroke();
        }
        
        // Draw tower emoji with size based on level
        const towerSize = 35 + (tower.level * 3);
        drawEmoji(tower.emoji, tower.x, tower.y, towerSize);
        
        // Draw level indicator
        game.ctx.fillStyle = '#2c3e50';
        game.ctx.fillRect(tower.x - 20, tower.y - 40, 40, 6);
        
        // Color based on level
        const levelColors = ['#e74c3c', '#f39c12', '#27ae60'];
        game.ctx.fillStyle = levelColors[tower.level - 1] || '#3498db';
        game.ctx.fillRect(tower.x - 20, tower.y - 40, 40 * (tower.level / 3), 6);
        
        // Draw level number
        game.ctx.fillStyle = 'white';
        game.ctx.font = '12px Arial';
        game.ctx.textAlign = 'center';
        game.ctx.fillText(tower.level, tower.x, tower.y + 50);
    }
}

function drawEnemies() {
    for (let enemy of game.enemies) {
        // Draw enemy with appropriate size
        const enemySize = enemy.size || 30;
        drawEmoji(enemy.emoji, enemy.x, enemy.y, enemySize);
        
        // Draw health bar (larger for bigger enemies)
        const barWidth = Math.max(30, enemySize * 0.8);
        const barHeight = Math.max(4, enemySize * 0.1);
        const healthPercent = enemy.health / enemy.maxHealth;
        const barY = enemy.y - (enemySize * 0.6);
        
        // Health bar background
        game.ctx.fillStyle = '#2c3e50';
        game.ctx.fillRect(enemy.x - barWidth/2 - 1, barY - 1, barWidth + 2, barHeight + 2);
        
        // Health bar (red background)
        game.ctx.fillStyle = '#e74c3c';
        game.ctx.fillRect(enemy.x - barWidth/2, barY, barWidth, barHeight);
        
        // Health bar (green foreground)
        game.ctx.fillStyle = '#27ae60';
        game.ctx.fillRect(enemy.x - barWidth/2, barY, barWidth * healthPercent, barHeight);
        
        // Draw armor indicator for heavily armored enemies
        if (enemy.health > 200) {
            game.ctx.fillStyle = '#95a5a6';
            game.ctx.font = '12px Arial';
            game.ctx.textAlign = 'center';
            game.ctx.fillText('🛡️', enemy.x + enemySize * 0.4, enemy.y - enemySize * 0.4);
        }
        
        // Draw slow effect
        if (enemy.slowEffect < 1) {
            drawEmoji('🧊', enemy.x, enemy.y - enemySize * 0.4, 15);
        }
        
        // Draw boss crown effect
        if (enemy.emoji === '👑') {
            game.ctx.save();
            game.ctx.shadowColor = '#f1c40f';
            game.ctx.shadowBlur = 10;
            drawEmoji('✨', enemy.x - enemySize * 0.3, enemy.y - enemySize * 0.3, 20);
            drawEmoji('✨', enemy.x + enemySize * 0.3, enemy.y - enemySize * 0.3, 20);
            game.ctx.restore();
        }
    }
}

function drawProjectiles() {
    for (let projectile of game.projectiles) {
        drawEmoji(projectile.emoji, projectile.x, projectile.y, 20);
    }
}

function drawLightningEffects() {
    if (!game.lightningEffects) return;
    
    for (let effect of game.lightningEffects) {
        // Draw lightning bolt with animated effect
        const opacity = effect.duration / 15; // Fade out over time
        
        game.ctx.save();
        game.ctx.globalAlpha = opacity;
        game.ctx.strokeStyle = '#f1c40f';
        game.ctx.lineWidth = 3;
        game.ctx.shadowColor = '#f39c12';
        game.ctx.shadowBlur = 8;
        
        // Draw jagged lightning bolt
        game.ctx.beginPath();
        game.ctx.moveTo(effect.fromX, effect.fromY);
        
        // Create jagged lightning path
        const dx = effect.toX - effect.fromX;
        const dy = effect.toY - effect.fromY;
        const segments = 4;
        
        for (let i = 1; i < segments; i++) {
            const progress = i / segments;
            const x = effect.fromX + dx * progress + (Math.random() - 0.5) * 20;
            const y = effect.fromY + dy * progress + (Math.random() - 0.5) * 20;
            game.ctx.lineTo(x, y);
        }
        
        game.ctx.lineTo(effect.toX, effect.toY);
        game.ctx.stroke();
        
        // Draw lightning emoji at the end point
        game.ctx.globalAlpha = opacity * 0.8;
        drawEmoji('⚡', effect.toX, effect.toY, 25);
        
        game.ctx.restore();
    }
}

function drawTowerRange() {
    if (!game.selectedTowerType) return;
    
    const towerType = towerTypes[game.selectedTowerType];
    const isValid = isValidTowerPosition(mouseX, mouseY);
    
    // Draw range circle
    game.ctx.strokeStyle = isValid ? 'rgba(52, 152, 219, 0.6)' : 'rgba(231, 76, 60, 0.6)';
    game.ctx.fillStyle = isValid ? 'rgba(52, 152, 219, 0.1)' : 'rgba(231, 76, 60, 0.1)';
    game.ctx.lineWidth = 2;
    
    game.ctx.beginPath();
    game.ctx.arc(mouseX, mouseY, towerType.range, 0, 2 * Math.PI);
    game.ctx.fill();
    game.ctx.stroke();
    
    // Draw tower preview
    game.ctx.globalAlpha = isValid ? 0.8 : 0.4;
    drawEmoji(towerType.emoji, mouseX, mouseY, 40);
    game.ctx.globalAlpha = 1.0;
}

function drawEmoji(emoji, x, y, size) {
    game.ctx.font = `${size}px Arial`;
    game.ctx.textAlign = 'center';
    game.ctx.textBaseline = 'middle';
    game.ctx.fillText(emoji, x, y);
}

function drawCountdownOverlay() {
    // Semi-transparent overlay
    game.ctx.save();
    game.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
    
    // Countdown text
    const centerX = game.canvas.width / 2;
    const centerY = game.canvas.height / 2;
    
    // Large countdown number
    game.ctx.fillStyle = '#f1c40f';
    game.ctx.font = 'bold 120px Arial';
    game.ctx.textAlign = 'center';
    game.ctx.textBaseline = 'middle';
    game.ctx.strokeStyle = '#2c3e50';
    game.ctx.lineWidth = 4;
    game.ctx.strokeText(game.waveCountdown.toString(), centerX, centerY);
    game.ctx.fillText(game.waveCountdown.toString(), centerX, centerY);
    
    // Wave info text
    game.ctx.fillStyle = '#ecf0f1';
    game.ctx.font = 'bold 32px Arial';
    game.ctx.strokeStyle = '#2c3e50';
    game.ctx.lineWidth = 2;
    const waveText = `Wave ${game.wave} Starting...`;
    game.ctx.strokeText(waveText, centerX, centerY - 80);
    game.ctx.fillText(waveText, centerX, centerY - 80);
    
    // Enemy count info
    game.ctx.font = 'bold 24px Arial';
    const enemyText = `${game.waveSize} Enemies Incoming`;
    game.ctx.strokeText(enemyText, centerX, centerY + 80);
    game.ctx.fillText(enemyText, centerX, centerY + 80);
    
    // Speed and spawn rate info
    game.ctx.font = 'bold 18px Arial';
    const speedMultiplier = 1 + (game.wave - 1) * 0.1;
    const spawnSpeedMultiplier = Math.max(0.2, 1 - (game.wave - 1) * 0.08);
    const speedText = `+${Math.round((speedMultiplier - 1) * 100)}% Speed | ${Math.round((1 - spawnSpeedMultiplier) * 100)}% Faster Spawns`;
    game.ctx.strokeText(speedText, centerX, centerY + 110);
    game.ctx.fillText(speedText, centerX, centerY + 110);
    
    game.ctx.restore();
}

// UI functions
function updateUI() {
    document.getElementById('gold').textContent = game.gold;
    document.getElementById('lives').textContent = game.lives;
    document.getElementById('wave').textContent = game.wave;
    document.getElementById('maxWaves').textContent = game.maxWaves;
    document.getElementById('enemies').textContent = game.enemies.length;
    document.getElementById('totalEnemies').textContent = game.waveSize;
    document.getElementById('enemiesRemaining').textContent = Math.max(0, game.waveSize - game.enemiesKilled);
    
    // Update countdown display
    const countdownInfo = document.getElementById('countdownInfo');
    const countdownSpan = document.getElementById('countdown');
    
    if (game.isCountingDown) {
        countdownInfo.style.display = 'block';
        countdownSpan.textContent = game.waveCountdown;
    } else {
        countdownInfo.style.display = 'none';
    }
    
    // Update start wave button
    const startWaveBtn = document.querySelector('button[onclick="startWave()"]');
    if (game.gameRunning) {
        startWaveBtn.textContent = '⚔️ Wave In Progress';
        startWaveBtn.disabled = true;
    } else if (game.isCountingDown) {
        startWaveBtn.textContent = `⏰ Auto-Start in ${game.waveCountdown}s`;
        startWaveBtn.disabled = true;
    } else {
        startWaveBtn.textContent = '🚀 Start Wave';
        startWaveBtn.disabled = false;
    }
    
    // Update tower button states
    for (let [type, tower] of Object.entries(towerTypes)) {
        const button = document.getElementById(type + 'Btn');
        button.disabled = game.gold < tower.cost;
    }
}

function clearPath() {
    // Not needed anymore since we use predefined paths
    alert('Paths are predefined for each level. Choose a different level to change the path!');
}

function resetGame() {
    game.gold = 100;
    game.lives = 20;
    game.wave = 1;
    game.enemies = [];
    game.towers = [];
    game.projectiles = [];
    game.lightningEffects = [];
    game.selectedTowerType = null;
    game.selectedTowerIndex = null;
    game.gameRunning = false;
    game.enemiesSpawned = 0;
    game.enemiesKilled = 0;
    game.waveSize = 10;
    game.waveCountdown = 0;
    game.isCountingDown = false;
    
    // Hide tower info panel
    document.getElementById('selectedTowerInfo').style.display = 'none';
    
    // Reload current level
    loadLevel(game.selectedLevel);
    
    updateUI();
}

function gameOver() {
    alert(`Game Over! You survived ${game.wave - 1} waves!`);
    resetGame();
}

// Initialize game when page loads
window.addEventListener('load', init);