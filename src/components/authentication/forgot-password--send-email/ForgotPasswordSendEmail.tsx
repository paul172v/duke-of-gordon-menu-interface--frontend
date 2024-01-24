import React, { useState, useRef } from "react";

import { Link, useNavigate } from "react-router-dom";

import classes from "./ForgotPasswordSendEmail.module.scss";

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

const ForgotPasswordSendEmail: React.FC<T> = (props) => {
  //// State
  const [formInvalid, setFormInvalid] = useState(false);
  const [validationMessage, setValidationMessage] = useState(
    "Something went wrong!"
  );
  const [emailSent, setEmailSent] = useState(false);

  //// Refs
  const inputEmail = useRef<HTMLInputElement>(null);

  //// Navigate Hook
  const navigate = useNavigate();

  //// Functions
  const setMessageBoxPropsHandler = (
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

    const email = inputEmail.current?.value;

    if (!email || email.length === 0) {
      setFormInvalid(true);
      setValidationMessage("Must enter a valid email address");
    } else {
      setEmailSent(true);

      await fetch("http://127.0.0.1:5000/api/v1/employees/forgot-password", {
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
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "fail") {
            document.cookie = `jwt=null`;
            setMessageBoxPropsHandler(
              "⚠️ Something went wrong ⚠️",
              data.message,
              true
            );
            navigate("/alert");
          }

          if (data.status === "success") {
            setMessageBoxPropsHandler(
              "📧 Token sent successfully 📧",
              "Token has been sent, please follow the link in your email",
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
        <h2 className={classes.heading}>Email Reset Token</h2>
      </div>
      <div className={classes["form-wrapper"]}>
        <form className={classes.form} onSubmit={submitHandler}>
          <label className={classes.label} htmlFor="email">
            Email Address
          </label>
          <input type="email" name="email" ref={inputEmail} />
          {formInvalid && (
            <p className={classes["error-message"]}>{validationMessage}</p>
          )}
          <div className={classes["buttons-wrapper"]}>
            {!emailSent ? (
              <input
                type="submit"
                value="Send Email"
                id={classes["submit-button"]}
              />
            ) : (
              <button id={classes["submit-button--sent"]}>
                Sending Email...
              </button>
            )}

            <Link to="/home">
              <StandardButton label="Cancel" function={() => {}} />
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordSendEmail;
