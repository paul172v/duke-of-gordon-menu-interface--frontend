import React from "react";
import { useNavigate } from "react-router-dom";

import classes from "./ConfirmDeleteEmployee.module.scss";

import StandardButton from "../../buttons/standard-button/StandardButton";

interface T {
  id: string | null;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  email: string | null;
  role: string | null;
  onSetEmail: (email: string | null) => void;
  onSetRole: (role: string | null) => void;
  onTurnOnModalEmployeesAccess: () => void;
  onSetMessageBoxProps: (
    heading: string,
    message: string,
    label: string,
    isError: boolean,
    destination: string
  ) => void;
  onUpdateEmployeeList: (newList: Employee[]) => void;
  employeesList: Employee[];
}

interface Employee {
  _id: string;
  firstName: string;
  middleName: string | null; // optional if some employees don't have a middle name
  lastName: string;
  email: string;
  role: string;
}

const ConfirmDeleteEmployee: React.FC<T> = (props) => {
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

  const deleteEmployeeHandler = async () => {
    await fetch(
      `http://127.0.0.1:5000/api/v1/employees/delete-employee/${props.id}`,
      {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          authorization: jwtCookie as string,
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "fail") {
          document.cookie = `jwt=null`;
          props.onSetEmail(null);
          props.onSetRole(null);
          setMessageBoxPropsHandler(data.message, "/home");
          navigate("/alert");
        }

        if (data.status === "success") {
          const updatedEmployeeList = props.employeesList.filter((employee) => {
            if (employee._id !== props.id) return employee;
          });
          props.onUpdateEmployeeList(updatedEmployeeList);
          deleteEmployeeHandler();
          props.onTurnOnModalEmployeesAccess();
        }
      });
  };
  return (
    <div className={classes.box}>
      <h2 className={classes.heading}>Delete Employee</h2>
      <div className={classes["u-column"]}>
        <div className={classes["u-row"]}>
          <p className={classes.para}>
            {props.firstName}{" "}
            {props.middleName === null ? "" : `${props.middleName}${" "}`}
            {props.lastName}
            {" | "}
            {props.email}
            {" | "}
            {props.role}
          </p>
        </div>
        <div className={classes["u-row"]}>
          <StandardButton
            label="Confirm Delete"
            function={() => deleteEmployeeHandler()}
          />
          <StandardButton
            label="Cancel"
            function={props.onTurnOnModalEmployeesAccess}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteEmployee;
