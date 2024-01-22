import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import classes from "./EditUserPassword.module.scss";

import StandardButton from "../../buttons/standard-button/StandardButton";

interface T {
  _id: string;
  onTurnOnModalUserDetails: () => void;
  onSetMessageBoxProps: (
    heading: string,
    message: string,
    label: string,
    isError: boolean,
    destination: string
  ) => void;
}

const EditUserPassword: React.FC<T> = (props) => {
  const [showFormErrorMessage, setShowFormErrorMessage] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);
  //// Get token from cookies
  const cookies = document.cookie.split(";");
  let jwtCookie: string | undefined;

  cookies.map((cookie) =>
    cookie.includes("jwt=Bearer ")
      ? (jwtCookie = cookie.replace("jwt=", ""))
      : (jwtCookie = undefined)
  );

  //// Navigate Hook
  const navigate = useNavigate();

  //// Refs
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  //// Functions
  const setMessageBoxProps = (
    heading: string,
    message: string,
    label: string,
    isError: boolean,
    destination: string
  ) => {
    props.onSetMessageBoxProps(heading, message, label, isError, destination);
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    setShowFormErrorMessage(false);

    const password: string = passwordRef.current!.value;
    const passwordConfirm: string | null =
      passwordConfirmRef.current!.value || null;

    if (password === "" || password === null) {
      setShowFormErrorMessage(true);
      setFormErrorMessage("Please enter a password");
      return;
    }

    if (password && password !== passwordConfirm) {
      setShowFormErrorMessage(true);
      setFormErrorMessage("New password must match the confirm password");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/v1/employees/update-user-password",
        {
          method: "PATCH",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
            authorization: jwtCookie as string,
          },
          redirect: "follow",
          referrerPolicy: "no-referrer",
          body: JSON.stringify({
            id: props._id,
            password: password,
          }),
        }
      );

      const data = await response.json();
      if (data.status === "fail") {
        setMessageBoxProps(
          "⚠️ Something went wrong ⚠️",
          data.message,
          "Return to Home",
          true,
          "/home"
        );
        navigate("/alert");
      } else if (data.status === "success") {
        setMessageBoxProps(
          "Password changed",
          "Your password has been changed successfully",
          "Return to Menu",
          false,
          "/main-menu"
        );
        navigate("/alert");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <div className={classes.box}>
      <h2 className={classes.heading}>Edit User Details</h2>
      <form className={classes.form} onSubmit={submitHandler}>
        <label className={classes.label} htmlFor="password">
          New Password:
        </label>
        <input
          className={classes.input}
          type="password"
          name="password"
          ref={passwordRef}
        />
        <label className={classes.label} htmlFor="password-confirm">
          Password Confirm:
        </label>
        <input
          className={classes.input}
          type="password"
          name="password-confirm"
          ref={passwordConfirmRef}
        />
        {showFormErrorMessage && (
          <p className={classes["form-error-message"]}>{formErrorMessage}</p>
        )}
        <div className={classes["u-row"]}>
          <input
            type="submit"
            className={classes["submit-btn"]}
            value="Confirm Change"
          />
          <StandardButton
            label="Cancel"
            function={props.onTurnOnModalUserDetails}
          />
        </div>
      </form>
    </div>
  );
};

export default EditUserPassword;
