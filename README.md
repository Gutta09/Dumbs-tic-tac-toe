# Dumbs-tic-tac-toe

A web-based **Reverse Tic-Tac-Toe (Misère Tic-Tac-Toe)** game.

In this version, the objective is inverted:

> If you make 3 in a row, **you lose**.

---

## Features

- 3×3 interactive board
- Two game modes:
	- **2P** (Human vs Human)
	- **vs AI** (Human vs Computer)
- AI difficulty levels:
	- **Easy**: random moves
	- **Medium**: depth-limited minimax
	- **Hard**: full minimax
- Live status indicator
- Score tracking for **X**, **O**, and **draws**
- New game and reset scores actions
- Minimal UI with animated SVG pieces

---

## Core Rule (Misère Logic)

Normal Tic-Tac-Toe: 3 in a row means win.  
This project: 3 in a row means **loss**.

The game checks all 8 line combinations (rows, columns, diagonals). If the current mover completes a line with their symbol, that mover loses immediately.

---

## AI Algorithm Used

This project uses **Minimax** with inverted scoring for misère play:

- AI line formed (`O`) → bad for AI (negative score)
- Human line formed (`X`) → good for AI (positive score)
- No line and full board → draw (`0`)

This allows the AI to:

- avoid risky placements,
- force the opponent toward losing lines,
- play optimally on Hard mode.

---

## Project Structure

reverse-tictactoe/
├── index.html
├── style.css
├── script.js
└── README.md

---

## How to Run

### Option 1 (direct)
Open `index.html` in a browser.

### Option 2 (local server, recommended)

```bash
cd /Users/bhargav/tic-tac-toe
python3 -m http.server 8000
```

Open: `http://localhost:8000`

---

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript

---

## Author

Bhargav / Gutta09
