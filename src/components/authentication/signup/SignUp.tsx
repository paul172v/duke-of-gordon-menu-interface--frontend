import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import classes from "./SignUp.module.scss";

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

const SignUp: React.FC<T> = (props) => {
  //// State
  const [formInvalid, setFormInvalid] = useState(false);
  const [validationMessage, setValidationMessage] = useState(
    "Something went wrong!"
  );

  //// Navigate Hook
  const navigate = useNavigate();

  //// Refs
  const inputFirstName = useRef<HTMLInputElement>(null);
  const inputLastName = useRef<HTMLInputElement>(null);
  const inputEmail = useRef<HTMLInputElement>(null);
  const inputEmailConfirm = useRef<HTMLInputElement>(null);
  const inputPassword = useRef<HTMLInputElement>(null);
  const inputPasswordConfirm = useRef<HTMLInputElement>(null);

  //// Functions
  const setMessageBoxProps = (
    heading: string,
    message: string,
    isError: boolean
  ) => {
    props.onSetMessageBoxProps(
      heading,
      message,
      "Return to Home",
      isError,
      "/home"
    );
  };

  const submitHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    const firstName = inputFirstName.current?.value;
    const lastName = inputLastName.current?.value;
    const email = inputEmail.current?.value;
    const emailConfirm = inputEmailConfirm.current?.value;
    const password = inputPassword.current?.value;
    const passwordConfirm = inputPasswordConfirm.current?.value;

    if (!firstName || firstName.length === 0) {
      setFormInvalid(true);
      setValidationMessage("Must enter a valid first name");
    } else if (!lastName || lastName.length === 0) {
      setFormInvalid(true);
      setValidationMessage("Must enter a valid last name");
    } else if (!email || email.length === 0) {
      setFormInvalid(true);
      setValidationMessage("Must enter a valid, unregistered email address");
    } else if (email !== emailConfirm) {
      setFormInvalid(true);
      setValidationMessage("Email address must match email confirm");
    } else if (
      !password ||
      password.length === 0 ||
      !passwordConfirm ||
      password !== passwordConfirm
    ) {
      setFormInvalid(true);
      setValidationMessage(
        "Must enter a password that matches Password Confirm"
      );
    } else {
      await fetch(
        "https://duke-of-gordon-menu-interface-d83c02c0eebd.herokuapp.com/api/v1/employees/sign-up",
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
            firstName,
            lastName,
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
            setMessageBoxProps(
              "⚠️ Something went wrong ⚠️",
              data.message,
              true
            );
            navigate("/alert");
          }

          if (data.status === "success") {
            document.cookie = `jwt=null`;
            props.onSetEmail(null);
            props.onSetRole(null);
            setMessageBoxProps(
              "Account is pending",
              "A manager must authorize this account before it can be used. Please try to log in later.",
              false
            );
            navigate("/alert");
          }
        });
    }
  };

  return (
    <div className={classes.box}>
      <div className={classes["heading-wrapper"]}>
        <h2 className={classes.heading}>Sign Up</h2>
      </div>
      <div className={classes["form-wrapper"]}>
        <form
          className={!formInvalid ? classes.form : classes["form-error"]}
          onSubmit={submitHandler}
        >
          <label className={classes.label} htmlFor="firstName">
            First Name
          </label>
          <input type="firstName" name="firstName" ref={inputFirstName} />
          <label className={classes.label} htmlFor="lastName">
            Last Name
          </label>
          <input type="lastName" name="lastName" ref={inputLastName} />
          <label className={classes.label} htmlFor="email">
            Email Address
          </label>
          <input type="email" name="email" ref={inputEmail} />
          <label className={classes.label} htmlFor="emailConfirm">
            Email Confirm
          </label>
          <input type="email" name="emailConfirm" ref={inputEmailConfirm} />
          <label className={classes.label} htmlFor="password">
            Password
          </label>
          <input
            id={classes["password-confirm"]}
            type="password"
            name="password"
            ref={inputPassword}
          />
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
          <div
            className={
              !formInvalid
                ? classes["buttons-wrapper"]
                : classes["buttons-wrapper-error"]
            }
          >
            <input
              type="submit"
              value="Create Account"
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

export default SignUp;
