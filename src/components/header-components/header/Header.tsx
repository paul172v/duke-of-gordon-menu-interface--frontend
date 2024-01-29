import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";

import classes from "./Header.module.scss";

import StandardButton from "../../buttons/standard-button/StandardButton";
import UserDetails from "../../user-components/user-details/UserDetails";
import EditUserDetails from "../../user-components/edit-user-details/EditUserDetails";
import EditUserPassword from "../../user-components/edit-user-password/EditUserPassword";

interface T {
  email: string | null;
  onSetEmail: (email: string | null) => void;
  onSetRole: (role: string | null) => void;
  onSetMessageBoxProps: (
    heading: string,
    message: string,
    label: string,
    isError: boolean,
    destination: string
  ) => void;
  onTurnOnHidePage: () => void;
  onTurnOffHidePage: () => void;
}

interface User {
  _id: string;
  firstName: string;
  middleName: string | null; // optional if some employees don't have a middle name
  lastName: string;
  email: string;
}

const Header: React.FC<T> = (props) => {
  const [modalActive, setModalActive] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);
  const [mobileHeaderActive, toggleMobileHeaderActive] = useState(false);

  //// User Details
  const [userDetails, setUserDetails] = useState<User | null>(null);

  //// functions
  const logoutHandler = () => {
    document.cookie = `jwt=null`;
    props.onSetEmail(null);
    props.onSetRole(null);
  };

  const toggleMobileHeaderActiveHandler = () => {
    mobileHeaderActive ? props.onTurnOffHidePage() : props.onTurnOnHidePage();
    toggleMobileHeaderActive(!mobileHeaderActive);
  };

  const turnOnModalUserDetailsHandler = () => {
    setModalActive(true);
    setModalType("UserDetails");
  };

  const turnOnModalEditUserDetailsHandler = () => {
    setModalActive(true);
    setModalType("EditUserDetails");
  };

  const turnOnModalEditUserPasswordHandler = () => {
    setModalActive(true);
    setModalType("EditUserPassword");
  };

  const turnOffModalHandler = () => {
    setModalActive(false);
    setModalType(null);
  };

  const updateUserDetailsHandler = (user: User) => {
    setUserDetails({
      _id: user._id,
      firstName: user.firstName,
      middleName: user.middleName || null,
      lastName: user.lastName,
      email: user.email,
    });
  };

  return (
    <React.Fragment>
      <header className={classes.header}>
        <nav className={classes.nav}></nav>
        <div className={classes["logo-wrapper"]}>
          <img
            className={classes.logo}
            src="dog_logo.png"
            alt="Duke of Gordon Hotel"
          />
        </div>
        <div className={classes["user-settings-wrapper"]}>
          <StandardButton
            label="Change User Details"
            function={turnOnModalUserDetailsHandler}
          />
          <Link to="/home">
            <StandardButton label="Logout" function={logoutHandler} />
          </Link>
        </div>
      </header>

      {mobileHeaderActive === false && (
        <header className={classes["header-mobile--closed"]}>
          <button
            className={classes["btn-open-header-mobile"]}
            onClick={toggleMobileHeaderActiveHandler}
          >
            <GiHamburgerMenu />
          </button>
        </header>
      )}

      {mobileHeaderActive === true && (
        <header className={classes["header-mobile--open"]}>
          <div className={classes["close-header-mobile-wrapper"]}>
            <button
              className={classes["btn-close-header-mobile"]}
              onClick={toggleMobileHeaderActiveHandler}
            >
              X
            </button>
          </div>
          <img
            className={classes["logo-mobile"]}
            src="dog_logo.png"
            alt="Duke of Gordon Hotel"
          />
          <nav className={classes.nav}></nav>
          <div className={classes["user-settings-wrapper"]}>
            <StandardButton
              label="Change User Details"
              function={turnOnModalUserDetailsHandler}
            />
            <Link to="/home">
              <StandardButton label="Logout" function={logoutHandler} />
            </Link>
          </div>
        </header>
      )}

      {modalActive &&
        ReactDOM.createPortal(
          <React.Fragment>
            <div className={classes["modal-background"]} />
            {modalType === "UserDetails" ? (
              <UserDetails
                email={props.email}
                onSetMessageBoxProps={props.onSetMessageBoxProps}
                onUpdateUserDetails={updateUserDetailsHandler}
                userDetails={userDetails}
                onTurnOffModal={turnOffModalHandler}
                onTurnOnEditUserDetails={turnOnModalEditUserDetailsHandler}
                onTurnOnModalEditUserPassword={
                  turnOnModalEditUserPasswordHandler
                }
              />
            ) : (
              ""
            )}
            {modalType === "EditUserDetails" ? (
              <EditUserDetails
                onSetMessageBoxProps={props.onSetMessageBoxProps}
                userDetails={userDetails}
                onTurnOnModalUserDetails={turnOnModalUserDetailsHandler}
              />
            ) : (
              ""
            )}
            {modalType === "EditUserPassword" ? (
              <EditUserPassword
                onSetMessageBoxProps={props.onSetMessageBoxProps}
                onTurnOnModalUserDetails={turnOnModalUserDetailsHandler}
                _id={userDetails!._id}
              />
            ) : (
              ""
            )}
          </React.Fragment>,
          document.getElementById("modal-root")!
        )}
    </React.Fragment>
  );
};

export default Header;
