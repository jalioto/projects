class ThemedTicTacToe {
    constructor() {
        this.themes = {
            animals: {
                player1: '🐱',
                player2: '🐶',
                name: 'Animals'
            },
            space: {
                player1: '🚀',
                player2: '👽',
                name: 'Space'
            },
            cartoon: {
                player1: '🤖',
                player2: '🦄',
                name: 'Cartoon'
            }
        };
        
        this.currentTheme = 'animals';
        this.currentPlayer = 1;
        this.gameBoard = Array(9).fill(null);
        this.gameActive = true;
        this.scores = { player1: 0, player2: 0 };
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.bindEvents();
        this.updatePlayerDisplay();
        this.updateScoreboard();
    }
    
    bindEvents() {
        // Theme selection
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.changeTheme(e.target.dataset.theme);
            });
        });
        
        // Game board clicks
        document.querySelectorAll('.cell').forEach(cell => {
            cell.addEventListener('click', (e) => {
                this.handleCellClick(e.target);
            });
        });
        
        // Game control buttons
        document.getElementById('nextGameBtn').addEventListener('click', () => {
            this.nextGame();
        });
        
        document.getElementById('resetScoreBtn').addEventListener('click', () => {
            this.resetScore();
        });
        
        document.getElementById('nextGameBtnPopup').addEventListener('click', () => {
            this.nextGame();
        });
        
        // Winner message click to close
        document.getElementById('winnerMessage').addEventListener('click', () => {
            this.hideWinnerMessage();
        });
    }
    
    changeTheme(themeName) {
        this.currentTheme = themeName;
        
        // Update active theme button
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-theme="${themeName}"]`).classList.add('active');
        
        // Update the board with new theme
        this.updateBoard();
        this.updatePlayerDisplay();
        this.updateScoreboard();
    }
    
    handleCellClick(cell) {
        const index = parseInt(cell.dataset.index);
        
        if (!this.gameActive || this.gameBoard[index] !== null) {
            return;
        }
        
        // Place the character
        this.gameBoard[index] = this.currentPlayer;
        this.updateCell(cell, index);
        
        // Check for win or tie
        if (this.checkWinner()) {
            this.handleWin();
            return;
        }
        
        if (this.checkTie()) {
            this.handleTie();
            return;
        }
        
        // Switch players
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.updatePlayerDisplay();
    }
    
    updateCell(cell, index) {
        const theme = this.themes[this.currentTheme];
        const character = this.currentPlayer === 1 ? theme.player1 : theme.player2;
        
        cell.textContent = character;
        cell.classList.add('filled', `player${this.currentPlayer}`);
        
        // Add a little animation
        cell.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cell.style.transform = 'scale(1)';
        }, 200);
    }
    
    updateBoard() {
        document.querySelectorAll('.cell').forEach((cell, index) => {
            if (this.gameBoard[index] !== null) {
                const theme = this.themes[this.currentTheme];
                const character = this.gameBoard[index] === 1 ? theme.player1 : theme.player2;
                cell.textContent = character;
                cell.classList.add('filled', `player${this.gameBoard[index]}`);
            }
        });
    }
    
    updatePlayerDisplay() {
        const theme = this.themes[this.currentTheme];
        const playerText = document.getElementById('current-player-text');
        const playerEmoji = document.getElementById('current-player-emoji');
        
        playerText.textContent = `Player ${this.currentPlayer}'s Turn`;
        playerEmoji.textContent = this.currentPlayer === 1 ? theme.player1 : theme.player2;
    }
    
    updateScoreboard() {
        const theme = this.themes[this.currentTheme];
        
        // Update player emojis in scoreboard
        document.getElementById('player1-emoji').textContent = theme.player1;
        document.getElementById('player2-emoji').textContent = theme.player2;
        
        // Update scores
        document.getElementById('player1-score').textContent = this.scores.player1;
        document.getElementById('player2-score').textContent = this.scores.player2;
    }
    
    checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];
        
        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (this.gameBoard[a] && 
                this.gameBoard[a] === this.gameBoard[b] && 
                this.gameBoard[a] === this.gameBoard[c]) {
                this.winningPattern = pattern;
                return true;
            }
        }
        return false;
    }
    
    checkTie() {
        return this.gameBoard.every(cell => cell !== null);
    }
    
    handleWin() {
        this.gameActive = false;
        
        // Update score
        this.scores[`player${this.currentPlayer}`]++;
        this.updateScoreboard();
        
        // Animate winning cells
        this.winningPattern.forEach(index => {
            const cell = document.querySelector(`[data-index="${index}"]`);
            cell.classList.add('winning');
        });
        
        // Show winner message
        setTimeout(() => {
            const theme = this.themes[this.currentTheme];
            const winnerEmoji = this.currentPlayer === 1 ? theme.player1 : theme.player2;
            this.showWinnerMessage(`${winnerEmoji} Player ${this.currentPlayer} Wins! ${winnerEmoji}`);
        }, 600);
    }
    
    handleTie() {
        this.gameActive = false;
        setTimeout(() => {
            this.showWinnerMessage("It's a Tie! 🤝");
        }, 300);
    }
    
    showWinnerMessage(message) {
        const winnerMessage = document.getElementById('winnerMessage');
        const winnerText = document.getElementById('winnerText');
        
        winnerText.textContent = message;
        winnerMessage.style.display = 'flex';
    }
    
    hideWinnerMessage() {
        document.getElementById('winnerMessage').style.display = 'none';
    }
    
    nextGame() {
        this.gameBoard = Array(9).fill(null);
        this.currentPlayer = 1;
        this.gameActive = true;
        this.winningPattern = null;
        
        // Clear all cells
        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('filled', 'winning', 'player1', 'player2');
        });
        
        this.updatePlayerDisplay();
        this.hideWinnerMessage();
    }
    
    resetScore() {
        this.scores = { player1: 0, player2: 0 };
        this.updateScoreboard();
        this.nextGame();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ThemedTicTacToe();
});