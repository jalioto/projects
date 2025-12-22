# 🔴 Connect Four Game

A modern, responsive Connect Four game built with HTML5, CSS3, and JavaScript. Features smooth animations, score tracking, and an intuitive interface.

## 🎯 Features

- **Two-Player Gameplay**: Red vs Yellow pieces
- **Win Detection**: Horizontal, vertical, and diagonal connections
- **Score Tracking**: Persistent score storage between rounds
- **Smooth Animations**: Piece dropping and winning celebrations
- **Responsive Design**: Works on desktop and mobile devices
- **Interactive UI**: Column hover previews and visual feedback
- **Game Reset**: Start new rounds while keeping scores

## 🚀 How to Run

### Using the Game Launcher
The game is integrated with the Game Arcade launcher and runs automatically on port 8007.

### Manual Start
```bash
cd Games/Game-connect_four
python3 server.py
```

Then visit: http://localhost:8007

## 🎮 How to Play

1. **Objective**: Be the first to connect 4 pieces in a row
2. **Gameplay**: 
   - Players take turns dropping pieces into columns
   - Click on any column to drop your piece
   - Pieces fall to the lowest available spot
3. **Winning**: Connect 4 pieces horizontally, vertically, or diagonally
4. **Scoring**: Wins are tracked and saved between games

## 🛠️ Technical Details

- **Backend**: Flask server on port 8007
- **Frontend**: Vanilla HTML5, CSS3, JavaScript
- **Storage**: LocalStorage for score persistence
- **Health Check**: Available at `/health` endpoint
- **Responsive**: Mobile-friendly design

## 📁 File Structure

```
Game-connect_four/
├── server.py              # Flask server
├── connect_four.html       # Main game interface
├── static/
│   ├── style.css          # Game styling
│   └── game.js            # Game logic
└── README.md              # This file
```

## 🎨 Game Features

- **Visual Feedback**: Hover effects and piece previews
- **Animations**: Smooth piece dropping and winning celebrations
- **Score Persistence**: Scores saved in browser storage
- **Responsive Grid**: 7x6 game board that adapts to screen size
- **Win Highlighting**: Winning pieces are highlighted with animations

## 🔧 Integration

This game is designed to work with the Game Arcade launcher system:
- Health check endpoint for monitoring
- Consistent Flask server structure
- Responsive design matching other games
- Port 8007 configuration

Enjoy playing Connect Four! 🎉