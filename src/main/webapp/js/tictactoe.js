let scoreX = 0;
let scoreO = 0;
let isPlayerXTurn = true; // Assuming X always starts the game
let gameMode = "two-player"; // Default game mode
let playerXSymbol = 'X'; // Default player X symbol
let playerOSymbol = 'O';
let cells = []; // Will hold cell elements
let isMoveProcessing = false; // Add a new flag

document.addEventListener("DOMContentLoaded", function() {
    initializeGame();
    attachEventListeners();
});

function initializeGame() {
    const board = document.getElementById("board");
    cells = []; // Re-initialize the cells array for a new game

    // Clear previous cells
    board.innerHTML = '';

    // Create cells and append to the board
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        const row = Math.floor(i / 3);
        const col = i % 3;
        cell.dataset.row = row;
        cell.dataset.col = col;
        cell.textContent = '-'; // Set the initial state to '-'
        // Attach event listener with explicit passing of 'this'
        cell.addEventListener("click", function() {
            makeMove.call(cell);
        });
        board.appendChild(cell);
        cells.push(cell);
    }

    // Update the game to reflect the current game mode and player symbols
    updateGame();
}

function updateGame() {
    if (gameMode === 'vs-ai') {
        isPlayerXTurn = true; // Let's assume the player always starts
        if (!isPlayerXTurn) {
            aiMakeMove();
        }
    } else {
        isPlayerXTurn = true; // In two-player mode, X always starts
    }
}

function updateScores() {
    const scoreXElement = document.getElementById('score-x');
    const scoreOElement = document.getElementById('score-o');
    if (scoreXElement) scoreXElement.textContent = scoreX;
    if (scoreOElement) scoreOElement.textContent = scoreO;
}

function attachEventListeners() {
    const playerXSymbolElement = document.getElementById('player-x-symbol');
    const playerOSymbolElement = document.getElementById('player-o-symbol');
    const modeSelector = document.getElementById("mode-select");
    const resetGameButton = document.getElementById("reset-game");

    if (playerXSymbolElement) {
        playerXSymbolElement.addEventListener('change', function() {
            playerXSymbol = this.value;
        });
    }

    if (playerOSymbolElement) {
        playerOSymbolElement.addEventListener('change', function() {
            playerOSymbol = this.value;
        });
    }

    if (modeSelector) {
        modeSelector.addEventListener('change', function() {
            gameMode = this.value;
            resetGame();
        });
    }

    if (resetGameButton) {
        resetGameButton.addEventListener("click", resetGame);
    }
}

function checkForWinner() {
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (cells[a].textContent === cells[b].textContent &&
            cells[a].textContent === cells[c].textContent &&
            cells[a].textContent !== '-') {
            highlightWinningCombination(combo);
            return cells[a].textContent; // Return the symbol of the winner
        }
    }
    return null; // No winner found
}
function makeMove() {
    // Log the cell that was clicked for debugging purposes.
    console.log(`makeMove function called with cell: row ${this.dataset.row}, col ${this.dataset.col}`);

    // Prevent making a move if the previous one is still processing, or if the cell is already filled.
    if (isMoveProcessing) {
        console.log("Move in process. Please wait.");
        return;
    }
    if (this.textContent !== '-') {
        console.log("Cell already filled. Please choose an empty cell.");
        return;
    }

    isMoveProcessing = true; // Indicate that a move is being processed.

    // Update the cell with the current player's symbol and apply the color class.
    this.textContent = isPlayerXTurn ? playerXSymbol : playerOSymbol;
    this.classList.add(isPlayerXTurn ? 'x-marker' : 'o-marker');
    this.classList.remove(isPlayerXTurn ? 'o-marker' : 'x-marker'); // Ensure the correct class is added and the other is removed.

    // After updating the cell with the current player's symbol
    playMoveSound(); // Play move sound effect

    // Check for a win or draw after the move.
    const winner = checkForWinner(); // Declare winner here
    if (winner) {
        handleWin(winner);
    } else if (isBoardFull()) {
        handleDraw();
    }

    // Toggle the turn to the other player.
    isPlayerXTurn = !isPlayerXTurn;

    // If it's now the AI's turn, make a move as the AI
    if (gameMode === 'vs-ai' && !isPlayerXTurn) {
        setTimeout(aiMakeMove, 500); // Delay AI move to simulate thinking time
    }

    isMoveProcessing = false; // Reset the flag after move processing is complete.
}


