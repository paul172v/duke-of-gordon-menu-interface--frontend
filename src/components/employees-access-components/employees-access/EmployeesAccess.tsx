import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RingLoader from "react-spinners/RingLoader";

import classes from "./EmployeesAccess.module.scss";

import StandardButton from "../../buttons/standard-button/StandardButton";

interface T {
  onSetMessageBoxProps: (
    heading: string,
    message: string,
    label: string,
    isError: boolean,
    destination: string
  ) => void;
  onTurnOffModal: () => void;
  onTurnOnModalEmployeesAccess: () => void;
  onTurnOnModalEditEmployeesAccess: (
    id: string | null,
    firstName: string | null,
    middleName: string | null,
    lastName: string | null,
    email: string | null,
    role: string | null
  ) => void;
  onTurnOnModalDeleteEmployeesAccess: (
    id: string | null,
    firstName: string | null,
    middleName: string | null,
    lastName: string | null,
    email: string | null,
    role: string | null
  ) => void;
  onSetEmail: (email: string | null) => void;
  onSetRole: (role: string | null) => void;
  onUpdateEmployeeList: (newList: Employee[]) => void;
  employeesList: Employee[];
  isEmployeePending: boolean;
  checkedForPending: boolean;
  onSetIsEmployeePending: (boolean: boolean) => void;
  onSetCheckedForPending: (boolean: boolean) => void;
}

interface Employee {
  _id: string;
  firstName: string;
  middleName: string | null; // optional if some employees don't have a middle name
  lastName: string;
  email: string;
  role: string;
}

