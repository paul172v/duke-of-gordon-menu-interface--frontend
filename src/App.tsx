import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import classes from "./App.module.scss";

import LoginSignUp from "./pages/login-signup/LoginSignUp";
import Login from "./components/authentication/login/Login";
import ForgotPasswordSendEmail from "./components/authentication/forgot-password--send-email/ForgotPasswordSendEmail";
import ForgotPasswordChangePassword from "./components/authentication/forgot-password--change-password/ForgotPasswordChangePassword";
import SignUp from "./components/authentication/signup/SignUp";
import MessageBox from "./components/message-box/MessageBox";
import MainMenu from "./pages/main-menu/MainMenu";
import Header from "./components/header-components/header/Header";
import HeaderManager from "./components/header-components/header-manager/HeaderManager";

function App() {
  const [messageBoxProps, setMessageBoxProps] = useState({
    heading: "⚠️ Something went wrong ⚠️",
    message: "There was an unknown error.",
    label: "Return to Home",
    isError: true,
    destination: "/home",
  });
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  //// Functions
  const messageBoxPropsHandler = (
    heading: string,
    message: string,
    label: string,
    isError: boolean,
    destination: string
  ) => {
    setMessageBoxProps({
      heading,
      message,
      label,
      isError,
      destination,
    });
  };

  const setEmailHandler = (email: string | null) => {
    setEmail(email);
  };

  const setRoleHandler = (role: string | null) => {
    setRole(role);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/home"
          element={
            <div className={classes.background}>
              <LoginSignUp />
            </div>
          }
        />
        <Route
          path="/login"
          element={
            <div className={classes.background}>
              <Login
                onSetMessageBoxProps={messageBoxPropsHandler}
                onSetEmail={setEmailHandler}
                onSetRole={setRoleHandler}
              />
            </div>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <div className={classes.background}>
              <ForgotPasswordSendEmail
                onSetMessageBoxProps={messageBoxPropsHandler}
              />
            </div>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <div className={classes.background}>
              <ForgotPasswordChangePassword
                onSetMessageBoxProps={messageBoxPropsHandler}
              />
            </div>
          }
        />
        <Route
          path="/sign-up"
          element={
            <div className={classes.background}>
              <SignUp
                onSetMessageBoxProps={messageBoxPropsHandler}
                onSetEmail={setEmailHandler}
                onSetRole={setRoleHandler}
              />
            </div>
          }
        />
        <Route
          path="/alert"
          element={
            <div className={classes.background}>
              <MessageBox {...messageBoxProps} />
            </div>
          }
        />
        <Route
          path="/main-menu"
          element={
            <React.Fragment>
              {role === "Manager" ? (
                <HeaderManager
                  email={email}
                  onSetEmail={setEmailHandler}
                  onSetRole={setRoleHandler}
                  onSetMessageBoxProps={messageBoxPropsHandler}
                />
              ) : (
                ""
              )}
              {role === "Allowed" ? (
                <Header
                  email={email}
                  onSetEmail={setEmailHandler}
                  onSetRole={setRoleHandler}
                  onSetMessageBoxProps={messageBoxPropsHandler}
                />
              ) : (
                ""
              )}
              <div className={classes.background}>
                <MainMenu onSetMessageBoxProps={messageBoxPropsHandler} />
              </div>
            </React.Fragment>
          }
        />
        {/* Update for React Router v6: Redirect to /home */}
        <Route path="*" element={<Navigate replace to="/home" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
