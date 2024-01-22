import React from "react";
import RingLoader from "react-spinners/RingLoader";

import classes from "./MainMenuSettings.module.scss";
import StandardButton from "../../../buttons/standard-button/StandardButton";

interface T {
  dataLoading: boolean;
  onTurnOnEditMenuSettingsModal: () => void;
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

const MainMenuSettings: React.FC<T> = (props) => {
  //// Components
  const SettingItem: React.FC<{
    label: string;
    setting: string | number | null;
  }> = (props) => {
    return (
      <div className={classes["u-row"]}>
        <p className={classes.option}>{props.label}</p>
        {props.setting !== "true" &&
          props.setting !== "false" &&
          typeof props.setting === "string" && (
            <p className={classes.setting}>{props.setting}</p>
          )}
        {props.setting === "true" && (
          <p className={classes["setting-true"]}>{props.setting}</p>
        )}
        {props.setting === "false" && (
          <p className={classes["setting-false"]}>{props.setting}</p>
        )}
        {typeof props.setting === "number" && (
          <p className={classes.setting}>£{props.setting.toFixed(2)}</p>
        )}
      </div>
    );
  };

  //// Functions

  {
    if (props.dataLoading)
      return (
        <div className={classes.box}>
          <h2 className={classes.heading}>Menu Settings</h2>
          <RingLoader color="rgba(255, 255, 255, 1)" />
        </div>
      );
  }

  {
    if (!props.menuSettings && !props.dataLoading)
      return (
        <div className={classes.box}>
          <h2 className={classes.heading}>Menu Settings</h2>
          <p className={classes.para}>Menu settings could not be loaded</p>
        </div>
      );
  }

  {
    if (props.menuSettings && !props.dataLoading)
      return (
        <div className={classes.box}>
          <h2 className={classes.heading}>Menu Settings</h2>
          <SettingItem
            label="Menu Active:"
            setting={props.menuSettings.menuActive === true ? "true" : "false"}
          />
          <SettingItem label="Date:" setting={props.menuSettings.date} />
          <div className={classes["u-gap"]} />
          <SettingItem
            label="Show Starters:"
            setting={
              props.menuSettings.showStarters === true ? "true" : "false"
            }
          />
          <SettingItem
            label="Show Intermediate:"
            setting={
              props.menuSettings.showIntermediate === true ? "true" : "false"
            }
          />
          <SettingItem
            label="Show Mains:"
            setting={props.menuSettings.showMains === true ? "true" : "false"}
          />
          <SettingItem
            label="Show Desserts:"
            setting={
              props.menuSettings.showDesserts === true ? "true" : "false"
            }
          />
          <div className={classes["u-gap"]} />
          <SettingItem
            label="Show Prices:"
            setting={props.menuSettings.showPrices === true ? "true" : "false"}
          />

          <div className={classes["u-gap"]} />
          <SettingItem
            label="Starters Price:"
            setting={props.menuSettings.startersPrice}
          />
          <SettingItem
            label="Intermediate Price:"
            setting={props.menuSettings.intermediatePrice}
          />
          <SettingItem
            label="Mains Price:"
            setting={props.menuSettings.mainsPrice}
          />
          <SettingItem
            label="Desserts Price:"
            setting={props.menuSettings.dessertsPrice}
          />
          <div className={classes["u-gap"]} />
          <StandardButton
            label="Edit Settings"
            function={props.onTurnOnEditMenuSettingsModal}
          />
        </div>
      );
  }
};

export default MainMenuSettings;
