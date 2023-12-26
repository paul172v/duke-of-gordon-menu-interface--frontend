import React from "react";

import classes from "./StandardButton.module.scss";

const StandardButton: React.FC<{ label: string }> = (props) => {
  return <button className={classes.button}>{props.label}</button>;
};

export default StandardButton;
