import React, { useState, useRef } from "react";

import { useParams, Link, useNavigate } from "react-router-dom";

import classes from "./ForgotPasswordChangePassword.module.scss";

import StandardButton from "../../buttons/standard-button/StandardButton";

interface T {
  onSetMessageBoxProps: (
    heading: string,
    message: string,
    label: string,
    isError: boolean,
    destination: string
  ) => void;
}

const ForgotPasswordChangePassword: React.FC<T> = (props) => {
  //// Token
  const { token } = useParams();

  //// State
  const [formInvalid, setFormInvalid] = useState(false);
  const [validationMessage, setValidationMessage] = useState(
    "Something went wrong!"
  );

  //// Refs
  const inputPassword = useRef<HTMLInputElement>(null);
  const inputPasswordConfirm = useRef<HTMLInputElement>(null);

  //// Navigate Hook
  const navigate = useNavigate();

  //// Functions
  const setMessageBoxPropsHandler = (
    heading: string,
    message: string,
    label: string,
    isError: boolean,
    destination: string
  ) => {
    props.onSetMessageBoxProps(heading, message, label, isError, destination);
  };

  const submitHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    const password = inputPassword.current?.value;
    const passwordConfirm = inputPasswordConfirm.current?.value;

    if (
      !password ||
      password.length === 0 ||
      !passwordConfirm ||
      passwordConfirm.length === 0 ||
      password !== passwordConfirm
    ) {
      setFormInvalid(true);
      setValidationMessage(
        "Must enter a password that matches Password Confirm"
      );
    } else {
      await fetch(
        `https://duke-of-gordon-menu-interface-d83c02c0eebd.herokuapp.com/api/v1/employees/reset-password/${token}`,
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
            password,
            passwordConfirm,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "fail") {
            document.cookie = `jwt=null`;
            setMessageBoxPropsHandler(
              "⚠️ Something went wrong ⚠️",
              data.message,
              "Return to Home",
              true,
              "/home"
            );
            navigate("/alert");
          }

          if (data.status === "success") {
            setMessageBoxPropsHandler(
              "✅ Password changed ✅",
              "Your password has been successfully changed",
              "Return to Login",
              false,
              "login"
            );
            navigate("/home");
          }
        });
    }
  };

  return (
    <div className={classes.box}>
      <div className={classes["heading-wrapper"]}>
        <h2 className={classes.heading}>Reset Password</h2>
      </div>
      <div className={classes["form-wrapper"]}>
        <form className={classes.form} onSubmit={submitHandler}>
          <label className={classes.label} htmlFor="new-password">
            New Password
          </label>
          <input type="new-password" name="new-password" ref={inputPassword} />
          <label className={classes.label} htmlFor="password-confirm">
            Password Confirm
          </label>
          <input
            type="password"
            name="password-confirm"
            ref={inputPasswordConfirm}
          />
          {formInvalid && (
            <p className={classes["error-message"]}>{validationMessage}</p>
          )}
          <div className={classes["buttons-wrapper"]}>
            <input
              type="submit"
              value="Change Password"
              id={classes["submit-button"]}
            />

            <Link to="/home">
              <StandardButton label="Cancel" function={() => {}} />
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordChangePassword;