// Function to play move sound
function playMoveSound() {
    const moveSound = document.getElementById("moveSound");
    moveSound.currentTime = 0; // Rewind to start
    moveSound.play();
}

// Function to play win sound
function playWinSound() {
    const winSound = document.getElementById("winSound");
    winSound.currentTime = 0; // Rewind to start
    winSound.play();
}

function aiMakeMove() {
    // Get a list of empty cells
    const emptyCells = cells.filter(cell => cell.textContent === '-');
    // If no empty cells, the board is full, and it's a draw
    if (emptyCells.length === 0) {
        return;
    }
    // Pick a random empty cell for the AI's move
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    // Make a move on the chosen cell
    randomCell.textContent = playerOSymbol;
    randomCell.classList.add('o-marker');
    // Check for a win or draw after the move
    const winner = checkForWinner();
    if (winner) {
        handleWin(winner);
    } else if (isBoardFull()) {
        handleDraw();
    }
    // Toggle the turn back to the player
    isPlayerXTurn = true;
}

function resetGame() {
    // Log for debugging
    console.log("Game is resetting. Current mode:", gameMode);

    // Clear the board
    cells.forEach(cell => {
        cell.textContent = '-';
        cell.classList.remove('winning-cell', 'x-marker', 'o-marker', 'draw-cell');
        // Reset the background color for the cell to white (or your default color)
        cell.style.backgroundColor = 'white'; // Set this to your default cell background color
    });

    // Reset scores and update the display if the elements exist
    scoreX = 0;
    scoreO = 0;
    updateScores();

    // Reset turn
    isPlayerXTurn = true;
    document.getElementById("game-status").style.display = "none";
    updateGame();
}
function checkForWinningCombination(winner) {
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    return winningCombos.find(combo => {
        const [a, b, c] = combo;
        return (cells[a].textContent === winner &&
            cells[b].textContent === winner &&
            cells[c].textContent === winner);
    });
}
function highlightWinningCombination(combo) {
    // Clear any previous winning cell highlights
    cells.forEach(cell => cell.classList.remove('winning-cell'));
    // Highlight only the winning cells
    combo.forEach(index => {
        cells[index].classList.add('winning-cell');
    });
}
function isBoardFull() {
    // Check if every cell is filled
    return cells.every(cell => cell.textContent !== '-');
}

function handleWin(winner) {
    console.log('handleWin called with winner:', winner); // Log when the function is called
    // Find the winning combination
    playWinSound();
    const winningCombination = checkForWinningCombination(winner);
    if (winningCombination) {
        highlightWinningCombination(winningCombination);
    }

    // Update scores
    if (winner === playerXSymbol) {
        scoreX++;
    } else {
        scoreO++;
    }
    updateScores();

    // Show the game status message
    const gameStatus = document.getElementById("game-status");
    const winnerMessage = document.getElementById("winner-message");
    winnerMessage.textContent = `${winner} wins!`;
    gameStatus.style.display = "block"; // Make the message visible
}

function handleDraw() {
    console.log('handleDraw called'); // Log when the function is called
    // Mark all cells as part of a draw
    cells.forEach(cell => cell.classList.add('draw-cell'));

    // Update scores
    scoreX += 0.5;
    scoreO += 0.5;
    updateScores();

    // Show the game status message
    const gameStatus = document.getElementById("game-status");
    const winnerMessage = document.getElementById("winner-message");
    winnerMessage.textContent = "It's a draw!";
    gameStatus.style.display = "block";  // Make the message visible
}

