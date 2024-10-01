const X_CLASS = 'x';
const O_CLASS = 'o';
let circleTurn;
const cellElements = document.querySelectorAll('.cell');
const board = document.getElementById('board');
const winningMessageElement = document.getElementById('winningMessage');
const restartButton = document.getElementById('restartButton');
const winningMessageTextElement = document.getElementById('winningMessageText');
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

startGame();

restartButton.addEventListener('click', startGame);

const darkModeToggle = document.getElementById('darkModeToggle');

darkModeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode', darkModeToggle.checked);
});


function startGame() {
  circleTurn = false;
  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(O_CLASS);
    cell.innerHTML = '';
    cell.addEventListener('click', handleClick, { once: true });
  });
  setBoardHoverClass();
  winningMessageElement.classList.remove('show');
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = X_CLASS;
  placeMark(cell, currentClass);
  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
    setTimeout(aiMove, 500);
  }
}

function aiMove() {
  const bestMove = minimax([...cellElements], O_CLASS).index;
  placeMark(cellElements[bestMove], O_CLASS);

  if (checkWin(O_CLASS)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
  }
}

function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = 'Draw!';
  } else {
    winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`;
  }
  winningMessageElement.classList.add('show');
}

function isDraw() {
  return [...cellElements].every(cell => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
  });
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass); // Add 'x' or 'o' class to cell
  cell.innerHTML = currentClass === X_CLASS ? 'X' : 'O';  // Set innerHTML to 'X' or 'O'
}

function swapTurns() {
  circleTurn = !circleTurn;
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(O_CLASS);
  if (circleTurn) {
    board.classList.add(O_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}

// Minimax algorithm
function minimax(newBoard, player) {
  const emptyCells = [...newBoard].filter(cell => !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS));

  // Check for terminal states (win, lose, draw)
  if (checkWin(O_CLASS)) {
    return { score: 10 };
  } else if (checkWin(X_CLASS)) {
    return { score: -10 };
  } else if (emptyCells.length === 0) {
    return { score: 0 };
  }

  const moves = [];

  // Loop through available spots
  emptyCells.forEach(cell => {
    const move = {};
    move.index = [...newBoard].indexOf(cell);

    // Set the cell to the player
    newBoard[move.index].classList.add(player === O_CLASS ? O_CLASS : X_CLASS);

    // Call minimax recursively and get the score
    if (player === O_CLASS) {
      const result = minimax(newBoard, X_CLASS);
      move.score = result.score;
    } else {
      const result = minimax(newBoard, O_CLASS);
      move.score = result.score;
    }

    // Reset the cell
    newBoard[move.index].classList.remove(O_CLASS);
    newBoard[move.index].classList.remove(X_CLASS);

    moves.push(move);
  });

  // Find the best move
  let bestMove;
  if (player === O_CLASS) {
    let bestScore = -Infinity;
    moves.forEach(move => {
      if (move.score > bestScore) {
        bestScore = move.score;
        bestMove = move;
      }
    });
  } else {
    let bestScore = Infinity;
    moves.forEach(move => {
      if (move.score < bestScore) {
        bestScore = move.score;
        bestMove = move;
      }
    });
  }

  return bestMove;
}
