import React from "react";

import classes from "./LoginSignUp.module.scss";

import StandardButton from "../../components/buttons/standard-button/StandardButton";

const LoginSignup: React.FC = () => {
  return (
    <div className={classes.box}>
      <h1 className={classes["heading"]}>
        Duke of Gordon Hotel
        <br />
        Menu Interface Form
      </h1>
      <div className={classes["buttons-wrapper"]}>
        <StandardButton label="Login" />
        <StandardButton label="Sign Up" />
      </div>
    </div>
  );
};

export default LoginSignup;
