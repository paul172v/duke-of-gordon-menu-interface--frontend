import React from "react";

import { Link, useNavigate } from "react-router-dom";

import classes from "./MenuSelection.module.scss";

import StandardButton from "../buttons/standard-button/StandardButton";

interface T {
  onSetMessageBoxProps: (
    heading: string,
    message: string,
    label: string,
    isError: boolean,
    destination: string
  ) => void;
  isAuthorized: boolean;
  onSetEmail: (email: string | null) => void;
  onSetRole: (role: string | null) => void;
}

const MenuSelection: React.FC<T> = (props) => {
  //// Navigate Hook
  const navigate = useNavigate();

  //// Functions
  const nullifyEmailHandler = () => {
    props.onSetEmail(null);
  };

  const nullifyRoleHandler = () => {
    props.onSetRole(null);
  };

  if (props.isAuthorized === false) {
    nullifyEmailHandler();
    nullifyRoleHandler();
    props.onSetMessageBoxProps(
      "⚠️ Not logged in ⚠️",
      "You are not logged in, please login before proceeding",
      "Back to home",
      true,
      "/home"
    );
    navigate("/alert");
  }

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
