import React from "react";
import { useNavigate } from "react-router-dom";

import classes from "./ConfirmDeleteMainMenuSectionItem.module.scss";

import StandardButton from "../../../buttons/standard-button/StandardButton";

interface T {
  section: string;
  selectedItemProperties: MenuItem | null;
  onSetMessageBoxProps: (
    heading: string,
    message: string,
    label: string,
    isError: boolean,
    destination: string
  ) => void;
  onSetMenu: (array: MenuItem[]) => void;
  onTurnOffModal: () => void;
}

interface MenuItem {
  _id: string;
  name: string;
  dietary: string[];
  description: string | null;
}

const ConfirmDeleteMainMenuSectionItem: React.FC<T> = (props) => {
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
      `http://127.0.0.1:5000/api/v1/main-menu/delete-${props.section.toLocaleLowerCase()}-item/${
        props.selectedItemProperties!._id
      }`,
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
          setMessageBoxPropsHandler(data.message, "/home");
          navigate("/alert");
        }

        if (data.status === "success") {
          props.onSetMenu(data.payload);
          props.onTurnOffModal();
        }
      });
  };
  return (
    <div className={classes.box}>
      <h2 className={classes.heading}>{`Delete ${props.section} Item`}</h2>
      <div className={classes["u-column"]}>
        <div className={classes["u-row"]}>
          <p className={classes.para}>{props.selectedItemProperties!.name}</p>
        </div>
        <div className={classes["u-row"]}>
          <StandardButton
            label="Confirm Delete"
            function={() => deleteEmployeeHandler()}
          />
          <StandardButton label="Cancel" function={props.onTurnOffModal} />
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteMainMenuSectionItem;
