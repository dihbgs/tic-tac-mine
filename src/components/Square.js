import React from "react";
import Item from "./Item";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      <Item itemName={props.value} />
    </button>
  );
}

export default Square;
