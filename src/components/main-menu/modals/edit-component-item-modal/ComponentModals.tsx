import React from "react";
import ReactDOM from "react-dom";

import classes from "./ComponentModals.module.scss";

import EditMainMenuSectionItem from "../../section-components/edit-main-menu-section-item/EditMainMenuSectionItem";
import EditMainMenuSettings from "../../settings-components/edit-main-menu-settings/EditMainMenuSettings";
import AddMainMenuSectionItem from "../../section-components/add-main-menu-section-item/AddMainMenuSectionItem";
import ConfirmDeleteMainMenuSectionItem from "../../section-components/confirm-delete-main-menu-section-item/ConfirmDeleteMainMenuSectionItem";

import MenuItem from "../../../menu-item/MenuItem";

interface T {
  selectedItemProperties: MenuItem | null;
  menuStarters: MenuItem[];
  menuIntermediate: MenuItem[];
  menuMains: MenuItem[];
  menuDesserts: MenuItem[];
  modalActive: boolean;
  modalType: string | null;
  menuItem: MenuItem | null;
  menuSettings: MenuSettings;
  onSetMenuStarters: (menuItem: MenuItem[]) => void;
  onSetMenuIntermediate: (menuItem: MenuItem[]) => void;
  onSetMenuMains: (menuItem: MenuItem[]) => void;
  onSetMenuDesserts: (menuItem: MenuItem[]) => void;
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
}

interface MenuItem {
  _id: string;
  name: string;
  dietary: string[];
  description: string | null;
}

interface MenuSettings {
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
}