const EmployeesAccess: React.FC<T> = (props) => {
  const [dataLoading, setDataLoading] = useState(true);
  const [initialFetchComplete, setInitialFetchComplete] = useState(false);
  const [showEmployeesCategory, setShowEmployeesCategory] = useState("Allowed");

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

  const setShowEmployeesCategoryHandler = (category: string) => {
    setShowEmployeesCategory(category);
  };

  const resetEmployeesAccessListHandler = async () => {
    setDataLoading(true);
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/v1/employees/get-employees-access-list",
        {
          method: "GET",
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
      );

      const data = await response.json();
      if (data.status === "fail") {
        setMessageBoxPropsHandler(data.message, "/home");
        navigate("/alert");
      } else if (data.status === "success") {
        setInitialFetchComplete(true);
        setDataLoading(false);
        props.onUpdateEmployeeList(data.payload.employees);
        props.onSetIsEmployeePending(false);
        props.onSetCheckedForPending(false);
        props.employeesList.length > 0 &&
          props.employeesList.map((el) => {
            if (
              el.role === "Pending" &&
              props.isEmployeePending === false &&
              props.checkedForPending === false
            ) {
              props.onSetIsEmployeePending(true);
              props.onSetCheckedForPending(true);
            }
          });
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    const initialFetchHandler = async () => {
      if (!initialFetchComplete) {
        resetEmployeesAccessListHandler();
      }
    };
    initialFetchHandler();
  }, []);

  {
    if (dataLoading)
      return (
        <div className={classes.box}>
          <h2 className={classes.heading}>Employees Access</h2>
          <RingLoader color="rgba(255, 255, 255, 1)" />
        </div>
      );
  }

  {
    if (!dataLoading && props.employeesList.length === 0)
      return (
        <div className={classes.box}>
          <h2 className={classes.heading}>Employees Access</h2>
          <p className={classes.message}>No employees found!</p>
        </div>
      );
  }

  {
    if (!dataLoading && props.employeesList.length > 0) {
      return (
        <div className={classes.box}>
          <h2 className={classes.heading}>Employees Access</h2>
          {showEmployeesCategory === "Allowed" &&
            props.employeesList.map(
              (el) =>
                el.role !== "Banned" &&
                el.role !== "Pending" && (
                  <div className={classes["u-row"]} key={el._id}>
                    <p className={classes.para}>
                      {el.firstName} {el.middleName} {el.lastName} | {el.email}{" "}
                      |
                      {el.role === "Manager" && (
                        <span className={classes["u-blue"]}> {el.role}</span>
                      )}
                      {el.role === "Allowed" && (
                        <span className={classes["u-green"]}> {el.role}</span>
                      )}
                    </p>
                    <button
                      className={classes.button}
                      onClick={() =>
                        props.onTurnOnModalEditEmployeesAccess(
                          el._id,
                          el.firstName,
                          el.middleName || null,
                          el.lastName,
                          el.email,
                          el.role
                        )
                      }
                    >
                      Edit Access
                    </button>
                    <button
                      className={classes.button}
                      onClick={() =>
                        props.onTurnOnModalDeleteEmployeesAccess(
                          el._id,
                          el.firstName,
                          el.middleName || null,
                          el.lastName,
                          el.email,
                          el.role
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
                )
            )}

          {showEmployeesCategory === "Pending" &&
            props.employeesList.map(
              (el) =>
                el.role === "Pending" && (
                  <div className={classes["u-row"]} key={el._id}>
                    <p
                      className={
                        el.role === "Pending"
                          ? classes["para-faded"]
                          : classes.para
                      }
                    >
                      {el.firstName} {el.middleName} {el.lastName} | {el.email}{" "}
                      |
                      {el.role === "Pending" && (
                        <span className={classes["u-yellow"]}> {el.role}</span>
                      )}
                    </p>
                    <button
                      className={classes.button}
                      onClick={() =>
                        props.onTurnOnModalEditEmployeesAccess(
                          el._id,
                          el.firstName,
                          el.middleName || null,
                          el.lastName,
                          el.email,
                          el.role
                        )
                      }
                    >
                      Edit Access
                    </button>
                    <button
                      className={classes.button}
                      onClick={() =>
                        props.onTurnOnModalDeleteEmployeesAccess(
                          el._id,
                          el.firstName,
                          el.middleName || null,
                          el.lastName,
                          el.email,
                          el.role
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
                )
            )}

          {showEmployeesCategory === "Banned" &&
            props.employeesList.map(
              (el) =>
                el.role === "Banned" && (
                  <div className={classes["u-row"]} key={el._id}>
                    <p className={classes["para-faded"]}>
                      {el.firstName} {el.middleName} {el.lastName} | {el.email}{" "}
                      |
                      {el.role === "Banned" && (
                        <span className={classes["u-red"]}> {el.role}</span>
                      )}
                    </p>
                    <button
                      className={classes.button}
                      onClick={() =>
                        props.onTurnOnModalEditEmployeesAccess(
                          el._id,
                          el.firstName,
                          el.middleName || null,
                          el.lastName,
                          el.email,
                          el.role
                        )
                      }
                    >
                      Edit Access
                    </button>
                    <button
                      className={classes.button}
                      onClick={() =>
                        props.onTurnOnModalDeleteEmployeesAccess(
                          el._id,
                          el.firstName,
                          el.middleName || null,
                          el.lastName,
                          el.email,
                          el.role
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
                )
            )}
          <div className={classes["u-row"]}>
            {showEmployeesCategory === "Allowed" && (
              <>
                <StandardButton
                  label={
                    props.isEmployeePending ? "⚠️ Show Pending" : "Show Pending"
                  }
                  function={() => setShowEmployeesCategoryHandler("Pending")}
                />
                <StandardButton
                  label="Show Banned"
                  function={() => setShowEmployeesCategoryHandler("Banned")}
                />
              </>
            )}

            {showEmployeesCategory === "Banned" && (
              <>
                <StandardButton
                  label="Show Allowed"
                  function={() => setShowEmployeesCategoryHandler("Allowed")}
                />
                <StandardButton
                  label={
                    props.isEmployeePending ? "⚠️ Show Pending" : "Show Pending"
                  }
                  function={() => setShowEmployeesCategoryHandler("Pending")}
                />
              </>
            )}

            {showEmployeesCategory === "Pending" && (
              <>
                <StandardButton
                  label="Show Allowed"
                  function={() => setShowEmployeesCategoryHandler("Allowed")}
                />
                <StandardButton
                  label="Show Banned"
                  function={() => setShowEmployeesCategoryHandler("Banned")}
                />
              </>
            )}
            <StandardButton label="Back" function={props.onTurnOffModal} />
          </div>
        </div>
      );
    }
  }
};

export default EmployeesAccess;
