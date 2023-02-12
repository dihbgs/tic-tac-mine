import React from "react";
import Images from "./Images";

function Item(props) {
  return (
    <div
      style={{
        backgroundImage: `url(${Images[props.itemName]})`,
        backgroundRepeat: "no-repeat",
        display: "table-cell",
        height: "32px",
        width: "32px",
      }}
      className={props.itemName}
    />
  );
}

export default Item;
