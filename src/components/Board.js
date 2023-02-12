import React from "react";
import Square from "./Square";

function renderSquare(props, i) {
  return <Square value={props.squares[i]} onClick={() => props.onClick(i)} />;
}

function Board(props) {
  return (
    <div>
      <div className="board-row">
        {renderSquare(props, 0)}
        {renderSquare(props, 1)}
        {renderSquare(props, 2)}
      </div>
      <div className="board-row">
        {renderSquare(props, 3)}
        {renderSquare(props, 4)}
        {renderSquare(props, 5)}
      </div>
      <div className="board-row">
        {renderSquare(props, 6)}
        {renderSquare(props, 7)}
        {renderSquare(props, 8)}
      </div>
    </div>
  );
}

export default Board;
