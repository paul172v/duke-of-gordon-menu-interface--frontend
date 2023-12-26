import React from "react";

import classes from "./SignUp.module.scss";

import StandardButton from "../../buttons/standard-button/StandardButton";

const SignUp: React.FC = () => {
  return (
    <div className={classes.box}>
      <div className={classes["heading-wrapper"]}>
        <h2 className={classes.heading}>Sign Up</h2>
      </div>
      <div className={classes["form-wrapper"]}>
        <form className={classes.form}>
          <label className={classes.label} htmlFor="email">
            Email Address
          </label>
          <input type="email" name="email" />
          <label className={classes.label} htmlFor="password">
            Password
          </label>
          <input type="password" name="password" />
          <label className={classes.label} htmlFor="password-confirm">
            Password Confirm
          </label>
          <input type="password" name="password-confirm" />
        </form>
      </div>
      {/* <p className={classes["error-message"]}>Invalid Email or Password!</p> */}
      <div className={classes["buttons-wrapper"]}>
        <StandardButton label="Login" />
        <StandardButton label="Cancel" />
      </div>
    </div>
  );
};

export default SignUp;
