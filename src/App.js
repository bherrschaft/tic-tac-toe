import { useState } from 'react'; // Import the useState hook from React to manage component state
import { Button } from 'react-bootstrap'; // Import the Button component from React-Bootstrap for styled buttons

// Define the Square component, which represents a single square on the board
function Square({ value, onSquareClick, className }) {
  return (
    // Render a button with the passed value and className, and an onClick event handler
    <button className={`square ${className}`} onClick={onSquareClick}>{value}</button>
  );
}

// Define the Board component, which represents the entire game board
function Board({ xIsNext, squares, onPlay }) {
  // Handle click events for the squares
  function handleClick(i) {
    // Check if there's a winner or if the square is already filled, in which case return early
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // Create a copy of the squares array
    const nextSquares = squares.slice();
    // Calculate the row and column of the clicked square
    const row = Math.floor(i / 3) + 1;
    const col = (i % 3) + 1;
    // Set the value of the clicked square to 'X' or 'O' based on xIsNext
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    // Call the onPlay function with the updated squares and the move location
    onPlay(nextSquares, `(${col}, ${row})`);
  }

  // Determine the winner and the status message
  const winner = calculateWinner(squares);
  let status;
  let winningSquares = [];
  if (winner) {
    // If there is a winner, update the status and store the winning squares
    status = 'Winner: ' + winner.player;
    winningSquares = winner.line;
  } else if (squares.every(Boolean)) {
    // If all squares are filled and there's no winner, it's a draw
    status = 'Draw';
  } else {
    // Otherwise, indicate whose turn it is
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  // Render a single square by calling the Square component with appropriate props
  function renderSquare(i) {
    return (
      <Square
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        className={winningSquares.includes(i) ? 'winning-square' : ''}
      />
    );
  }

  // Create the board using nested loops
  function createBoard() {
    let board = [];
    // Loop through the rows
    for (let row = 0; row < 3; row++) {
      let boardRow = [];
      // Loop through the columns
      for (let col = 0; col < 3; col++) {
        // Push the rendered square into the current row
        boardRow.push(renderSquare(row * 3 + col));
      }
      // Push the completed row into the board
      board.push(<div key={row} className="board-row">{boardRow}</div>);
    }
    // Return the complete board
    return board;
  }

  return (
    <>
      <div className="status">{status}</div> {/* Display the current game status */}
      {createBoard()} {/* Render the board */}
    </>
  );
}

// Define the main Game component, which manages the game state and logic
export default function Game() {
  // Initialize state variables for the history of moves, the current move, and the sort order
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), location: '' }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  // Determine if the next player is 'X' based on the current move number
  const xIsNext = currentMove % 2 === 0;
  // Get the squares for the current move
  const currentSquares = history[currentMove].squares;

  // Handle play events by updating the history and setting the current move
  function handlePlay(nextSquares, moveLocation) {
    const nextHistory = [...history.slice(0, currentMove + 1), { squares: nextSquares, location: moveLocation }];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  // Jump to a specific move in history by updating the current move
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // Toggle the sort order of the move list
  function toggleSortOrder() {
    setIsAscending(!isAscending);
  }

  // Create a list of moves to display in the move history
  const moves = history.map((step, move) => {
    const description = move ? `Go to move #${move} (${step.location})` : 'Go to game start';
    return (
      <li key={move}>
        <Button variant="primary" className={move === currentMove ? 'bold' : ''} onClick={() => jumpTo(move)}>
          {description} {/* Display the move description */}
        </Button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        {/* Render the Board component with appropriate props */}
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <Button variant="secondary" onClick={toggleSortOrder}>
          Sort moves {isAscending ? 'Descending' : 'Ascending'}
        </Button> {/* Button to toggle the sort order of moves */}
        <ol>{isAscending ? moves : moves.reverse()}</ol> {/* Display the list of moves */}
      </div>
    </div>
  );
}

// Calculate the winner of the game based on the current squares
function calculateWinner(squares) {
  // Define the possible winning lines
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  // Loop through the lines to check for a winner
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    // If the values in the squares match, return the winner
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  // If no winner is found, return null
  return null;
}

/**
 * Implementation of Advanced Options:
 * 1. Display the location for each move in the format (col, row) in the move history list:
 *    - Added a `moveLocation` parameter to the `handlePlay` function.
 *    - Passed the location `(col, row)` to `onPlay` when handling square clicks.
 *
 * 2. Bold the currently selected item in the move list:
 *    - Added a conditional class `bold` to the `Button` in the move list based on `currentMove`.
 *
 * 3. Rewrite Board to use two loops to make the squares instead of hardcoding them:
 *    - Replaced hardcoded square rendering with nested loops in the `createBoard` function.
 *
 * 4. Add a toggle button that lets you sort the moves in either ascending or descending order:
 *    - Added a `toggleSortOrder` function and a button to switch the sorting order of the moves.
 *
 * 5. When someone wins, highlight the three squares that caused the win:
 *    - Modified `calculateWinner` to return the winning line and passed it to the `Square` component to apply the `winning-square` class.
 *
 * 6. When no one wins, display a message about the result being a draw:
 *    - Updated the `status` to show "Draw" if all squares are filled and there is no winner.
 *
 * Differences from the Simple Version:
 * - The simple version had hardcoded rendering of squares, no location display for moves, no sorting functionality, and no highlighting of winning squares.
 * - The advanced version includes dynamic rendering with loops, move location display, move list sorting, bolding of the current move, and highlighting of winning squares, providing a more interactive and visually informative experience.
 */
