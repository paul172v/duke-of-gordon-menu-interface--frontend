import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import classes from "./App.module.scss";

import LoginSignUp from "./pages/login-sign-up/LoginSignUp";
import Login from "./components/authentication/login/Login";
import ForgotPasswordSendEmail from "./components/authentication/forgot-password--send-email/ForgotPasswordSendEmail";
import ForgotPasswordChangePassword from "./components/authentication/forgot-password--change-password/ForgotPasswordChangePassword";
import SignUp from "./components/authentication/signup/SignUp";
import MessageBox from "./components/message-box/MessageBox";
import MenuSelection from "./components/menu-selection/MenuSelection";
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
  const [hidePageContent, setHidePageContent] = useState(false); //// !!! Fixes a bug where on mobiles if the Employee Access or Mobile Nav were open you would keep scrolling to the height of the page in the background.

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

  const turnOnHidePageContentHandler = () => {
    setHidePageContent(true);
  };

  const turnOffHidePageContentHandler = () => {
    setHidePageContent(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/home"
          element={
            <div className={classes.background}>
              <div className={classes.page}>
                <LoginSignUp />
              </div>
            </div>
          }
        />
        <Route
          path="/login"
          element={
            <div className={classes.background}>
              <div className={classes.page}>
                <Login
                  onSetMessageBoxProps={messageBoxPropsHandler}
                  onSetEmail={setEmailHandler}
                  onSetRole={setRoleHandler}
                />
              </div>
            </div>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <div className={classes.background}>
              <div className={classes.page}>
                <ForgotPasswordSendEmail
                  onSetMessageBoxProps={messageBoxPropsHandler}
                />
              </div>
            </div>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <div className={classes.background}>
              <div className={classes.page}>
                <ForgotPasswordChangePassword
                  onSetMessageBoxProps={messageBoxPropsHandler}
                />
              </div>
            </div>
          }
        />
        <Route
          path="/sign-up"
          element={
            <div className={classes.background}>
              <div className={classes.page}>
                <SignUp
                  onSetMessageBoxProps={messageBoxPropsHandler}
                  onSetEmail={setEmailHandler}
                  onSetRole={setRoleHandler}
                />
              </div>
            </div>
          }
        />
        <Route
          path="/alert"
          element={
            <div className={classes.background}>
              <div className={classes.page}>
                <MessageBox {...messageBoxProps} />
              </div>
            </div>
          }
        />
        <Route
          path="/menu-selection"
          element={
            <React.Fragment>
              {role === "Manager" ? (
                <HeaderManager
                  email={email}
                  onSetEmail={setEmailHandler}
                  onSetRole={setRoleHandler}
                  onSetMessageBoxProps={messageBoxPropsHandler}
                  onTurnOnHidePageContent={turnOnHidePageContentHandler}
                  onTurnOffHidePageContent={turnOffHidePageContentHandler}
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
                  onTurnOnHidePageContent={turnOnHidePageContentHandler}
                  onTurnOffHidePageContent={turnOffHidePageContentHandler}
                />
              ) : (
                ""
              )}
              <div className={classes.background}>
                <div className={classes.page}>
                  {role === "Manager" || role === "Allowed" ? (
                    <MenuSelection
                      isAuthorized={true}
                      onSetMessageBoxProps={messageBoxPropsHandler}
                      onSetEmail={setEmailHandler}
                      onSetRole={setRoleHandler}
                    />
                  ) : (
                    <MenuSelection
                      isAuthorized={false}
                      onSetMessageBoxProps={messageBoxPropsHandler}
                      onSetEmail={setEmailHandler}
                      onSetRole={setRoleHandler}
                    />
                  )}
                </div>
              </div>
            </React.Fragment>
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
                  onTurnOnHidePageContent={turnOnHidePageContentHandler}
                  onTurnOffHidePageContent={turnOffHidePageContentHandler}
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
                  onTurnOnHidePageContent={turnOnHidePageContentHandler}
                  onTurnOffHidePageContent={turnOffHidePageContentHandler}
                />
              ) : (
                ""
              )}
              <div className={classes.background}>
                <div className={classes.page}>
                  {role ? (
                    <MainMenu
                      onSetMessageBoxProps={messageBoxPropsHandler}
                      isAuthorized={true}
                      onSetEmail={setEmailHandler}
                      onSetRole={setRoleHandler}
                      hidePageContent={hidePageContent}
                    />
                  ) : (
                    <MainMenu
                      onSetMessageBoxProps={messageBoxPropsHandler}
                      isAuthorized={false}
                      onSetEmail={setEmailHandler}
                      onSetRole={setRoleHandler}
                      hidePageContent={hidePageContent}
                    />
                  )}
                </div>
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
