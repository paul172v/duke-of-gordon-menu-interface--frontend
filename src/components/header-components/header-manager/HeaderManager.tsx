import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";

import classes from "./HeaderManager.module.scss";

import StandardButton from "../../buttons/standard-button/StandardButton";
import EmployeesAccess from "../../employees-access-components/employees-access/EmployeesAccess";
import EditEmployeesAccess from "../../employees-access-components/edit-employees-access/EditEmployeesAccess";
import ConfirmDeleteEmployee from "../../employees-access-components/confirm-delete-employee/ConfirmDeleteEmployee";
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
  onTurnOnIsHeaderActive: (isHeaderActive: boolean) => void;
  onTurnOffIsHeaderActive: (isHeaderActive: boolean) => void;
}

interface Employee {
  _id: string;
  firstName: string;
  middleName: string | null; // optional if some employees don't have a middle name
  lastName: string;
  email: string;
  role: string;
}

interface User {
  _id: string;
  firstName: string;
  middleName: string | null; // optional if some employees don't have a middle name
  lastName: string;
  email: string;
}

const HeaderManager: React.FC<T> = (props) => {
  const [modalActive, setModalActive] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);
  const [mobileHeaderActive, toggleMobileHeaderActive] = useState(false);
  ///// Employee Access State
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [employeeFirstName, setEmployeeFirstName] = useState<string | null>(
    null
  );
  const [employeeMiddleName, setEmployeeMiddleName] = useState<string | null>(
    null
  );
  const [employeeLastName, setEmployeeLastName] = useState<string | null>(null);
  const [employeeEmail, setEmployeeEmail] = useState<string | null>(null);
  const [employeeRole, setEmployeeRole] = useState<string | null>(null);
  const [employeesList, setEmployeesList] = useState<Employee[]>([]);
  const [isEmployeePending, setIsEmployeePending] = useState<boolean>(false);
  const [checkedForPending, setCheckedForPending] = useState<boolean>(false);
  //// User Details
  const [userDetails, setUserDetails] = useState<User | null>(null);

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

  //// functions
  const logoutHandler = () => {
    document.cookie = `jwt=null`;
    props.onSetEmail(null);
    props.onSetRole(null);
  };

  const toggleMobileHeaderActiveHandler = () => {
    toggleMobileHeaderActive(!mobileHeaderActive);
  };

  const turnOnModalEmployeesAccessHandler = () => {
    setModalActive(true);
    setModalType("EmployeesAccess");
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

  const turnOnModalEditEmployeesAccessHandler = (
    id: string | null,
    firstName: string | null,
    middleName: string | null,
    lastName: string | null,
    email: string | null,
    role: string | null
  ) => {
    setModalActive(true);
    setModalType("EditEmployeesAccess");
    setEmployeeId(id);
    setEmployeeFirstName(firstName);
    setEmployeeMiddleName(middleName);
    setEmployeeLastName(lastName);
    setEmployeeEmail(email);
    setEmployeeRole(role);
  };

  const turnOnModalConfirmDeleteEmployeeHandler = (
    id: string | null,
    firstName: string | null,
    middleName: string | null,
    lastName: string | null,
    email: string | null,
    role: string | null
  ) => {
    setModalActive(true);
    setModalType("ConfirmDeleteEmployee");
    setEmployeeId(id);
    setEmployeeFirstName(firstName);
    setEmployeeMiddleName(middleName);
    setEmployeeLastName(lastName);
    setEmployeeEmail(email);
    setEmployeeRole(role);
  };

  const turnOffModalHandler = () => {
    setModalActive(false);
    setModalType(null);
  };

  const updateEmployeeListHandler = (newList: Employee[]) => {
    const finalList = newList.filter((employee) => {
      return employee.email !== props.email;
    });
    setEmployeesList(finalList);
    finalList.map((el) => {
      if (el.role === "Pending" && isEmployeePending === false) {
        setIsEmployeePending(true);
      }
    });
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

  const initialGetEmployeesAccessListHandler = async () => {
    try {
      const response = await fetch(
        "https://duke-of-gordon-menu-interface-d83c02c0eebd.herokuapp.com/api/v1/employees/get-employees-access-list",
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
        props.onSetMessageBoxProps(
          "⚠️ Something went wrong ⚠️",
          data.message,
          "Return to Home",
          true,
          "/home"
        );
        navigate("/alert");
      } else if (data.status === "success") {
        setEmployeesList(data.payload.employees);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    initialGetEmployeesAccessListHandler();
  }, []);

  employeesList.length > 0 &&
    employeesList.map((el) => {
      if (
        el.role === "Pending" &&
        isEmployeePending === false &&
        checkedForPending === false
      ) {
        setIsEmployeePending(true);
        setCheckedForPending(true);
      }
    });

  return (
    <React.Fragment>
      <header className={classes.header}>
        <div className={classes.margin}>
          <nav className={classes.nav}>
            <StandardButton
              label={
                isEmployeePending ? "⚠️ Manage Employees" : "Manage Employees"
              }
              function={turnOnModalEmployeesAccessHandler}
            />
          </nav>
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
        </div>
      </header>

      {mobileHeaderActive === false && (
        <header className={classes["header-mobile--closed"]}>
          {isEmployeePending && (
            <p className={classes["mobile-pending-alert"]}>
              ⚠️ Employee access is pending
            </p>
          )}
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
          <nav className={classes.nav}>
            <StandardButton
              label={
                isEmployeePending ? "⚠️ Manage Employees" : "Manage Employees"
              }
              function={turnOnModalEmployeesAccessHandler}
            />
          </nav>
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
            {/* Placeholder */} <div className={classes["modal-content"]} />
            {modalType === "EmployeesAccess" ? (
              <EmployeesAccess
                onSetMessageBoxProps={props.onSetMessageBoxProps}
                onTurnOffModal={turnOffModalHandler}
                onTurnOnModalEmployeesAccess={turnOnModalEmployeesAccessHandler}
                onTurnOnModalEditEmployeesAccess={
                  turnOnModalEditEmployeesAccessHandler
                }
                onTurnOnModalDeleteEmployeesAccess={
                  turnOnModalConfirmDeleteEmployeeHandler
                }
                onSetEmail={props.onSetEmail}
                onSetRole={props.onSetRole}
                onUpdateEmployeeList={updateEmployeeListHandler}
                employeesList={employeesList}
                isEmployeePending={isEmployeePending}
                checkedForPending={checkedForPending}
                onSetIsEmployeePending={setIsEmployeePending}
                onSetCheckedForPending={setCheckedForPending}
              />
            ) : (
              ""
            )}
            {modalType === "EditEmployeesAccess" ? (
              <EditEmployeesAccess
                id={employeeId}
                firstName={employeeFirstName}
                middleName={employeeMiddleName}
                lastName={employeeLastName}
                email={employeeEmail}
                role={employeeRole}
                onTurnOnModalEmployeesAccess={turnOnModalEmployeesAccessHandler}
                onSetMessageBoxProps={props.onSetMessageBoxProps}
              />
            ) : (
              ""
            )}
            {modalType === "ConfirmDeleteEmployee" ? (
              <ConfirmDeleteEmployee
                id={employeeId}
                firstName={employeeFirstName}
                middleName={employeeMiddleName}
                lastName={employeeLastName}
                email={employeeEmail}
                role={employeeRole}
                onSetEmail={props.onSetEmail}
                onSetRole={props.onSetRole}
                onTurnOnModalEmployeesAccess={turnOnModalEmployeesAccessHandler}
                onSetMessageBoxProps={props.onSetMessageBoxProps}
                onUpdateEmployeeList={updateEmployeeListHandler}
                employeesList={employeesList}
              />
            ) : (
              ""
            )}
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

export default HeaderManager;
