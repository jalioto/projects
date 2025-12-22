# 🎮 Game Arcade - Master Server & Game Selector

A comprehensive game launcher that hosts multiple games on different ports with a beautiful game selector interface.

## 🎯 Available Games

| Game | Port | Description |
|------|------|-------------|
| 🏰 Tower Defense | 8001 | Strategic tower placement defense game |
| 😂 Joke Generator | 8002 | AI-powered joke generator with categories |
| 🃏 Memory Match | 8003 | Emoji memory matching game (2-player) |
| ⭕ Tic-Tac-Toe | 8004 | Themed tic-tac-toe with score tracking |
| 🐍 Snake Game | 8005 | Modern snake with food categories & music |
| 👊 One Punch Man | 8006 | Side-scrolling action adventure game |

## 🚀 Quick Start

### Option 1: Easy Launch (Recommended)
```bash
cd Games/Game_launcher
./start-game-arcade.sh
```

### Option 2: Manual Launch
```bash
# Navigate to the launcher directory
cd Games/Game_launcher

# Install dependencies
pip3 install -r requirements.txt

# Start the master server
python3 game-launcher.py
```

## 🌐 Access Points

- **Game Selector**: http://localhost:8000
- **Master Server API**: http://localhost:8000/api/servers/status

## 🎮 How It Works

### Master Server (Port 8000)
- Serves the game selector webpage
- Manages all game server processes
- Provides API endpoints for server control
- Health monitoring for all games

### Game Selector Features
- **Beautiful Interface**: Modern, responsive design
- **Game Cards**: Each game has an icon, description, and features
- **Direct Links**: Click to play any game instantly
- **Server Management**: Start/stop all servers (future feature)
- **Status Monitoring**: Real-time server health checks

### Individual Game Servers
Each game runs on its own dedicated port:
- Independent processes for stability
- Individual health check endpoints
- Graceful shutdown handling
- Error logging and recovery

## 🛠️ Server Management

### Start All Servers
The master server can launch all game servers automatically:
```python
# Programmatically start all servers
launcher.start_all_servers()
```

### Stop All Servers
Graceful shutdown of all game processes:
```python
# Stop all servers
launcher.stop_all_servers()
```

### Check Server Status
Monitor health of all running servers:
```bash
curl http://localhost:8000/api/servers/status
```

## 📁 Project Structure

```
.
├── Games/
│   ├── Game_launcher/
│   │   ├── game-launcher.py          # Master server & process manager
│   │   ├── game-selector.html        # Game selection webpage
│   │   ├── start-game-arcade.sh      # Easy launch script
│   │   ├── requirements.txt          # Python dependencies
│   │   └── README.md                 # This file
│   ├── Game-Tower_Defense/           # Tower defense game
│   ├── Game-card_matching/           # Memory matching game
│   ├── Game-tic_tac_toe/            # Tic-tac-toe game
│   ├── Game-snake_game/             # Snake game
│   └── Game-side_scroller_one_punch_man/  # Action game
└── random_joke_generator/            # Joke generator (in root)
```

## 🔧 Technical Features

### Process Management
- **Subprocess Control**: Each game runs as independent process
- **Health Monitoring**: Regular health checks via HTTP endpoints
- **Graceful Shutdown**: Proper cleanup on exit
- **Error Recovery**: Automatic restart capabilities

### Web Interface
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern CSS**: Gradients, animations, and hover effects
- **Interactive Elements**: Button animations and visual feedback
- **Cross-Browser**: Compatible with all modern browsers

### API Endpoints
- `GET /` - Game selector webpage
- `GET /api/servers/status` - Server status JSON
- `POST /api/servers/start` - Start all servers
- `POST /api/servers/stop` - Stop all servers
- `GET /health` - Master server health check

## 🎨 Game Selector Features

### Visual Design
- **Animated Background**: Floating particles effect
- **Gradient Headers**: Color-shifting title animation
- **Game Cards**: Hover effects and smooth transitions
- **Status Indicators**: Real-time server status display

### User Experience
- **One-Click Access**: Direct links to each game
- **Game Information**: Descriptions, features, and tags
- **Responsive Layout**: Adapts to any screen size
- **Loading States**: Visual feedback for all interactions

## 🔒 Security & Stability

### Process Isolation
- Each game runs in its own process
- Failure of one game doesn't affect others
- Independent memory spaces and resources

### Error Handling
- Graceful degradation on server failures
- Automatic process cleanup
- Comprehensive error logging

### Resource Management
- Controlled server startup sequence
- Memory and CPU monitoring
- Automatic cleanup on shutdown

## 🚀 Deployment

### Local Development
```bash
# Navigate to the Games directory
cd Games/Game_launcher

# Install dependencies
pip3 install -r requirements.txt

# Start the arcade
./start-game-arcade.sh
```

### Production Deployment
For production deployment, consider:
- Using a process manager like PM2 or systemd
- Setting up reverse proxy with nginx
- Implementing proper logging and monitoring
- Adding authentication if needed

## 🎯 Future Enhancements

- **Real-time Status Updates**: WebSocket connections for live status
- **Game Statistics**: Play time, scores, and analytics
- **User Accounts**: Save progress and preferences
- **Game Ratings**: User reviews and ratings system
- **Tournament Mode**: Competitive gameplay across games
- **Mobile App**: Native mobile companion app

## 🤝 Contributing

Feel free to add new games to the arcade:

1. Create your game in a new directory
2. Add a `server.py` file with Flask server
3. Update the `GAMES` dictionary in `game-launcher.py`
4. Add a game card to `game-selector.html`
5. Test the integration

## 📝 License

This project is open source and available under the MIT License.

---

🎮 **Happy Gaming!** Enjoy your personal game arcade! 🎮