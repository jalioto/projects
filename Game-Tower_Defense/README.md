# 🏰 Emoji Tower Defense

A fun and challenging tower defense game built with HTML5 Canvas and JavaScript, featuring emoji-based graphics and progressive difficulty scaling.

## 🎮 How to Run

### Option 1: Local File (Simple)
1. Download or clone this repository
2. Open `index.html` in any modern web browser
3. Start playing immediately!

### Option 2: Local Server (Recommended)
For the best experience with background images:

1. **Using Python:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```

2. **Using Node.js:**
   ```bash
   npx serve .
   ```

3. **Using PHP:**
   ```bash
   php -S localhost:8000
   ```

4. Open your browser and go to `http://localhost:8000`

## 🎯 How to Play

### Basic Controls
- **Select Tower**: Click on tower buttons (🏹 🔮 ❄️ ⚡ etc.)
- **Place Tower**: Click on the map where you want to build
- **Select Existing Tower**: Click on any placed tower to upgrade/sell
- **Start Wave**: Click "🚀 Start Wave" or wait for auto-start

### Game Mechanics
- **10 Waves Total**: Complete all waves to win
- **Auto-Progression**: 5-second countdown between waves
- **Tower Upgrades**: Each tower can be upgraded 3 times
- **Enemy Scaling**: Health +15%, Speed +10% per wave
- **Chain Lightning**: ⚡ Lightning towers hit multiple enemies

### Tower Types
- **🏹 Archer** (20💰): Basic ranged tower
- **💣 Cannon** (40💰): High damage, slower rate
- **🔮 Magic** (60💰): Fast firing, good range
- **❄️ Ice** (50💰): Slows enemies down
- **⚡ Lightning** (80💰): Chain lightning damage

### Enemy Types
- **👹 Basic**: Standard enemy
- **🏃 Fast**: Quick but weak
- **🛡️ Tank**: Slow but tough
- **🦏 Heavy**: Very tanky (Wave 3+)
- **🤖 Armored**: High HP, medium speed (Wave 5+)
- **🐉 Giant**: Massive HP, slow (Wave 7+)
- **👑 Boss**: Ultimate challenge (Wave 9+)

## 🗺️ Levels

Choose from 5 different battlefields:
- **🌱 Monkey Meadow**: Beginner-friendly with jungle theme
- **🏔️ Alpine Run**: Mountain spiral path
- **🏜️ Oasis Loop**: Desert figure-8 challenge
- **❄️ Frozen Over**: Icy parallel paths
- **🌊 Archipelago**: Island-hopping expert level

## 🛠️ Technical Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Canvas support
- For background images: local server recommended

## 📁 File Structure

```
Game-Tower_Defense/
├── index.html          # Main game file
├── game.js            # Game logic and mechanics
├── static/
│   └── img/
│       └── monkey-meadow-bg.jpg  # Background image
└── README.md          # This file
```

## 🎊 Features

- **Progressive Difficulty**: Each wave gets harder
- **Visual Effects**: Lightning chains, particle effects
- **Strategic Depth**: Tower upgrades and positioning matter
- **Multiple Levels**: 5 unique maps with different challenges
- **Auto-Save Progress**: Wave progression and gold tracking
- **Responsive Design**: Works on different screen sizes

## 🐛 Troubleshooting

**Background image not loading?**
- Use a local server instead of opening the file directly
- Check that `static/img/monkey-meadow-bg.jpg` exists

**Game running slowly?**
- Close other browser tabs
- Try a different browser
- Reduce browser zoom level

**Towers not placing?**
- Make sure you're clicking away from the path
- Check you have enough gold
- Avoid placing too close to other towers

## 🎮 Tips for Success

1. **Start with basic towers** and upgrade them
2. **Use ice towers** to slow down fast enemies
3. **Lightning towers** are great for groups
4. **Upgrade strategically** - a few strong towers beat many weak ones
5. **Watch the enemy types** - later waves need different strategies

Enjoy defending your realm! 🏰✨