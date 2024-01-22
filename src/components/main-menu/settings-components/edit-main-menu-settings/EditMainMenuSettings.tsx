import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

import classes from "./EditMainMenuSettings.module.scss";

import StandardButton from "../../../buttons/standard-button/StandardButton";

interface T {
  onSetMessageBoxProps: (
    heading: string,
    message: string,
    label: string,
    isError: boolean,
    destination: string
  ) => void;
  onTurnOffModal: () => void;
  onSetMenuSettings: (
    menuActive: boolean,
    date: string | null,
    showStarters: boolean,
    showIntermediate: boolean,
    showMains: boolean,
    showDesserts: boolean,
    showPrices: boolean,
    startersPrice: number,
    intermediatePrice: number,
    mainsPrice: number,
    dessertsPrice: number
  ) => void;
  menuSettings: {
    menuActive: boolean;
    date: string | null;
    showStarters: boolean;
    showIntermediate: boolean;
    showMains: boolean;
    showDesserts: boolean;
    showPrices: boolean;
    startersPrice: number;
    intermediatePrice: number;
    mainsPrice: number;
    dessertsPrice: number;
  };
}

const EditMainMenuSettings: React.FC<T> = (props) => {
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
  const menuActiveRef = useRef<HTMLSelectElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const showStartersRef = useRef<HTMLSelectElement>(null);
  const showIntermediateRef = useRef<HTMLSelectElement>(null);
  const showMainsRef = useRef<HTMLSelectElement>(null);
  const showDessertsRef = useRef<HTMLSelectElement>(null);
  const showPricesRef = useRef<HTMLSelectElement>(null);
  const startersPriceRef = useRef<HTMLInputElement>(null);
  const intermediatePriceRef = useRef<HTMLInputElement>(null);
  const mainsPriceRef = useRef<HTMLInputElement>(null);
  const dessertsPriceRef = useRef<HTMLInputElement>(null);

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

  const setMenuSettingsHandler = (
    menuActive: boolean,
    date: string | null,
    showStarters: boolean,
    showIntermediate: boolean,
    showMains: boolean,
    showDesserts: boolean,
    showPrices: boolean,
    startersPrice: number,
    intermediatePrice: number,
    mainsPrice: number,
    dessertsPrice: number
  ) => {
    props.onSetMenuSettings(
      menuActive,
      date,
      showStarters,
      showIntermediate,
      showMains,
      showDesserts,
      showPrices,
      startersPrice,
      intermediatePrice,
      mainsPrice,
      dessertsPrice
    );
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const menuActive = menuActiveRef.current?.value === "true" ? true : false;
    const date = dateRef.current?.value as string;
    const showStarters =
      showStartersRef.current?.value === "true" ? true : false;
    const showIntermediate =
      showIntermediateRef.current?.value === "true" ? true : false;
    const showMains = showMainsRef.current?.value === "true" ? true : false;
    const showDesserts =
      showDessertsRef.current?.value === "true" ? true : false;
    const showPrices = showPricesRef.current?.value === "true" ? true : false;
    const startersPrice = Number(startersPriceRef.current?.value);
    const intermediatePrice = Number(intermediatePriceRef.current?.value);
    const mainsPrice = Number(mainsPriceRef.current?.value);
    const dessertsPrice = Number(dessertsPriceRef.current?.value);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/v1/main-menu/update-main-menu-settings",
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
            menuActive,
            date,
            showStarters,
            showIntermediate,
            showMains,
            showDesserts,
            showPrices,
            startersPrice,
            intermediatePrice,
            mainsPrice,
            dessertsPrice,
          }),
        }
      );

      const data = await response.json();
      if (data.status === "fail") {
        setMessageBoxProps(data.message, "/home");
        navigate("/alert");
      } else if (data.status === "success") {
        setMenuSettingsHandler(
          menuActive,
          date,
          showStarters,
          showIntermediate,
          showMains,
          showDesserts,
          showPrices,
          startersPrice,
          intermediatePrice,
          mainsPrice,
          dessertsPrice
        );
        props.onTurnOffModal();
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <div className={classes.box}>
      <h2 className={classes.heading}>Edit Main Menu Settings</h2>
      <form className={classes.form} onSubmit={submitHandler}>
        <label className={classes.label} htmlFor="menu-active">
          Menu Active:
        </label>
        <select
          className={classes.select}
          name="menu-active"
          defaultValue={
            props.menuSettings.menuActive === true ? "true" : "false"
          }
          ref={menuActiveRef}
        >
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
        <label className={classes.label} htmlFor="date">
          Date:
        </label>
        <input
          className={classes.input}
          name="date"
          defaultValue={
            props.menuSettings.date !== null
              ? props.menuSettings.date
              : "No date currently set"
          }
          ref={dateRef}
        />
        <div className={classes["u-gap"]} />
        <label className={classes.label} htmlFor="show-starters">
          Show Starters:
        </label>
        <select
          className={classes.select}
          name="show-starters"
          defaultValue={
            props.menuSettings.showStarters === true ? "true" : "false"
          }
          ref={showStartersRef}
        >
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
        <label className={classes.label} htmlFor="show-intermediate">
          Show Intermediate:
        </label>
        <select
          className={classes.select}
          name="show-intermediate"
          defaultValue={
            props.menuSettings.showIntermediate === true ? "true" : "false"
          }
          ref={showIntermediateRef}
        >
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
        <label className={classes.label} htmlFor="show-mains">
          Show Mains:
        </label>
        <select
          className={classes.select}
          name="show-mains"
          defaultValue={
            props.menuSettings.showMains === true ? "true" : "false"
          }
          ref={showMainsRef}
        >
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
        <label className={classes.label} htmlFor="show-desserts">
          Show Desserts:
        </label>
        <select
          className={classes.select}
          name="show-desserts"
          defaultValue={
            props.menuSettings.showDesserts === true ? "true" : "false"
          }
          ref={showDessertsRef}
        >
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
        <div className={classes["u-gap"]} />
        <label className={classes.label} htmlFor="show-starters-price">
          Show Prices:
        </label>
        <select
          className={classes.select}
          name="show-prices"
          defaultValue={
            props.menuSettings.showPrices === true ? "true" : "false"
          }
          ref={showPricesRef}
        >
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
        <div className={classes["u-gap"]} />
        <label className={classes.label} htmlFor="starters-price">
          Starters Price:
        </label>
        <input
          className={classes["number-input"]}
          type="text"
          pattern="\d+(\.\d{1,2})?"
          defaultValue={props.menuSettings.startersPrice}
          name="starters-price"
          ref={startersPriceRef}
        />
        <label className={classes.label} htmlFor="intermediate-price">
          Intermediate Price:
        </label>
        <input
          className={classes["number-input"]}
          type="text"
          pattern="\d+(\.\d{1,2})?"
          defaultValue={props.menuSettings.intermediatePrice}
          name="intermediate-price"
          ref={intermediatePriceRef}
        />
        <label className={classes.label} htmlFor="mains-price">
          Mains Price:
        </label>
        <input
          className={classes["number-input"]}
          type="text"
          pattern="\d+(\.\d{1,2})?"
          defaultValue={props.menuSettings.mainsPrice}
          name="mains-price"
          ref={mainsPriceRef}
        />
        <label className={classes.label} htmlFor="desserts-price">
          Desserts Price:
        </label>
        <input
          className={classes["number-input"]}
          type="text"
          pattern="\d+(\.\d{1,2})?"
          defaultValue={props.menuSettings.dessertsPrice}
          name="desserts-price"
          ref={dessertsPriceRef}
        />
        <div className={classes["u-gap"]} />
        <div className={classes["u-row"]}>
          <input
            type="submit"
            className={classes["submit-btn"]}
            value="Submit"
          />

          <StandardButton
            label="Cancel"
            function={() => props.onTurnOffModal}
          />
        </div>
      </form>
    </div>
  );
};

export default EditMainMenuSettings;
