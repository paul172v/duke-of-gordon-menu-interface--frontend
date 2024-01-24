import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import classes from "./EditUserDetails.module.scss";

import StandardButton from "../../buttons/standard-button/StandardButton";

interface T {
  userDetails: UserDetails | null;
  onTurnOnModalUserDetails: () => void;
  onSetMessageBoxProps: (
    heading: string,
    message: string,
    label: string,
    isError: boolean,
    destination: string
  ) => void;
}

interface UserDetails {
  _id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  email: string;
}

const EditUserDetails: React.FC<T> = (props) => {
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
  const firstNameRef = useRef<HTMLInputElement>(null);
  const middleNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const emailConfirmRef = useRef<HTMLInputElement>(null);

  //// Functions
  const setMessageBoxProps = (message: string, destination: string) => {
    props.onSetMessageBoxProps(
      "⚠️ Something went wrong ⚠️",
      message,
      "Return to Home",
      true,
      destination
    );
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    setShowFormErrorMessage(false);

    const firstName: string | null = firstNameRef.current!.value || null;
    const middleName: string | null = middleNameRef.current!.value || null;
    const lastName: string | null = lastNameRef.current!.value || null;
    const email: string | null = emailRef.current!.value || null;
    const emailConfirm: string | null = emailConfirmRef.current!.value || null;

    if (
      firstName === "" ||
      lastName === "" ||
      email === "" ||
      firstName === null ||
      lastName === null ||
      email === null
    ) {
      setShowFormErrorMessage(true);
      setFormErrorMessage(
        "User must have a first name, last name and email address "
      );
      return;
    }

    if (email && email !== emailConfirm) {
      setShowFormErrorMessage(true);
      setFormErrorMessage(
        "New user email address must match the confirm email address"
      );
      return;
    }

    let updateFields;

    if (!middleName || middleName === "N/A" || middleName.length === 0)
      updateFields = {
        ...{ id: props.userDetails!._id },
        ...{ firstName: firstName },
        ...{ middleName: null },
        ...{ lastName: lastName },
        ...{ email: email },
      };
    else {
      updateFields = {
        ...{ id: props.userDetails!._id },
        ...{ firstName: firstName },
        ...{ middleName: middleName },
        ...{ lastName: lastName },
        ...{ email: email },
      };
    }

    try {
      const response = await fetch(
        "https://duke-of-gordon-menu-interface-d83c02c0eebd.herokuapp.com/api/v1/employees/update-user",
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
          body: JSON.stringify(updateFields),
        }
      );

      const data = await response.json();
      if (data.status === "fail") {
        setMessageBoxProps(data.message, "/home");
        navigate("/alert");
      } else if (data.status === "success") {
        props.onTurnOnModalUserDetails();
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <div className={classes.box}>
      <h2 className={classes.heading}>Edit User Details</h2>
      <form className={classes.form} onSubmit={submitHandler}>
        <label className={classes.label} htmlFor="first-name">
          First Name:
        </label>
        <input
          className={classes.input}
          type="text"
          name="first-name"
          defaultValue={props.userDetails!.firstName}
          ref={firstNameRef}
        />
        <label className={classes.label} htmlFor="middle-name">
          Middle Name:
        </label>
        <input
          className={classes.input}
          type="text"
          name="middle-name"
          defaultValue={
            props.userDetails!.middleName
              ? props.userDetails!.middleName
              : "N/A"
          }
          ref={middleNameRef}
        />
        <label className={classes.label} htmlFor="last-name">
          Last Name:
        </label>
        <input
          className={classes.input}
          type="text"
          name="last-name"
          defaultValue={props.userDetails!.lastName}
          ref={lastNameRef}
        />
        <label className={classes.label} htmlFor="email">
          Email Address:
        </label>
        <input
          className={classes.input}
          type="email"
          name="email"
          defaultValue={props.userDetails!.email}
          ref={emailRef}
        />
        <label className={classes.label} htmlFor="email-confirm">
          Email Address Confirm:
        </label>
        <input
          className={classes.input}
          type="email"
          name="email-confirm"
          defaultValue={props.userDetails!.email}
          ref={emailConfirmRef}
        />
        {showFormErrorMessage && (
          <p className={classes["form-error-message"]}>{formErrorMessage}</p>
        )}
        <div className={classes["u-row"]}>
          <input
            type="submit"
            className={classes["submit-btn"]}
            value="Confirm Changes"
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

export default EditUserDetails;
