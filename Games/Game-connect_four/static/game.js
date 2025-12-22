class ConnectFour {
    constructor() {
        this.board = Array(6).fill().map(() => Array(7).fill(null));
        this.currentPlayer = 'red';
        this.gameOver = false;
        this.scores = { red: 0, yellow: 0 };
        
        this.initializeGame();
        this.loadScores();
    }

    initializeGame() {
        this.createBoard();
        this.setupEventListeners();
        this.updateGameStatus();
        this.updatePlayerIndicators();
    }

    createBoard() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';

        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 7; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', () => this.handleCellClick(col));
                gameBoard.appendChild(cell);
            }
        }

        // Setup column indicators
        const indicators = document.querySelectorAll('.column-indicator');
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.handleCellClick(index));
            indicator.addEventListener('mouseenter', () => this.showColumnPreview(index));
            indicator.addEventListener('mouseleave', () => this.hideColumnPreview(index));
        });
    }

    setupEventListeners() {
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        
        // Show column indicators on board hover
        const boardContainer = document.querySelector('.game-board-container');
        boardContainer.addEventListener('mouseenter', () => this.showColumnIndicators());
        boardContainer.addEventListener('mouseleave', () => this.hideColumnIndicators());
    }

    showColumnIndicators() {
        if (this.gameOver) return;
        const indicators = document.querySelectorAll('.column-indicator');
        indicators.forEach(indicator => indicator.classList.add('show'));
    }

    hideColumnIndicators() {
        const indicators = document.querySelectorAll('.column-indicator');
        indicators.forEach(indicator => indicator.classList.remove('show'));
    }

    showColumnPreview(col) {
        if (this.gameOver) return;
        const availableRow = this.getAvailableRow(col);
        if (availableRow !== -1) {
            const cell = document.querySelector(`[data-row="${availableRow}"][data-col="${col}"]`);
            cell.style.background = this.currentPlayer === 'red' ? 
                'rgba(229, 62, 62, 0.3)' : 'rgba(255, 215, 0, 0.3)';
        }
    }

    hideColumnPreview(col) {
        const availableRow = this.getAvailableRow(col);
        if (availableRow !== -1) {
            const cell = document.querySelector(`[data-row="${availableRow}"][data-col="${col}"]`);
            if (!cell.classList.contains('red') && !cell.classList.contains('yellow')) {
                cell.style.background = 'white';
            }
        }
    }
    handleCellClick(col) {
        if (this.gameOver) return;

        const row = this.getAvailableRow(col);
        if (row === -1) return; // Column is full

        // Place the piece
        this.board[row][col] = this.currentPlayer;
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add(this.currentPlayer);
        cell.textContent = this.currentPlayer === 'red' ? '🔴' : '🟡';

        // Check for win
        if (this.checkWin(row, col)) {
            this.handleWin();
            return;
        }

        // Check for draw
        if (this.checkDraw()) {
            this.handleDraw();
            return;
        }

        // Switch players
        this.currentPlayer = this.currentPlayer === 'red' ? 'yellow' : 'red';
        this.updateGameStatus();
        this.updatePlayerIndicators();
    }

    getAvailableRow(col) {
        for (let row = 5; row >= 0; row--) {
            if (this.board[row][col] === null) {
                return row;
            }
        }
        return -1; // Column is full
    }

    checkWin(row, col) {
        const directions = [
            [0, 1],   // horizontal
            [1, 0],   // vertical
            [1, 1],   // diagonal /
            [1, -1]   // diagonal \
        ];

        for (let [deltaRow, deltaCol] of directions) {
            let count = 1; // Count the current piece
            const winningCells = [[row, col]];

            // Check in positive direction
            let r = row + deltaRow;
            let c = col + deltaCol;
            while (r >= 0 && r < 6 && c >= 0 && c < 7 && this.board[r][c] === this.currentPlayer) {
                count++;
                winningCells.push([r, c]);
                r += deltaRow;
                c += deltaCol;
            }

            // Check in negative direction
            r = row - deltaRow;
            c = col - deltaCol;
            while (r >= 0 && r < 6 && c >= 0 && c < 7 && this.board[r][c] === this.currentPlayer) {
                count++;
                winningCells.push([r, c]);
                r -= deltaRow;
                c -= deltaCol;
            }

            if (count >= 4) {
                this.highlightWinningCells(winningCells);
                return true;
            }
        }

        return false;
    }

    highlightWinningCells(cells) {
        cells.forEach(([row, col]) => {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            cell.classList.add('winning');
        });
    }

    checkDraw() {
        return this.board[0].every(cell => cell !== null);
    }

    handleWin() {
        this.gameOver = true;
        this.scores[this.currentPlayer]++;
        this.updateScores();
        this.saveScores();
        
        const playerName = this.currentPlayer === 'red' ? 'Red' : 'Yellow';
        const playerEmoji = this.currentPlayer === 'red' ? '🔴' : '🟡';
        
        document.getElementById('gameStatus').innerHTML = 
            `${playerEmoji} ${playerName} Player Wins! 🎉`;
        document.getElementById('gameStatus').style.background = 
            this.currentPlayer === 'red' ? 
            'rgba(229, 62, 62, 0.2)' : 'rgba(255, 215, 0, 0.2)';
        document.getElementById('gameStatus').style.borderColor = 
            this.currentPlayer === 'red' ? '#e53e3e' : '#ffd700';
        
        this.hideColumnIndicators();
        
        // Show celebration animation
        setTimeout(() => {
            this.showCelebration();
        }, 1000);
    }

    handleDraw() {
        this.gameOver = true;
        document.getElementById('gameStatus').innerHTML = "🤝 It's a Draw!";
        document.getElementById('gameStatus').style.background = 'rgba(158, 158, 158, 0.2)';
        document.getElementById('gameStatus').style.borderColor = '#9e9e9e';
        this.hideColumnIndicators();
    }

    showCelebration() {
        // Create celebration particles
        const container = document.querySelector('.container');
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '10px';
            particle.style.height = '10px';
            particle.style.background = this.currentPlayer === 'red' ? '#e53e3e' : '#ffd700';
            particle.style.borderRadius = '50%';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = '0px';
            particle.style.pointerEvents = 'none';
            particle.style.animation = 'fall 3s linear forwards';
            container.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 3000);
        }
    }

    updateGameStatus() {
        const playerName = this.currentPlayer === 'red' ? 'Red' : 'Yellow';
        const playerEmoji = this.currentPlayer === 'red' ? '🔴' : '🟡';
        document.getElementById('gameStatus').innerHTML = `${playerEmoji} ${playerName} Player's Turn`;
        document.getElementById('gameStatus').style.background = 'rgba(76, 175, 80, 0.1)';
        document.getElementById('gameStatus').style.borderColor = '#4CAF50';
    }

    updatePlayerIndicators() {
        const player1 = document.getElementById('player1');
        const player2 = document.getElementById('player2');
        
        player1.classList.toggle('active', this.currentPlayer === 'red');
        player2.classList.toggle('active', this.currentPlayer === 'yellow');
    }

    updateScores() {
        document.getElementById('redScore').textContent = this.scores.red;
        document.getElementById('yellowScore').textContent = this.scores.yellow;
    }

    saveScores() {
        localStorage.setItem('connectFourScores', JSON.stringify(this.scores));
    }

    loadScores() {
        const savedScores = localStorage.getItem('connectFourScores');
        if (savedScores) {
            this.scores = JSON.parse(savedScores);
            this.updateScores();
        }
    }

    resetGame() {
        this.board = Array(6).fill().map(() => Array(7).fill(null));
        this.currentPlayer = 'red';
        this.gameOver = false;
        
        // Clear the board
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.className = 'cell';
            cell.textContent = '';
            cell.style.background = 'white';
        });
        
        this.updateGameStatus();
        this.updatePlayerIndicators();
        this.hideColumnIndicators();
    }
}

// Add CSS for falling particles animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ConnectFour();
});