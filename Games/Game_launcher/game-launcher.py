#!/usr/bin/env python3
"""
Game Launcher - Master Server
Hosts all games directly on their designated ports
Serves the game selector on http://localhost:8000
"""

import threading
import time
import os
import signal
import sys
from flask import Flask, render_template_string, jsonify, send_from_directory

# Create the main Flask app for the game selector
app = Flask(__name__)

# Game server configurations
GAMES = {
    'tower-defense': {
        'name': 'Tower Defense',
        'port': 8001,
        'directory': 'Game-Tower_Defense',
        'main_file': 'index.html',
        'status': 'stopped',
        'app': None,
        'thread': None
    },
    'joke-generator': {
        'name': 'Random Joke Generator',
        'port': 8002,
        'directory': '../random_joke_generator/python',
        'main_file': 'index.html',
        'status': 'stopped',
        'app': None,
        'thread': None
    },
    'card-matching': {
        'name': 'Emoji Memory Match',
        'port': 8003,
        'directory': 'Game-card_matching',
        'main_file': 'emoji-memory-game.html',
        'status': 'stopped',
        'app': None,
        'thread': None
    },
    'tic-tac-toe': {
        'name': 'Themed Tic-Tac-Toe',
        'port': 8004,
        'directory': 'Game-tic_tac_toe',
        'main_file': 'index.html',
        'status': 'stopped',
        'app': None,
        'thread': None
    },
    'snake-game': {
        'name': 'Snake Game',
        'port': 8005,
        'directory': 'Game-snake_game',
        'main_file': 'index.html',
        'status': 'stopped',
        'app': None,
        'thread': None
    },
    'one-punch-man': {
        'name': 'One Punch Man Side Scroller',
        'port': 8006,
        'directory': 'Game-side_scroller_one_punch_man',
        'main_file': 'index.html',
        'status': 'stopped',
        'app': None,
        'thread': None
    },
    'connect-four': {
        'name': 'Connect Four',
        'port': 8007,
        'directory': 'Game-connect_four',
        'main_file': 'connect_four.html',
        'status': 'stopped',
        'app': None,
        'thread': None
    }
}

class GameLauncher:
    def __init__(self):
        # We're in Games/Game_launcher/, need to go up one level to Games/
        current_dir = os.path.dirname(os.path.abspath(__file__))  # Games/Game_launcher/
        self.base_dir = os.path.dirname(current_dir)  # Games/
        
    def create_game_app(self, game_key):
        """Create a Flask app for a specific game"""
        game = GAMES[game_key]
        game_dir = os.path.join(self.base_dir, game['directory'])
        
        print(f"🔍 Creating app for {game['name']}")
        print(f"🔍 Game directory: {game_dir}")
        
        if not os.path.exists(game_dir):
            print(f"❌ Directory not found: {game_dir}")
            return None
        
        # Create Flask app for this game
        game_app = Flask(f"game_{game_key}")
        
        @game_app.route('/')
        def index():
            """Serve the main game page"""
            try:
                main_file_path = os.path.join(game_dir, game['main_file'])
                with open(main_file_path, 'r', encoding='utf-8') as f:
                    return f.read()
            except FileNotFoundError:
                return f"Game file not found: {game['main_file']}", 404
        
        @game_app.route('/<path:filename>')
        def serve_static(filename):
            """Serve static files"""
            try:
                return send_from_directory(game_dir, filename)
            except:
                # Try common subdirectories
                for subdir in ['static', 'css', 'js', 'images', 'img', 'audio', 'sounds']:
                    try:
                        subdir_path = os.path.join(game_dir, subdir)
                        if os.path.exists(subdir_path):
                            return send_from_directory(subdir_path, filename)
                    except:
                        continue
                return f"File not found: {filename}", 404
        
        @game_app.route('/health')
        def health():
            """Health check endpoint"""
            return {"status": "healthy", "game": game['name'], "port": game['port']}
        
        return game_app
    
    def start_game_server(self, game_key):
        """Start a specific game server"""
        game = GAMES[game_key]
        
        if game['status'] == 'running':
            print(f"⚠️ {game['name']} is already running")
            return True
        
        # Create Flask app for this game
        game_app = self.create_game_app(game_key)
        if not game_app:
            game['status'] = 'failed'
            return False
        
        game['app'] = game_app
        game['status'] = 'starting'
        
        def run_game_server():
            try:
                print(f"🚀 Starting {game['name']} on port {game['port']}...")
                game_app.run(
                    host='0.0.0.0',
                    port=game['port'],
                    debug=False,
                    use_reloader=False,
                    threaded=True
                )
            except Exception as e:
                print(f"❌ Error running {game['name']}: {e}")
                game['status'] = 'failed'
        
        # Start the game server in a separate thread
        thread = threading.Thread(target=run_game_server, daemon=True)
        thread.start()
        game['thread'] = thread
        
        # Wait a moment and check if it started
        time.sleep(1)
        game['status'] = 'running'
        print(f"✅ {game['name']} started successfully on port {game['port']}!")
        return True
    
    def stop_game_server(self, game_key):
        """Stop a specific game server"""
        game = GAMES[game_key]
        game['status'] = 'stopped'
        game['app'] = None
        game['thread'] = None
        print(f"🛑 {game['name']} marked as stopped")
        return True
    
    def start_all_servers(self):
        """Start all game servers"""
        print("🚀 Starting all game servers...")
        
        for game_key in GAMES:
            self.start_game_server(game_key)
            time.sleep(0.5)  # Small delay between starts
        
        print("✅ All servers started!")
    
    def stop_all_servers(self):
        """Stop all game servers"""
        print("🛑 Stopping all game servers...")
        
        for game_key in GAMES:
            self.stop_game_server(game_key)
        
        print("✅ All servers stopped!")
    
    def get_server_status(self):
        """Get status of all servers"""
        status = {}
        for game_key, game in GAMES.items():
            status[game_key] = {
                'name': game['name'],
                'port': game['port'],
                'status': game['status']
            }
        
        return status

