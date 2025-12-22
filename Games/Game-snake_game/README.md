# 🐍 Snake Game

A modern, colorful implementation of the classic Snake game with smooth animations, particle effects, and engaging sound effects.

## 🎮 Features

### Core Gameplay
- Snake starts with 3 segments, moving right
- Colorful rotating fruit emojis as food (🍎🍊🍌🍇🍓🥝🍑🍒)
- Snake grows by 1 segment when eating food
- Game ends when hitting walls or self
- Score increases by 10 points per food eaten

### Controls
- **Arrow Keys** or **WASD** - Move snake
- **Start/Pause Button** - Start game or pause/resume during gameplay
- **Restart Button** - Restart the game at any time
- **Play Again Button** - Appears after game over
- **Spacebar** - Alternative pause/resume (legacy support)

### Visual Design
- **CSS Art Background**: Animated geometric patterns with floating elements and color-shifting gradients
- 20x20 grid on HTML5 Canvas (600x600px)
- Gradient green snake with rounded segments and shine effects
- Animated rotating fruit emojis with scaling effects
- Particle explosion effects when eating food
- **Interactive UI Buttons**: Modern gradient buttons for game control
- Responsive design for different screen sizes
- Screen flash effect on game over

### Game Features
- **Progressive Difficulty**: Speed increases every 5 food eaten (50 points)
- **Smooth Animation**: 60fps gameplay with interpolated movement
- **Sound Effects**: Web Audio API generated sounds for eating and game over
- **Local High Score**: Automatically saved and displayed
- **Particle Effects**: Colorful particles burst when eating food
- **Food Animation**: Rotating and scaling food with spawn effects

### Technical Implementation
- HTML5 Canvas with JavaScript
- Responsive design with CSS Grid and Flexbox
- Web Audio API for sound generation
- LocalStorage for high score persistence
- Smooth 60fps animation loop
- Modern ES6+ JavaScript classes

## 🚀 How to Play

1. Open `index.html` in your web browser
2. Click the **Start** button to begin the game
3. Use arrow keys or WASD to control the snake
4. Eat the colorful fruit emojis to grow and increase your score
5. Use **Pause** button to pause/resume or **Restart** to start over
6. Avoid hitting the walls or your own tail
7. Try to beat your high score!

## 📱 Responsive Design

The game automatically adapts to different screen sizes:
- **Desktop**: Full 600x600 canvas
- **Tablet**: Scaled down to fit screen width
- **Mobile**: Optimized for touch devices with smaller canvas

## 🎵 Audio Features

- **Eat Sound**: Pleasant ascending tone when consuming food
- **Game Over Sound**: Descending tone effect
- Sounds are generated using Web Audio API (no external files needed)
- Audio context activates on first user interaction

## 🏆 Scoring System

- **+10 points** per food eaten
- **Speed increase** every 50 points (5 food items)
- **High score** automatically saved locally
- **Progressive difficulty** keeps the game challenging

## 🎨 Visual Effects

- **CSS Art Background** with animated geometric patterns and floating stars
- **Interactive gradient buttons** with hover and click animations
- **Particle explosions** when eating food
- **Screen flash** on game over
- **Smooth scaling** food spawn animations
- **Rotating fruit emojis** for engaging visuals
- **Color-shifting background** with conic and radial gradients

## 🔧 Technical Details

- **Canvas Size**: 600x600 pixels (30x30 grid of 20px tiles)
- **Frame Rate**: 60 FPS rendering, variable game speed
- **Starting Speed**: 150ms between moves
- **Speed Increase**: -10ms per level (minimum 80ms)
- **Food Types**: 8 different fruit emojis

## 🌟 Browser Compatibility

- Modern browsers with HTML5 Canvas support
- Web Audio API support for sound effects
- ES6+ JavaScript features
- Responsive CSS Grid and Flexbox

Enjoy playing this modern take on the classic Snake game! 🎮✨