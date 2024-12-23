const grid = document.getElementById('tetris-grid');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start-btn');

let squares = [];
let score = 0;
const width = 10;

const colors = ['#ff5733', '#33ff57', '#3357ff', '#ff33b5', '#b533ff'];

const tetrominoes = [
    [
        [1, width, width + 1, width + 2],   // T-shape
        [1, width + 1, width * 2 + 1, width], 
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ],
    [
        [0, 1, width, width + 1],           // Square
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ],
    [
        [1, width + 1, width * 2 + 1, 0],   // L-shape
        [width, width + 1, width + 2, width * 2],
        [2, width + 2, width * 2 + 2, width + 1],
        [width, width + 1, width + 2, 1]
    ],
    [
        [width, width + 1, 1, width + 2],   // S-shape
        [1, width, width + 1, width * 2],
        [width, width + 1, 1, width + 2],
        [1, width, width + 1, width * 2]
    ],
    [
        [0, width, width * 2, width * 3],   // Line
        [width, width + 1, width + 2, width + 3],
        [0, width, width * 2, width * 3],
        [width, width + 1, width + 2, width + 3]
    ]
];

let currentPosition = 4;
let currentRotation = 0;
let random = Math.floor(Math.random() * tetrominoes.length);
let current = tetrominoes[random][currentRotation];
let timerId;

// Create grid
function createGrid() {
    for (let i = 0; i < 200; i++) {
        const square = document.createElement('div');
        grid.appendChild(square);
        squares.push(square);
    }
    for (let i = 0; i < width; i++) {
        const square = document.createElement('div');
        square.classList.add('taken');
        grid.appendChild(square);
        squares.push(square);
    }
}

// Draw Tetromino
function draw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino');
        squares[currentPosition + index].style.backgroundColor = colors[random];
    });
}

// Undraw Tetromino
function undraw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino');
        squares[currentPosition + index].style.backgroundColor = '';
    });
}

// Move down
function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
}

// Freeze Tetromino
function freeze() {
    if (current.some(index => squares[currentPosition + index + width]?.classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'));
        random = Math.floor(Math.random() * tetrominoes.length);
        currentRotation = 0;
        current = tetrominoes[random][currentRotation];
        currentPosition = 4;
        draw();
        addScore();
        gameOver();
    }
}

// Move left
function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
    if (!isAtLeftEdge) currentPosition -= 1;
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition += 1;
    }
    draw();
}

// Move right
function moveRight() {
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
    if (!isAtRightEdge) currentPosition += 1;
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -= 1;
    }
    draw();
}

// Rotate Tetromino
function rotate() {
    undraw();
    currentRotation = (currentRotation + 1) % tetrominoes[random].length;
    current = tetrominoes[random][currentRotation];
    draw();
}

// Add score
function addScore() {
    for (let i = 0; i < 199; i += width) {
        const row = Array.from({ length: width }, (_, j) => i + j);
        if (row.every(index => squares[index].classList.contains('taken'))) {
            score += 10;
            scoreDisplay.innerText = score;
            row.forEach(index => {
                squares[index].classList.remove('taken', 'tetromino');
                squares[index].style.backgroundColor = '';
            });
            const removedSquares = squares.splice(i, width);
            squares = removedSquares.concat(squares);
            squares.forEach(cell => grid.appendChild(cell));
        }
    }
}

// Game over
function gameOver() {
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        alert('Game Over! Your score: ' + score);
        clearInterval(timerId);
    }
}

// Start game
function startGame() {
    createGrid();
    draw();
    timerId = setInterval(moveDown, 1000);
}

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.keyCode === 37) moveLeft();
    if (e.keyCode === 39) moveRight();
    if (e.keyCode === 38) rotate();
    if (e.keyCode === 40) moveDown();
});

startButton.addEventListener('click', startGame);
