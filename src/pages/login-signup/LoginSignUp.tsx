import React from "react";

import { Link } from "react-router-dom";

import classes from "./LoginSignUp.module.scss";

import StandardButton from "../../components/buttons/standard-button/StandardButton";

const LoginSignup: React.FC = () => {
  return (
    <div className={classes.box}>
      <img
        className={classes.logo}
        src="dog_logo.png"
        alt="duke of gordon hotel"
      />
      <h1 className={classes["sub-heading"]}>Menu Interface Form</h1>
      <div className={classes["buttons-wrapper"]}>
        <Link to="/login">
          <StandardButton label="Login" function={() => {}} />
        </Link>
        <Link to="/sign-up">
          <StandardButton label="Sign Up" function={() => {}} />
        </Link>
      </div>
    </div>
  );
};

export default LoginSignup;