const ComponentModals: React.FC<T> = (props) => {
  return (
    <>
      {props.modalActive &&
        props.modalType === "EditMenuSettings" &&
        ReactDOM.createPortal(
          <React.Fragment>
            <div className={classes["modal-background"]} />
            <EditMainMenuSettings
              onSetMessageBoxProps={props.onSetMessageBoxProps}
              menuSettings={props.menuSettings}
              onTurnOffModal={props.onTurnOffModal}
              onSetMenuSettings={props.onSetMenuSettings}
            />
          </React.Fragment>,
          document.getElementById("modal-root")!
        )}

      {/* ---- Starters ----*/}

      {props.modalActive &&
        props.modalType === "EditStartersItem" &&
        ReactDOM.createPortal(
          <React.Fragment>
            <div className={classes["modal-background"]} />
            <EditMainMenuSectionItem
              section="Starters"
              onSetMessageBoxProps={props.onSetMessageBoxProps}
              menuItem={props.selectedItemProperties}
              onTurnOffModal={props.onTurnOffModal}
              onSetMenu={props.onSetMenuStarters}
              menu={props.menuStarters}
            />
          </React.Fragment>,
          document.getElementById("modal-root")!
        )}

      {props.modalActive &&
        props.modalType === "AddStartersItem" &&
        ReactDOM.createPortal(
          <React.Fragment>
            <div className={classes["modal-background"]} />
            <AddMainMenuSectionItem
              section="Starters"
              onSetMessageBoxProps={props.onSetMessageBoxProps}
              onTurnOffModal={props.onTurnOffModal}
              onSetMenu={props.onSetMenuStarters}
            />
          </React.Fragment>,
          document.getElementById("modal-root")!
        )}

      {props.modalActive &&
        props.modalType === "DeleteStartersItem" &&
        ReactDOM.createPortal(
          <React.Fragment>
            <div className={classes["modal-background"]} />
            <ConfirmDeleteMainMenuSectionItem
              section="Starters"
              onSetMessageBoxProps={props.onSetMessageBoxProps}
              onTurnOffModal={props.onTurnOffModal}
              onSetMenu={props.onSetMenuStarters}
              selectedItemProperties={props.selectedItemProperties}
            />
          </React.Fragment>,
          document.getElementById("modal-root")!
        )}

      {/* ---- Intermediate ----*/}
      {props.modalActive &&
        props.modalType === "EditIntermediateItem" &&
        ReactDOM.createPortal(
          <React.Fragment>
            <div className={classes["modal-background"]} />
            <EditMainMenuSectionItem
              section="Intermediate"
              onSetMessageBoxProps={props.onSetMessageBoxProps}
              menuItem={props.selectedItemProperties}
              onTurnOffModal={props.onTurnOffModal}
              onSetMenu={props.onSetMenuIntermediate}
              menu={props.menuIntermediate}
            />
          </React.Fragment>,
          document.getElementById("modal-root")!
        )}

      {props.modalActive &&
        props.modalType === "AddIntermediateItem" &&
        ReactDOM.createPortal(
          <React.Fragment>
            <div className={classes["modal-background"]} />
            <AddMainMenuSectionItem
              section="Intermediate"
              onSetMessageBoxProps={props.onSetMessageBoxProps}
              onTurnOffModal={props.onTurnOffModal}
              onSetMenu={props.onSetMenuIntermediate}
            />
          </React.Fragment>,
          document.getElementById("modal-root")!
        )}

      {props.modalActive &&
        props.modalType === "DeleteIntermediateItem" &&
        ReactDOM.createPortal(
          <React.Fragment>
            <div className={classes["modal-background"]} />
            <ConfirmDeleteMainMenuSectionItem
              section="Intermediate"
              onSetMessageBoxProps={props.onSetMessageBoxProps}
              onTurnOffModal={props.onTurnOffModal}
              onSetMenu={props.onSetMenuIntermediate}
              selectedItemProperties={props.selectedItemProperties}
            />
          </React.Fragment>,
          document.getElementById("modal-root")!
        )}

      {/* ---- Mains ----*/}
      {props.modalActive &&
        props.modalType === "EditMainsItem" &&
        ReactDOM.createPortal(
          <React.Fragment>
            <div className={classes["modal-background"]} />
            <EditMainMenuSectionItem
              section="Mains"
              onSetMessageBoxProps={props.onSetMessageBoxProps}
              menuItem={props.selectedItemProperties}
              onTurnOffModal={props.onTurnOffModal}
              onSetMenu={props.onSetMenuMains}
              menu={props.menuMains}
            />
          </React.Fragment>,
          document.getElementById("modal-root")!
        )}

      {props.modalActive &&
        props.modalType === "AddMainsItem" &&
        ReactDOM.createPortal(
          <React.Fragment>
            <div className={classes["modal-background"]} />
            <AddMainMenuSectionItem
              section="Mains"
              onSetMessageBoxProps={props.onSetMessageBoxProps}
              onTurnOffModal={props.onTurnOffModal}
              onSetMenu={props.onSetMenuMains}
            />
          </React.Fragment>,
          document.getElementById("modal-root")!
        )}

      {props.modalActive &&
        props.modalType === "DeleteMainsItem" &&
        ReactDOM.createPortal(
          <React.Fragment>
            <div className={classes["modal-background"]} />
            <ConfirmDeleteMainMenuSectionItem
              section="Mains"
              onSetMessageBoxProps={props.onSetMessageBoxProps}
              onTurnOffModal={props.onTurnOffModal}
              onSetMenu={props.onSetMenuMains}
              selectedItemProperties={props.selectedItemProperties}
            />
          </React.Fragment>,
          document.getElementById("modal-root")!
        )}

      {/* ---- Desserts ----*/}
      {props.modalActive &&
        props.modalType === "EditDessertsItem" &&
        ReactDOM.createPortal(
          <React.Fragment>
            <div className={classes["modal-background"]} />
            <EditMainMenuSectionItem
              section="Desserts"
              onSetMessageBoxProps={props.onSetMessageBoxProps}
              menuItem={props.selectedItemProperties}
              onTurnOffModal={props.onTurnOffModal}
              onSetMenu={props.onSetMenuDesserts}
              menu={props.menuDesserts}
            />
          </React.Fragment>,
          document.getElementById("modal-root")!
        )}

      {props.modalActive &&
        props.modalType === "AddDessertsItem" &&
        ReactDOM.createPortal(
          <React.Fragment>
            <div className={classes["modal-background"]} />
            <AddMainMenuSectionItem
              section="Desserts"
              onSetMessageBoxProps={props.onSetMessageBoxProps}
              onTurnOffModal={props.onTurnOffModal}
              onSetMenu={props.onSetMenuDesserts}
            />
          </React.Fragment>,
          document.getElementById("modal-root")!
        )}

      {props.modalActive &&
        props.modalType === "DeleteDessertsItem" &&
        ReactDOM.createPortal(
          <React.Fragment>
            <div className={classes["modal-background"]} />
            <ConfirmDeleteMainMenuSectionItem
              section="Desserts"
              onSetMessageBoxProps={props.onSetMessageBoxProps}
              onTurnOffModal={props.onTurnOffModal}
              onSetMenu={props.onSetMenuDesserts}
              selectedItemProperties={props.selectedItemProperties}
            />
          </React.Fragment>,
          document.getElementById("modal-root")!
        )}
    </>
  );
};

export default ComponentModals;
