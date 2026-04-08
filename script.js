const cells = Array.from(document.querySelectorAll('.cell'));
const statusEl = document.getElementById('status');
const pX = document.getElementById('pX');
const pO = document.getElementById('pO');
const pD = document.getElementById('pD');
const btn2p = document.getElementById('btn2p');
const btnAI = document.getElementById('btnAI');
const difficultyToggle = document.getElementById('difficulty-toggle');
const diffEasyBtn = document.getElementById('diff-easy');
const diffMediumBtn = document.getElementById('diff-medium');
const diffHardBtn = document.getElementById('diff-hard');
const newGameBtn = document.getElementById('new-game');
const resetScoresBtn = document.getElementById('reset-scores');

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let board = Array(9).fill(null);
let turn = 'X';
let over = false;
let mode = '2p';
let difficulty = 'easy';
let scores = { X: 0, O: 0, D: 0 };

const humanSymbol = 'X';
const aiSymbol = 'O';

function xSVG() {
  return (
    '<svg viewBox="0 0 46 46" xmlns="http://www.w3.org/2000/svg">' +
    '<line class="x-line" x1="11" y1="11" x2="35" y2="35"/>' +
    '<line class="x-line" x1="35" y1="11" x2="11" y2="35"/>' +
    '</svg>'
  );
}

function oSVG() {
  return (
    '<svg viewBox="0 0 46 46" xmlns="http://www.w3.org/2000/svg">' +
    '<circle class="o-circle" cx="23" cy="23" r="13"/>' +
    '</svg>'
  );
}

function renderBoard() {
  board.forEach((value, i) => {
    const cell = cells[i];
    cell.classList.remove('reveal');

    if (value) {
      cell.innerHTML = value === 'X' ? xSVG() : oSVG();
      cell.classList.add('taken');
      void cell.offsetWidth;
      cell.classList.add('reveal');
    } else {
      cell.innerHTML = '';
      cell.className = 'cell';
    }
  });
}

function checkLoss(currentBoard, player) {
  for (const line of LINES) {
    if (line.every((index) => currentBoard[index] === player)) {
      return line;
    }
  }
  return null;
}

function isDraw(currentBoard) {
  return currentBoard.every((cell) => cell !== null);
}

function refreshScores() {
  pX.textContent = `X — ${scores.X}`;
  pO.textContent = `O — ${scores.O}`;
  pD.textContent = `${scores.D}`;
  pX.className = `pill${turn === 'X' && !over ? ' active' : ''}`;
  pO.className = `pill${turn === 'O' && !over ? ' active' : ''}`;
}

function setStatus(text, type = '') {
  const difficultyLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  const aiTag = mode === 'ai' ? ` · AI: ${difficultyLabel}` : '';
  statusEl.textContent = `${text}${aiTag}`;
  statusEl.className = `status${type ? ` ${type}` : ''}`;
}

function getEmptyCells(currentBoard) {
  const empty = [];
  for (let i = 0; i < currentBoard.length; i += 1) {
    if (currentBoard[i] === null) empty.push(i);
  }
  return empty;
}

function randomMove(currentBoard) {
  const empty = getEmptyCells(currentBoard);
  if (!empty.length) return null;
  return empty[Math.floor(Math.random() * empty.length)];
}

function finishRound(playerWhoMoved) {
  const losingLine = checkLoss(board, playerWhoMoved);
  if (losingLine) {
    over = true;
    losingLine.forEach((i) => cells[i].classList.add('win-cell'));

    const winner = playerWhoMoved === 'X' ? 'O' : 'X';
    scores[winner] += 1;

    if (mode === 'ai') {
      if (playerWhoMoved === humanSymbol) {
        setStatus('You made 3 in a row. You lose.', 'lose');
      } else {
        setStatus('AI made 3 in a row. You win.', 'win');
      }
    } else {
      setStatus(`${playerWhoMoved} made 3 in a row and loses. ${winner} wins.`, 'win');
    }

    refreshScores();
    return true;
  }

  if (isDraw(board)) {
    over = true;
    scores.D += 1;
    setStatus('Draw. No one made 3 in a row.', 'draw');
    refreshScores();
    return true;
  }

  return false;
}

