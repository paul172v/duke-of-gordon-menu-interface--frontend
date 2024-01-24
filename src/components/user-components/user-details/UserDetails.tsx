import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RingLoader from "react-spinners/RingLoader";

import classes from "./UserDetails.module.scss";

import StandardButton from "../../buttons/standard-button/StandardButton";

interface T {
  email: string | null;
  onSetMessageBoxProps: (
    heading: string,
    message: string,
    label: string,
    isError: boolean,
    destination: string
  ) => void;
  onUpdateUserDetails: (UserDetails: UserDetails) => void;
  userDetails: UserDetails | null;
  onTurnOffModal: () => void;
  onTurnOnEditUserDetails: () => void;
  onTurnOnModalEditUserPassword: () => void;
}

interface UserDetails {
  _id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  email: string;
}

const UserDetails: React.FC<T> = (props) => {
  const [dataLoading, setDataLoading] = useState(true);
  const [initialFetchComplete, setInitialFetchComplete] = useState(false);

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

  const resetUserDetailsHandler = async () => {
    setDataLoading(true);
    try {
      const response = await fetch(
        "https://duke-of-gordon-menu-interface-d83c02c0eebd.herokuapp.com/api/v1/employees/get-user",
        {
          method: "POST",
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
            email: props.email,
          }),
        }
      );

      const data = await response.json();
      if (data.status === "fail") {
        setMessageBoxPropsHandler(data.message, "/home");
        navigate("/alert");
      } else if (data.status === "success") {
        setInitialFetchComplete(true);
        setDataLoading(false);
        props.onUpdateUserDetails({
          _id: data.payload[0]._id,
          firstName: data.payload[0].firstName,
          middleName: data.payload[0].middleName || null,
          lastName: data.payload[0].lastName,
          email: data.payload[0].email,
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    !initialFetchComplete && resetUserDetailsHandler();
  }, []);

  if (!dataLoading && props.userDetails === null)
    return (
      <div className={classes.box}>
        <h2 className={classes.heading}>User Details</h2>
        <p className={classes.message}>No user found!</p>
      </div>
    );

  if (!dataLoading && props.userDetails !== null)
    return (
      <div className={classes.box}>
        <h2 className={classes.heading}>User Details</h2>
        <div className={classes["user-details-wrapper"]}>
          <div className={classes["u-row"]}>
            <p className={classes.label}>First Name:</p>
            <p className={classes.details}>{props.userDetails.firstName}</p>
          </div>

          <div className={classes["u-row"]}>
            <p
              className={
                props.userDetails.middleName
                  ? classes.label
                  : classes["label-faded"]
              }
            >
              Middle Name:
            </p>
            <p
              className={
                props.userDetails.middleName
                  ? classes.details
                  : classes["details-faded"]
              }
            >
              {props.userDetails.middleName !== null
                ? props.userDetails.middleName
                : "N/A"}
            </p>
          </div>

          <div className={classes["u-row"]}>
            <p className={classes.label}>Last Name:</p>
            <p className={classes.details}>{props.userDetails.lastName}</p>
          </div>

          <div className={classes["u-row"]}>
            <p className={classes.label}>Email Address:</p>
            <p className={classes.details}>{props.userDetails.email}</p>
          </div>

          <div className={classes["u-row"]}>
            <StandardButton
              label="Edit Details"
              function={props.onTurnOnEditUserDetails}
            />
            <StandardButton
              label="Edit Password"
              function={props.onTurnOnModalEditUserPassword}
            />
            <StandardButton label="Back" function={props.onTurnOffModal} />
          </div>
        </div>
      </div>
    );

  if (dataLoading === true)
    return (
      <div className={classes.box}>
        <h2 className={classes.heading}>User Details</h2>
        <RingLoader color="rgba(255, 255, 255, 1)" />
      </div>
    );
};

export default UserDetails;
