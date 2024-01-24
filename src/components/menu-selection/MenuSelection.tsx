import React from "react";

import { Link } from "react-router-dom";

import classes from "./MenuSelection.module.scss";

import StandardButton from "../buttons/standard-button/StandardButton";

const MenuSelection: React.FC = () => {
  return (
    <div className={classes.box}>
      <h2 className={classes.heading}>Select Menu</h2>
      <div className={classes["buttons-wrapper"]}>
        <Link to="/main-menu">
          <StandardButton label="Main/Bar Menu" function={() => {}} />
        </Link>
        <Link to="/lunch-menu">
          <StandardButton label="Lunch Menu" function={() => {}} />
        </Link>
        <Link to="/wine-menu">
          <StandardButton label="Wine Menu" function={() => {}} />
        </Link>
      </div>
    </div>
  );
};

export default MenuSelection;