function minimax(currentBoard, isMaximizing, depth, maxDepth = Infinity) {
  if (checkLoss(currentBoard, aiSymbol)) return depth - 10;
  if (checkLoss(currentBoard, humanSymbol)) return 10 - depth;
  if (isDraw(currentBoard)) return 0;
  if (depth >= maxDepth) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i += 1) {
      if (currentBoard[i] !== null) continue;
      currentBoard[i] = aiSymbol;
      const score = minimax(currentBoard, false, depth + 1, maxDepth);
      currentBoard[i] = null;
      bestScore = Math.max(bestScore, score);
    }
    return bestScore;
  }

  let bestScore = Infinity;
  for (let i = 0; i < 9; i += 1) {
    if (currentBoard[i] !== null) continue;
    currentBoard[i] = humanSymbol;
    const score = minimax(currentBoard, true, depth + 1, maxDepth);
    currentBoard[i] = null;
    bestScore = Math.min(bestScore, score);
  }
  return bestScore;
}

function bestAiMove(maxDepth = Infinity) {
  let bestScore = -Infinity;
  let move = null;

  for (let i = 0; i < 9; i += 1) {
    if (board[i] !== null) continue;
    board[i] = aiSymbol;
    const score = minimax(board, false, 0, maxDepth);
    board[i] = null;

    if (score > bestScore) {
      bestScore = score;
      move = i;
    }
  }

  return move;
}

function getAiMove() {
  if (difficulty === 'easy') {
    return randomMove(board);
  }

  if (difficulty === 'medium') {
    return bestAiMove(3);
  }

  return bestAiMove();
}

function play(index) {
  if (over || board[index] !== null) return;

  board[index] = turn;
  renderBoard();

  if (finishRound(turn)) return;

  turn = turn === 'X' ? 'O' : 'X';
  setStatus(mode === 'ai' && turn === 'O' ? 'AI thinking...' : `${turn} to play`);
  refreshScores();

  if (mode === 'ai' && turn === aiSymbol && !over) {
    window.setTimeout(() => {
      if (over || mode !== 'ai' || turn !== aiSymbol) return;
      const move = getAiMove();
      if (move !== null) play(move);
    }, 320);
  }
}

function reset() {
  board = Array(9).fill(null);
  turn = 'X';
  over = false;
  renderBoard();
  setStatus('X to play');
  refreshScores();
}

function resetAll() {
  scores = { X: 0, O: 0, D: 0 };
  reset();
}

function setMode(nextMode) {
  mode = nextMode;
  btn2p.className = `mode-btn${mode === '2p' ? ' on' : ''}`;
  btnAI.className = `mode-btn${mode === 'ai' ? ' on' : ''}`;
  difficultyToggle.classList.toggle('hidden', mode !== 'ai');
  resetAll();
}

function setDifficulty(nextDifficulty) {
  difficulty = nextDifficulty;
  diffEasyBtn.className = `mode-btn${difficulty === 'easy' ? ' on' : ''}`;
  diffMediumBtn.className = `mode-btn${difficulty === 'medium' ? ' on' : ''}`;
  diffHardBtn.className = `mode-btn${difficulty === 'hard' ? ' on' : ''}`;
  reset();
}

cells.forEach((cell, i) => {
  cell.addEventListener('click', () => {
    if (mode === 'ai' && turn !== humanSymbol) return;
    play(i);
  });
});

btn2p.addEventListener('click', () => setMode('2p'));
btnAI.addEventListener('click', () => setMode('ai'));
diffEasyBtn.addEventListener('click', () => setDifficulty('easy'));
diffMediumBtn.addEventListener('click', () => setDifficulty('medium'));
diffHardBtn.addEventListener('click', () => setDifficulty('hard'));
newGameBtn.addEventListener('click', reset);
resetScoresBtn.addEventListener('click', resetAll);

reset();
