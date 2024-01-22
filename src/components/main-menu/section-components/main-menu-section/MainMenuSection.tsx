import React from "react";
import RingLoader from "react-spinners/RingLoader";

import classes from "./MainMenuSection.module.scss";

import StandardButton from "../../../buttons/standard-button/StandardButton";

interface T {
  section: string;
  dataLoading: boolean;
  menu: MenuItem[];
  onTurnOnEditSectionItemModal: (section: string, item: MenuItem) => void;
  onTurnOnAddSectionItemModal: (section: string) => void;
  onTurnOnDeleteSectionItemModalHandler: (section: string) => void;
  onSetSelectedItemProperties: (item: MenuItem) => void;
}

interface MenuItem {
  _id: string;
  name: string;
  dietary: string[];
  description: string | null;
}

const MainMenuSection: React.FC<T> = (props) => {
  //// Functions
  const turnOnDeleteSectionItemModalHandler = (item: MenuItem) => {
    props.onTurnOnDeleteSectionItemModalHandler(props.section);
    props.onSetSelectedItemProperties(item);
  };

  {
    if (props.dataLoading)
      return (
        <div className={classes.box}>
          <h2 className={classes.heading}>${props.section}</h2>
          <RingLoader color="rgba(255, 255, 255, 1)" />
        </div>
      );
  }

  {
    if (!props.menu && !props.dataLoading)
      return (
        <div className={classes.box}>
          <h2 className={classes.heading}>${props.section}</h2>
          <p
            className={classes.para}
          >{`${props.section} could not be loaded`}</p>
        </div>
      );
  }

  {
    if (props.menu.length === 0 && !props.dataLoading)
      return (
        <div className={classes.box}>
          <h2 className={classes.heading}>{props.section}</h2>
          <p
            className={classes.para}
          >{`There are currently no items in the ${props.section} menu`}</p>

          <div className={classes["u-row"]}>
            <StandardButton
              label="Add Item"
              function={() => props.onTurnOnAddSectionItemModal(props.section)}
            />
          </div>
        </div>
      );
  }

  {
    if (props.menu && !props.dataLoading)
      return (
        <div className={classes.box}>
          <h2 className={classes.heading}>{props.section}</h2>
          <div className={classes["grid-wrapper-headings"]}>
            <p className={classes["sub-heading"]}>Name</p>
            <p className={classes["sub-heading"]}>Dietary</p>
            <p className={classes["sub-heading"]}>Description</p>
          </div>

          {props.menu.map((item) => {
            const dietary = item.dietary.toString().replace(",", ", ");

            return (
              <div className={classes["grid-wrapper-items"]} key={item._id}>
                <p className={classes["item-text"]}>{item.name}</p>
                <p className={classes["item-text"]}>
                  {dietary && dietary !== "none" ? `(${dietary})` : ""}
                </p>
                <p className={classes["item-text"]}>{item.description}</p>
                <StandardButton
                  label="Edit"
                  function={() =>
                    props.onTurnOnEditSectionItemModal(props.section, item)
                  }
                />
                <StandardButton
                  label="Delete"
                  function={() => turnOnDeleteSectionItemModalHandler(item)}
                />
              </div>
            );
          })}
          <div className={classes["u-row"]}>
            <StandardButton
              label="Add Item"
              function={() => props.onTurnOnAddSectionItemModal(props.section)}
            />
          </div>
        </div>
      );
  }
};

export default MainMenuSection;
