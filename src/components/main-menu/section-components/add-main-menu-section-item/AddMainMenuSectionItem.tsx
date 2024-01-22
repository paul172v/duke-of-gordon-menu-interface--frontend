import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

import classes from "./AddMainMenuSectionItem.module.scss";

import StandardButton from "../../../buttons/standard-button/StandardButton";

interface T {
  section: string;
  onSetMessageBoxProps: (
    heading: string,
    message: string,
    label: string,
    isError: boolean,
    destination: string
  ) => void;
  onTurnOffModal: () => void;
  onSetMenu: (array: MenuItem[]) => void;
}

interface MenuItem {
  _id: string;
  name: string;
  dietary: string[];
  description: string | null;
}

const AddMainMenuSectionItem: React.FC<T> = (props) => {
  console.log(props.section);
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

    console.log(dietary);

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/v1/main-menu/create-${props.section.toLocaleLowerCase()}-item`,
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
            name,
            dietary,
            description,
          }),
        }
      );

      const data = await response.json();
      if (data.status === "fail") {
        setMessageBoxProps(data.message, "/home");
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
      <h2 className={classes.heading}>{`Add ${props.section} Item`}</h2>
      <form className={classes.form} onSubmit={submitHandler}>
        <label className={classes.label} htmlFor="name">
          Name:
        </label>
        <input
          className={classes.input}
          type="text"
          name="name"
          ref={nameRef}
        />
        <label className={classes.label} htmlFor="menu-active">
          Dietary:
        </label>
        <select className={classes.select} name="dietary" ref={dietaryRef}>
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
        <textarea className={classes.textarea} ref={descriptionRef} />
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

export default AddMainMenuSectionItem;
