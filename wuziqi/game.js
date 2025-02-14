class Gomoku {
    constructor() {
        this.board = document.getElementById('board');
        this.result = document.getElementById('result');
        this.currentPlayerDisplay = document.getElementById('currentPlayer');
        this.timerDisplay = document.getElementById('timer');
        this.size = 15;
        this.currentPlayer = 'black';
        this.gameActive = false;
        this.timeLeft = 30;
        this.timer = null;
        this.boardState = Array(this.size).fill().map(() => Array(this.size).fill(null));
        
        this.initializeBoard();
        this.addEventListeners();
    }

    initializeBoard() {
        this.board.innerHTML = '';
        this.boardState = Array(this.size).fill().map(() => Array(this.size).fill(null));
        
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                this.board.appendChild(cell);
            }
        }
    }

    addEventListeners() {
        this.board.addEventListener('click', (e) => {
            if (!this.gameActive) return;
            
            const cell = e.target.closest('.cell');
            if (!cell || cell.querySelector('.piece')) return;

            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            
            this.makeMove(row, col);
        });

        document.getElementById('newGame').addEventListener('click', () => {
            this.startNewGame();
        });
    }

    startNewGame() {
        this.initializeBoard();
        this.currentPlayer = 'black';
        this.gameActive = true;
        this.result.textContent = '';
        this.updateCurrentPlayerDisplay();
        this.resetTimer();
    }

    makeMove(row, col) {
        const piece = document.createElement('div');
        piece.className = `piece ${this.currentPlayer}`;
        this.board.children[row * this.size + col].appendChild(piece);
        this.boardState[row][col] = this.currentPlayer;

        if (this.checkWin(row, col)) {
            this.gameOver(`${this.currentPlayer === 'black' ? '黑方' : '白方'}胜利！`);
            return;
        }

        this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
        this.updateCurrentPlayerDisplay();
        this.resetTimer();
    }

    checkWin(row, col) {
        const directions = [
            [[0, 1], [0, -1]],  // 水平
            [[1, 0], [-1, 0]],  // 垂直
            [[1, 1], [-1, -1]], // 对角线
            [[1, -1], [-1, 1]]  // 反对角线
        ];

        return directions.some(direction => {
            const count = 1 + this.countPieces(row, col, direction[0])
                           + this.countPieces(row, col, direction[1]);
            return count >= 5;
        });
    }

    countPieces(row, col, [dx, dy]) {
        let count = 0;
        let currentRow = row + dx;
        let currentCol = col + dy;
        const player = this.boardState[row][col];

        while (
            currentRow >= 0 && currentRow < this.size &&
            currentCol >= 0 && currentCol < this.size &&
            this.boardState[currentRow][currentCol] === player
        ) {
            count++;
            currentRow += dx;
            currentCol += dy;
        }

        return count;
    }

    gameOver(message) {
        this.gameActive = false;
        this.result.textContent = message;
        clearInterval(this.timer);
    }

    updateCurrentPlayerDisplay() {
        this.currentPlayerDisplay.textContent = 
            `当前回合: ${this.currentPlayer === 'black' ? '黑方' : '白方'}`;
    }

    resetTimer() {
        clearInterval(this.timer);
        this.timeLeft = 30;
        this.updateTimerDisplay();

        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();

            if (this.timeLeft <= 0) {
                this.gameOver(`${this.currentPlayer === 'black' ? '白方' : '黑方'}胜利！(对方超时)`);
            }
        }, 1000);
    }

    updateTimerDisplay() {
        this.timerDisplay.textContent = `剩余时间: ${this.timeLeft}秒`;
    }
}

// 初始化游戏
const game = new Gomoku(); 