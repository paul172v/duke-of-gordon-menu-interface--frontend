import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

import classes from "./EditMainMenuSectionItem.module.scss";

import StandardButton from "../../../buttons/standard-button/StandardButton";

interface T {
  section: string;
  menuItem: MenuItem | null;
  onSetMessageBoxProps: (
    heading: string,
    message: string,
    label: string,
    isError: boolean,
    destination: string
  ) => void;
  onTurnOffModal: () => void;
  onSetMenu: (array: MenuItem[]) => void;
  menu: MenuItem[];
}

interface MenuItem {
  _id: string;
  name: string;
  dietary: string[];
  description: string | null;
}

const EditMainMenuSectionItem: React.FC<T> = (props) => {
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
  const nameRef = useRef<HTMLInputElement>(null);
  const dietaryRef = useRef<HTMLSelectElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  //// functions

  const setMessageBoxPropsHandler = (
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

    //// ref values
    const name = nameRef.current?.value;
    const dietary = [dietaryRef.current!.value];

    let description;

    descriptionRef.current?.value !== null &&
    descriptionRef.current?.value !== undefined &&
    descriptionRef.current?.value !== "N/A" &&
    descriptionRef.current?.value.length > 0
      ? (description = descriptionRef.current?.value)
      : null;

    try {
      const response = await fetch(
        `https://duke-of-gordon-menu-interface-d83c02c0eebd.herokuapp.com/api/v1/main-menu/update-${props.section.toLocaleLowerCase()}-item`,
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
            id: props.menuItem!._id,
            name,
            dietary,
            description,
          }),
        }
      );

      const data = await response.json();
      if (data.status === "fail" && data.message.includes("241 characters")) {
        setMessageBoxPropsHandler(
          "⚠️ Description is too long ⚠️",
          "Description can only be 241 characters long",
          "Return to Menu",
          true,
          "/main-menu"
        );
        navigate("/alert");
      } else if (
        data.status === "fail" &&
        !data.message.includes("241 characters")
      ) {
        setMessageBoxPropsHandler(
          "⚠️ Something went wrong ⚠️",
          data.message,
          "Return to Home",
          true,
          "/home"
        );
        navigate("/alert");
      } else if (data.status === "success") {
        props.onSetMenu(data.payload);
        props.onTurnOffModal();
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <div className={classes.box}>
      <h2 className={classes.heading}>{`Edit ${props.section} Item`}</h2>
      <form className={classes.form} onSubmit={submitHandler}>
        <label className={classes.label} htmlFor="name">
          Name:
        </label>
        <input
          className={classes.input}
          type="text"
          name="name"
          defaultValue={props.menuItem!.name}
          ref={nameRef}
        />
        <label className={classes.label} htmlFor="menu-active">
          Dietary:
        </label>
        <select
          className={classes.select}
          name="dietary"
          defaultValue={
            props.menuItem!.dietary.length < 2
              ? [props.menuItem!.dietary].toString().replace(",", ", ")
              : props.menuItem!.dietary
          }
          ref={dietaryRef}
        >
          <option value={["none"]}>none</option>
          <option value={["gf"]}>gluten free</option>
          <option value={["gf available"]}>gluten free available</option>
          <option value={["v"]}>vegetarian</option>
          <option value={["v available"]}>vegetarian available</option>
          <option value={["vgo"]}>vegan</option>
          <option value={["vgo available"]}>vegan available</option>
          <option value={["gf", "v"]}>gluten free & vegetarian</option>
          <option value={["gf", "vgo"]}>gluten free & vegan</option>
          <option value={["gf available", "v"]}>
            gluten free available & vegetarian
          </option>
          <option value={["gf available", "vgo"]}>
            gluten free available & vegan
          </option>
          <option value={["v", "vgo"]}>vegetarian & vegan</option>
          <option value={["v available", "vgo"]}>
            vegetarian available & vegan
          </option>
          <option value={["v available", "vgo available"]}>
            vegetarian available & vegan available
          </option>
          <option value={["gf", "vgo available"]}>
            gluten free & vegan available
          </option>
          <option value={["gf available", "vgo available"]}>
            gluten free available & vegan available
          </option>
          <option value={["v", "vgo available"]}>
            vegetarian & vegan available
          </option>
        </select>
        <label className={classes.label} htmlFor="description">
          Description:
        </label>
        <textarea
          className={classes.textarea}
          defaultValue={
            props.menuItem?.description ? props.menuItem?.description : ""
          }
          ref={descriptionRef}
        />
        <div className={classes["u-row"]}>
          <input
            type="submit"
            className={classes["submit-btn"]}
            value="Submit"
          />

          <StandardButton label="Cancel" function={props.onTurnOffModal} />
        </div>
      </form>
    </div>
  );
};

export default EditMainMenuSectionItem;
