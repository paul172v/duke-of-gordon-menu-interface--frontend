import React from "react";

import classes from "./App.module.scss";

import LoginSignUp from "./pages/login-signup/LoginSignUp";
import Login from "./components/authentication/login/Login";
import SignUp from "./components/authentication/signup/SignUp";
import ForgotPasswordSendEmail from "./components/authentication/forgot-password--send-email/ForgotPasswordSendEmail";
import ForgotPasswordChangePassword from "./components/authentication/forgot-password--change-password/ForgotPasswordChangePassword";
import ErrorMessage from "./components/error-message/ErrorMessage";
import AccessGranted from "./components/placeholder/AccessGranted";

import StandardButton from "./components/buttons/standard-button/StandardButton";

function App() {
  return (
    <div className={classes.background}>
      <LoginSignUp />
      {/* <Login /> */}
      {/* <SignUp /> */}
      {/* <ForgotPasswordSendEmail /> */}
      {/* <ForgotPasswordChangePassword /> */}
      {/* <AccessGranted /> */}
      {/* <ErrorMessage
        heading="⚠️ Something went wrong ⚠️"
        message="There was an error with the login or sign up process."
        label="Return to Login/Sign Up"
      /> */}
    </div>
  );
}

export default App;
