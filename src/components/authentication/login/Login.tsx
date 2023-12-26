import React from "react";

import classes from "./Login.module.scss";
import StandardButton from "../../buttons/standard-button/StandardButton";

const Login: React.FC = () => {
  return (
    <div className={classes.box}>
      <div className={classes["heading-wrapper"]}>
        <h2 className={classes.heading}>Login to your account</h2>
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
        </form>
      </div>
      {/* <p className={classes["error-message"]}>Invalid Email or Password!</p> */}
      <div className={classes["buttons-wrapper"]}>
        <StandardButton label="Login" />
        <StandardButton label="Cancel" />
      </div>
      <button className={classes["forgot-password"]}>Forgot Password?</button>
    </div>
  );
};

export default Login;
