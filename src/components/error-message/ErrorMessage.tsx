import React from "react";

import classes from "./ErrorMessage.module.scss";

import StandardButton from "../buttons/standard-button/StandardButton";

const ErrorMessage: React.FC<{
  heading: string;
  message: string;
  label: string;
}> = (props) => {
  return (
    <div className={classes.box}>
      <h2 className={classes.heading}>{props.heading}</h2>
      <p className={classes.message}>{props.message}</p>
      <StandardButton label={props.label} />
    </div>
  );
};

export default ErrorMessage;
