import { useState } from 'react';
let currentPos = { row: -1, col: -1 };

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

    let pos = '';
    if (move === currentMove && currentMove !== 0) {
      let histLen = history.length;
      if (histLen > 1) {
        for (let j=0; j<9; j++) {
          if (!history[move-1][j] && typeof history[move][j] === 'string') {
            pos = history[move][j];
          }
        }
      }
      // description = 'You are in move #' + move + 'Column: ' + currentPos.col + ', Row: ' + currentPos.row;
      description = 'You are in move #' + move + ', Row: '+ pos[1] + ', Column: '+ pos[2];
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
    currentPos.col = (i+1)%3
    currentPos.col = (currentPos.col === 0) ? 3 : currentPos.col;
    currentPos.row = Math.ceil((i+1)/3);
    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[i] = 'X' + currentPos.row + currentPos.col;
    } else {
      nextSquares[i] = 'O' + currentPos.row + currentPos.col;
    }
    onPlay(nextSquares);
  }
  let lineArr = calculateWinner(squares).linesWin;
  const element = ((rowOffset) => {
    let content = [];
    for (let i = 0; i < 3; i++) {
      
      let newVal = squares[i + rowOffset] ? squares[i + rowOffset][0] : null;
      content.push(<Square lineArr={lineArr} mykey={i+rowOffset}  key={i+rowOffset} value={newVal} onSquareClick={() => handleClick(i + rowOffset)} />);
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
  for (let i = 0; i < squares.length; i++) {
    if (typeof squares[i] === 'string') {
      notNullCount++;
    }
  }
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[b] && squares[c] && squares[a][0] === squares[b][0] && squares[a][0] === squares[c][0]) {
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
