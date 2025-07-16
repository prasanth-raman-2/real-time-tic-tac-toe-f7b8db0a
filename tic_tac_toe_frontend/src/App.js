import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * Square component representing a single cell on the board.
 * @param {object} props - value: X/O/null, onClick: click handler, highlight: bool for win cell
 */
function Square({ value, onClick, highlight }) {
  return (
    <button
      className={`ttt-square${highlight ? ' ttt-win' : ''}`}
      onClick={onClick}
      aria-label={value ? `Cell occupied by ${value}` : 'Empty cell'}
      disabled={!!value}
      tabIndex={0}
    >
      {value}
    </button>
  );
}

/**
 * Board component for the Tic Tac Toe board.
 * @param {array} squares - Board values.
 * @param {function} onSquareClick - Event handler for square click.
 * @param {array} winLine - Array of winning cell indexes.
 */
function Board({ squares, onSquareClick, winLine }) {
  // Render 3x3 grid
  function renderSquare(i) {
    const isWin = winLine && winLine.includes(i);
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onSquareClick(i)}
        highlight={isWin}
      />
    );
  }
  return (
    <div className="ttt-board">
      {[0, 1, 2].map(row => (
        <div className="ttt-board-row" key={row}>
          {[0, 1, 2].map(col => renderSquare(row * 3 + col))}
        </div>
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  // State: board, true=X's turn, null=ongoing/"X"/"O"/"draw" for winner
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null); // null = ongoing, "X"/"O" = win, "draw" = draw
  const [winLine, setWinLine] = useState(null);
  const [theme, setTheme] = useState('light');
  const [score, setScore] = useState({ X: 0, O: 0 });

  // PUBLIC_INTERFACE
  // Toggle dark/light theme
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Win/draw check function
  function calculateWinner(sqs) {
    // returns {winner: "X"/"O"/"draw"/null, line: [idxs]}
    const lines = [
      [0,1,2],[3,4,5],[6,7,8], // rows
      [0,3,6],[1,4,7],[2,5,8], // cols
      [0,4,8],[2,4,6]          // diags
    ];
    for (const line of lines) {
      const [a,b,c] = line;
      if (sqs[a] && sqs[a] === sqs[b] && sqs[b] === sqs[c]) {
        return { winner: sqs[a], line };
      }
    }
    const isDraw = sqs.every(square => !!square);
    if (isDraw) return { winner: 'draw', line: [] };
    return { winner: null, line: [] };
  }

  // Update winner on each move
  useEffect(() => {
    const { winner: result, line } = calculateWinner(squares);
    setWinner(result);
    if (result === "X" || result === "O") {
      setWinLine(line);
      setScore(prev => ({
        ...prev,
        [result]: prev[result] + 1
      }));
    } else {
      setWinLine(null);
    }
  // eslint-disable-next-line
  }, [squares]);

  // PUBLIC_INTERFACE
  // Handle click on a board cell
  function handleSquareClick(i) {
    if (winner || squares[i]) return; // ignore if game over or occupied
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  // Restart the entire board (scores remain)
  function handleRestart() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setWinLine(null);
  }

  // UI messages
  let statusText;
  if (winner === "X" || winner === "O") {
    statusText = `Player ${winner} wins!`;
  } else if (winner === "draw") {
    statusText = "It's a draw!";
  } else {
    statusText = `Player ${xIsNext ? "X" : "O"}'s turn`;
  }

  return (
    <div className="App">
      <header className="App-header" style={{ padding: 0, minHeight: '100vh', justifyContent: 'flex-start' }}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <main className="ttt-container">
          <h1 className="ttt-title">Tic Tac Toe</h1>
          <div className="ttt-scoreboard" data-theme={theme}>
            <span className={xIsNext ? "active" : undefined}>X&nbsp;{score.X}</span>
            <span className={!xIsNext ? "active" : undefined}>O&nbsp;{score.O}</span>
          </div>
          <div className="ttt-status" aria-live="polite">
            {statusText}
          </div>
          <Board squares={squares} onSquareClick={handleSquareClick} winLine={winLine} />
          <button className="ttt-restart" onClick={handleRestart}>
            Restart
          </button>
        </main>
      </header>
    </div>
  );
}

export default App;
