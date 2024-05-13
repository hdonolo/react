import { useState } from 'react';
function Square({ value, onSquareClick, mykey, lineArr}) {
  let myClass = '';
  if (lineArr && lineArr.indexOf(mykey) !== -1) {
    myClass = "win-bkg ";
  }
  return <button
    className={`square  ${myClass}`}
    onClick={onSquareClick}
  >{value}</button>;
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [sortDir, setSortDir] = useState(false);
  let currentMoveSet = null;
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function toggleSort() {
    setSortDir(!sortDir);
  }

  const moves = history.map((squares, move) => {
    let description;

    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    if (move === currentMove && currentMove !== 0) {
      description = 'You are in move #' + move;
      return (
        <li key={move}>
          <span>{description}</span>
        </li>
      );
    } else {
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    }

  });


  if (sortDir) {
    currentMoveSet = moves;
  } else  {
    currentMoveSet = moves.reverse();
  }
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{currentMoveSet}</ol>
      </div>
      <div className="game-sort">
        <button onClick={() => toggleSort()}>Sort</button>
      </div>
    </div>
  );
}
export function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares).winner) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }
  let lineArr = calculateWinner(squares).linesWin;
  const element = ((rowOffset) => {
    let content = [];
    for (let i = 0; i < 3; i++) {
      content.push(<Square lineArr={lineArr} mykey={i+rowOffset}  key={i+rowOffset} value={squares[i + rowOffset]} onSquareClick={() => handleClick(i + rowOffset)} />);
    }
    return content;
  });

  const lattice = () => {
    let content = [];
    for (let i = 0; i < 7; i += 3) {
      content.push(<div key={i} className="board-row"> {element(i)}</div>)
    }
    return content;
  }

  let status;
  const winner = calculateWinner(squares).winner;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      {lattice()}
    </>
  );

}

function calculateWinner(squares) {
  let winObj = { winner: '', linesWin: null };
  let notNullCount = 0;
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  console.log(1111, squares)
  for (let i = 0; i < squares.length; i++) {
    if (typeof squares[i] === 'string') {
      notNullCount++;
    }
  }
  console.log(222, notNullCount);
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      console.log(333, lines[i]);
      winObj.linesWin = lines[i];
      winObj.winner = squares[a];
      return winObj;
    }
  }
  if (notNullCount === 9) {
    winObj.winner = 'tie'; 
  } 
  return winObj;
}
