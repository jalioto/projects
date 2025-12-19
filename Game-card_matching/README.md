# 🎮 Emoji Memory Match Game

A fun, colorful two-player memory matching game featuring adorable animal emojis and a beautiful starry space background. Perfect for kids aged 5-12!

## ✨ Features

### 🎯 Core Gameplay
- **4x4 Grid**: 16 cards with 8 emoji pairs to match
- **Two-Player Mode**: Purple vs Blue players take turns
- **Turn-Based**: No bonus turns - fair gameplay for both players
- **Smart Card Limits**: Only 2 cards can be flipped per turn
- **3-Second Delay**: Unmatched cards flip back after 3 seconds

### 🎨 Visual Design
- **Starry Space Background**: Dynamic CSS Paint API creates a cosmic atmosphere
- **4 Dynamic Themes**: Rainbow, Ocean, Sunset, and Forest card back designs
- **Smooth Animations**: CSS 3D flip transforms and hover effects
- **Large Emojis**: 6em font size for easy visibility
- **Responsive Design**: Optimized for mobile and desktop

### 📊 Game Features
- **Move Counter**: Track total attempts
- **Timer**: Starts on first card click
- **Score Tracking**: Individual scores for each player
- **Card Piles**: Matched cards move to player-specific piles
- **Win Detection**: Game ends when all 8 pairs are found
- **New Game & Reset**: Easy restart functionality

### 🐾 Animal Emojis
The game features 8 adorable animal pairs:
- 🐶 Dog
- 🐱 Cat  
- 🐭 Mouse
- 🐹 Hamster
- 🐰 Rabbit
- 🦊 Fox
- 🐻 Bear
- 🐼 Panda

## 🚀 Quick Start

### Option 1: Direct Play
Simply open `emoji-memory-game.html` in any modern web browser.

### Option 2: Local Server
Run the included Python server for the best experience:

```bash
# Make the start script executable (first time only)
chmod +x start.sh

# Start the server
./start.sh
```

Or manually:
```bash
# Install dependencies
pip3 install -r requirements.txt

# Start server
python3 server.py
```

The game will be available at: `http://localhost:8003`

## 🎮 How to Play

1. **Choose a Theme**: Select from 4 beautiful card back themes
2. **Player 1 (Purple) Goes First**: Click any two cards to flip them
3. **Match or Miss**: 
   - If cards match: You get a point, cards move to your pile
   - If no match: Cards flip back after 3 seconds
4. **Turn Switch**: Players alternate turns regardless of matches
5. **Win Condition**: Player with the most matches when all pairs are found wins!

## 🛠 Technical Details

### Technologies Used
- **HTML5**: Semantic structure
- **CSS3**: Advanced animations and Paint API
- **JavaScript**: Game logic and state management
- **Python Flask**: Optional local server
- **CSS Houdini Paint API**: Dynamic starry background

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Support**: iOS Safari, Chrome Mobile
- **Fallback**: Animated CSS stars for browsers without Paint API support

### File Structure
```
Game-card_matching/
├── emoji-memory-game.html    # Main game file
├── server.py                 # Python Flask server
├── requirements.txt          # Python dependencies
├── start.sh                  # Startup script
└── README.md                # This file
```

## 🎨 Customization

### Themes
The game includes 4 built-in themes:
- **Rainbow**: Colorful gradient animations
- **Ocean**: Blue and teal ocean vibes  
- **Sunset**: Warm pink and yellow tones
- **Forest**: Green nature-inspired colors

### Easy Modifications
- **Add More Emojis**: Update the `emojis` array in the JavaScript
- **Change Grid Size**: Modify CSS grid and card array logic
- **New Themes**: Add theme classes and update the theme selector
- **Adjust Timing**: Change the 3-second delay in `checkMatch()`

## 🌟 Advanced Features

### CSS Paint API
The starry background uses the CSS Houdini Paint API to generate:
- Random star positions and sizes
- Multiple star colors (white, blue-white, yellow-white)
- Glowing effects for bright stars
- Subtle nebula clouds for depth

### Game State Management
- Prevents card clicks during turn processing
- Tracks flipped cards and matched pairs
- Manages player turns and scoring
- Handles game end conditions

### Responsive Design
- Mobile-optimized touch interactions
- Scalable emoji sizes (6em desktop, 4.5em mobile)
- Flexible layout that works on all screen sizes
- Touch-friendly button sizes

## 🤝 Contributing

Feel free to fork this project and add your own features! Some ideas:
- Add sound effects
- Create difficulty levels (3x3, 5x5 grids)
- Add more emoji categories
- Implement online multiplayer
- Add achievement system

## 📱 Mobile Experience

The game is fully optimized for mobile devices:
- Touch-friendly card interactions
- Responsive layout and font sizes
- Smooth animations on mobile browsers
- Portrait and landscape orientation support

## 🎯 Perfect For

- **Kids Ages 5-12**: Simple, colorful, and engaging
- **Family Game Time**: Two-player competitive fun
- **Educational**: Memory and concentration skills
- **Classrooms**: Turn-based learning activity
- **Parties**: Quick, entertaining group game

---

**Enjoy playing the Emoji Memory Match Game! 🎉**