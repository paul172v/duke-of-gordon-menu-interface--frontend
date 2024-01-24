import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

import classes from "./EditEmployeesAccess.module.scss";

import StandardButton from "../../buttons/standard-button/StandardButton";

interface T {
  id: string | null;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  email: string | null;
  role: string | null;
  onTurnOnModalEmployeesAccess: () => void;
  onSetMessageBoxProps: (
    heading: string,
    message: string,
    label: string,
    isError: boolean,
    destination: string
  ) => void;
}

const EditEmployeesAccess: React.FC<T> = (props) => {
  //// Get token from cookies
  const cookies = document.cookie.split(";");
  let jwtCookie: string | undefined;

  cookies.map((cookie) =>
    cookie.includes("jwt=Bearer ")
      ? (jwtCookie = cookie.replace("jwt=", ""))
      : (jwtCookie = undefined)
  );

  //// Refs
  const selectedRoleRef = useRef<HTMLSelectElement>(null);

  //// Navigate Hook
  const navigate = useNavigate();

  //// Functions
  const setMessageBoxPropsHandler = (message: string, destination: string) => {
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

    const selectedRole = selectedRoleRef!.current!.value;

    await fetch(
      "https://duke-of-gordon-menu-interface-d83c02c0eebd.herokuapp.com/api/v1/employees/update-employee-access",
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
          id: props.id,
          role: selectedRole,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "fail") {
          document.cookie = `jwt=null`;
          setMessageBoxPropsHandler("⚠️ Something went wrong ⚠️", data.message);
          navigate("/alert");
        }

        if (data.status === "success") {
          props.onTurnOnModalEmployeesAccess();
        }
      });
  };

  return (
    <div className={classes.box}>
      <h2 className={classes.heading}>Edit Employee Access</h2>
      <form className={classes.form} onSubmit={submitHandler}>
        <div className={classes["u-row"]}>
          <p className={classes.para}>
            {props.firstName}{" "}
            {props.middleName === null ? "" : `${props.middleName}${" "}`}
            {props.lastName}
            {" | "}
            {props.email}
            {" |"}
          </p>
          <select
            className={classes.select}
            name="select-role"
            defaultValue={props.role !== null ? props.role : ""}
            ref={selectedRoleRef}
          >
            <option value="Manager">Manager</option>
            <option value="Allowed">Allowed</option>
            <option value="Pending">Pending</option>
            <option value="Banned">Banned</option>
          </select>
        </div>
        <div className={classes["u-row"]}>
          <input
            type="submit"
            className={classes["submit-btn"]}
            value="Confirm Change"
          />
          <StandardButton
            label="Cancel"
            function={props.onTurnOnModalEmployeesAccess}
          />
        </div>
      </form>
    </div>
  );
};

export default EditEmployeesAccess;