# Initialize the game launcher
launcher = GameLauncher()

# Flask routes for the master server (game selector)
@app.route('/')
def index():
    """Serve the game selector page"""
    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        selector_path = os.path.join(current_dir, 'game-selector.html')
        with open(selector_path, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return "Game selector not found. Please ensure game-selector.html exists.", 404

@app.route('/api/servers/start', methods=['POST'])
def start_servers():
    """API endpoint to start all servers"""
    launcher.start_all_servers()
    return jsonify({"status": "success", "message": "Starting all servers"})

@app.route('/api/servers/stop', methods=['POST'])
def stop_servers():
    """API endpoint to stop all servers"""
    launcher.stop_all_servers()
    return jsonify({"status": "success", "message": "Stopping all servers"})

@app.route('/api/servers/status')
def server_status():
    """API endpoint to get server status"""
    return jsonify(launcher.get_server_status())

@app.route('/health')
def health():
    """Health check for the master server"""
    return {"status": "healthy", "service": "Game Launcher", "port": 8000}

def signal_handler(sig, frame):
    """Handle Ctrl+C gracefully"""
    print("\n� Sehutting down Game Launcher...")
    launcher.stop_all_servers()
    print("👋 Game Launcher stopped. Thanks for playing!")
    sys.exit(0)

if __name__ == '__main__':
    # Register signal handler for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)
    
    print("�  Game Launcher - Master Server")
    print("=" * 50)
    print("🌐 Game Selector: http://localhost:8000")
    print("🎯 Available Games:")
    
    for game_key, game in GAMES.items():
        print(f"   • {game['name']}: http://localhost:{game['port']}")
    
    print("\n🚀 Starting master server and all games...")
    print("💡 Use Ctrl+C to stop all servers")
    print("=" * 50)
    
    try:
        # Start all game servers first
        launcher.start_all_servers()
        
        # Then start the master server (game selector)
        print(f"🌐 Starting Game Selector on port 8000...")
        app.run(
            host='0.0.0.0',
            port=8000,
            debug=False,
            use_reloader=False,
            threaded=True
        )
    except Exception as e:
        print(f"❌ Error starting master server: {e}")
        launcher.stop_all_servers()