import React from "react";

import classes from "./StandardButton.module.scss";

const StandardButton: React.FC<{ label: string; function: () => void }> = (
  props
) => {
  return (
    <button className={classes.button} onClick={props.function}>
      {props.label}
    </button>
  );
};

export default StandardButton;
