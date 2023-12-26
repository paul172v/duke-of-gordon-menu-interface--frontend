import React from "react";

import classes from "./ForgotPasswordSendEmail.module.scss";

import StandardButton from "../../buttons/standard-button/StandardButton";

const ForgotPasswordSendEmail: React.FC = () => {
  return (
    <div className={classes.box}>
      <div className={classes["heading-wrapper"]}>
        <h2 className={classes.heading}>Email Reset Token</h2>
      </div>
      <div className={classes["form-wrapper"]}>
        <form className={classes.form}>
          <label className={classes.label} htmlFor="email">
            Email Address
          </label>
          <input type="email" name="email" />
        </form>
      </div>
      {/* <p className={classes["error-message"]}>Invalid Email or Password!</p> */}
      <div className={classes["buttons-wrapper"]}>
        <StandardButton label="Send Email" />
        <StandardButton label="Cancel" />
      </div>
    </div>
  );
};

export default ForgotPasswordSendEmail;
