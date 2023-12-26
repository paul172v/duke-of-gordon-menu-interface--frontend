import React from "react";

import classes from "./ForgotPasswordChangePassword.module.scss";

import StandardButton from "../../buttons/standard-button/StandardButton";

const ForgotPasswordChangePassword: React.FC = () => {
  return (
    <div className={classes.box}>
      <div className={classes["heading-wrapper"]}>
        <h2 className={classes.heading}>Reset Password</h2>
        <p className={classes.para}>
          Please find the token emailed to the address provided
        </p>
      </div>
      <div className={classes["form-wrapper"]}>
        <form className={classes.form}>
          <label className={classes.label} htmlFor="token">
            Token
          </label>
          <input type="token" name="token" />
          <label className={classes.label} htmlFor="new-password">
            New Password
          </label>
          <input type="new-password" name="new-password" />
          <label className={classes.label} htmlFor="password-confirm">
            Password Confirm
          </label>
          <input type="password" name="password-confirm" />
        </form>
      </div>
      {/* <p className={classes["error-message"]}>Invalid Email or Password!</p> */}
      <div className={classes["buttons-wrapper"]}>
        <StandardButton label="Change Password" />
        <StandardButton label="Cancel" />
      </div>
    </div>
  );
};

export default ForgotPasswordChangePassword;
