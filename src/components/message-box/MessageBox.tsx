import React from "react";
import { Link } from "react-router-dom";

import classes from "./MessageBox.module.scss";

import StandardButton from "../buttons/standard-button/StandardButton";

const MessageBox: React.FC<{
  heading: string;
  message: string;
  label: string;
  isError: boolean;
  destination: string;
}> = (props) => {
  return (
    <div className={classes.box}>
      <h2 className={classes.heading}>{props.heading}</h2>
      <p className={props.isError ? classes["error-message"] : classes.message}>
        {props.message}
      </p>
      <Link to={props.destination}>
        <StandardButton label={props.label} function={() => {}} />
      </Link>
    </div>
  );
};

export default MessageBox;
