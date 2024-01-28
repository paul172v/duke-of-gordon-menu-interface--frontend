import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import { Link, useNavigate } from "react-router-dom";

import classes from "./Login.module.scss";
import StandardButton from "../../buttons/standard-button/StandardButton";

interface T {
  onSetMessageBoxProps: (
    heading: string,
    message: string,
    label: string,
    isError: boolean,
    destination: string
  ) => void;
  onSetEmail: (email: string | null) => void;
  onSetRole: (role: string | null) => void;
}

const Login: React.FC<T> = (props) => {
  //// State
  const [formInvalid, setFormInvalid] = useState(false);
  const [validationMessage, setValidationMessage] = useState(
    "Something went wrong!"
  );
  const [showTooltip, setShowTooltip] = useState(false);

  //// Refs
  const inputEmail = useRef<HTMLInputElement>(null);
  const inputPassword = useRef<HTMLInputElement>(null);

  //// Navigate Hook
  const navigate = useNavigate();

  //// Functions
  const setMessageBoxProps = (
    heading: string,
    message: string,
    label: string,
    destination: string,
    isError: boolean
  ) => {
    props.onSetMessageBoxProps(heading, message, label, isError, destination);
  };

  const turnOnTooltipHandler = () => {
    !showTooltip && setShowTooltip(true);
  };

  const turnOffTooltipHandler = () => {
    showTooltip && setShowTooltip(false);
  };

  const toggleTooltipHandler = () => {
    setShowTooltip(!showTooltip);
  };

  const submitHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    const email = inputEmail.current?.value;
    const password = inputPassword.current?.value;

    if (!email || email.length === 0) {
      setFormInvalid(true);
      setValidationMessage("Must enter a valid email address");
    } else if (!password || password.length === 0) {
      setFormInvalid(true);
      setValidationMessage("Must enter a password");
    } else {
      await fetch(
        "https://duke-of-gordon-menu-interface-d83c02c0eebd.herokuapp.com/api/v1/employees/login",
        {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
          referrerPolicy: "no-referrer",
          body: JSON.stringify({
            email,
            password,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "fail") {
            document.cookie = `jwt=null`;
            props.onSetEmail(null);
            props.onSetRole(null);
            data.message === "Invalid password"
              ? setMessageBoxProps(
                  "⚠️ Something went wrong ⚠️",
                  "Invalid password",
                  "Return to login",
                  "/login",
                  true
                )
              : setMessageBoxProps(
                  "⚠️ Something went wrong ⚠️",
                  data.message,
                  "Return to Home",
                  "/home",
                  true
                );
            navigate("/alert");
          }

          if (
            (data.status === "success" && data.role === "Manager") ||
            (data.status === "success" && data.role === "Allowed")
          ) {
            document.cookie = `jwt=Bearer ${data.token}; SameSite=none; secure=true`;
            navigate("/main-menu");
            props.onSetEmail(data.email);
            props.onSetRole(data.role);
          }

          if (data.status === "success" && data.role === "Pending") {
            document.cookie = `jwt=null`;
            props.onSetEmail(null);
            props.onSetRole(null);
            setMessageBoxProps(
              "Account is pending",
              "A manager must authorize this account before it can be used. Please try again later.",
              "Return to Home",
              "/home",
              false
            );
            navigate("/alert");
          }

          if (data.status === "success" && data.role === "Banned") {
            document.cookie = `jwt=null`;
            props.onSetEmail(null);
            props.onSetRole(null);
            setMessageBoxProps(
              "⚠️ Account is banned ⚠️",
              "Your account has been banned and will no longer allow access to the menu interface. If you believe this to be an error please contact a manager.",
              "Return to Home",
              "/home",
              true
            );
            navigate("/alert");
          }
        });
    }
  };

  return (
    <React.Fragment>
      <div className={classes.box}>
        <div className={classes["heading-wrapper"]}>
          <div></div>
          <h2 className={classes.heading}>Log In To Your Account</h2>

          <p
            className={classes["tooltip-trigger"]}
            onMouseEnter={turnOnTooltipHandler}
            onMouseLeave={turnOffTooltipHandler}
          >
            ?
          </p>
          <button
            className={classes["btn-tooltip-mobile"]}
            onClick={toggleTooltipHandler}
          >
            ?
          </button>
        </div>
        <div className={classes["form-wrapper"]}>
          <form className={classes.form} onSubmit={submitHandler}>
            <label className={classes.label} htmlFor="email">
              Email Address
            </label>
            <input type="email" name="email" ref={inputEmail} />
            <label className={classes.label} htmlFor="password">
              Password
            </label>
            <input type="password" name="password" ref={inputPassword} />
            {formInvalid && (
              <p className={classes["error-message"]}>{validationMessage}</p>
            )}
            <div className={classes["buttons-wrapper"]}>
              <input
                type="submit"
                value="Login"
                id={classes["submit-button"]}
              />

              <Link to="/home">
                <StandardButton label="Cancel" function={() => {}} />
              </Link>
            </div>
            <div className={classes["forgot-password-wrapper"]}>
              <Link to="/forgot-password">
                <button className={classes["forgot-password"]}>
                  Forgot Password?
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
      {showTooltip &&
        ReactDOM.createPortal(
          <div className={classes["tooltip-wrapper"]}>
            <p className={classes["tooltip-heading"]}>Email</p>
            <p className={classes["tooltip-heading"]}>Password</p>

            <p className={classes["tooltip-info"]}>manager@DoG.co.uk</p>
            <p className={classes["tooltip-info"]}>aaa</p>

            <p className={classes["tooltip-info"]}>employee@DoG.co.uk</p>
            <p className={classes["tooltip-info"]}>aaa</p>
          </div>,
          document.getElementById("modal-root")!
        )}
    </React.Fragment>
  );
};

export default Login;
