import React from "react";

import classes from "./MenuItem.module.scss";

import StandardButton from "../buttons/standard-button/StandardButton";

interface T {
  name: string;
  dietary: string[];
  description: string | null;
}

const MenuItem: React.FC<T> = (props) => {
  return (
    <div className={classes["grid-wrapper"]}>
      <p className={classes.heading}>{props.name}</p>
      <p className={classes.heading}>{props.dietary}</p>
      <p className={classes.heading}>
        {props.description ? props.description : ""}
      </p>
      <StandardButton label="Edit" function={() => {}} />
      <StandardButton label="Delete" function={() => {}} />
    </div>
  );
};

export default MenuItem;
