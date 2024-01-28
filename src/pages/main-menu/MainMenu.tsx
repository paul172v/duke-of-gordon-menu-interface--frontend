import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import classes from "./MainMenu.module.scss";

import MainMenuSettings from "../../components/main-menu/settings-components/main-menu-settings/MainMenuSettings";
import MainMenuSection from "../../components/main-menu/section-components/main-menu-section/MainMenuSection";

import ComponentModals from "../../components/main-menu/modals/edit-component-item-modal/ComponentModals";

interface T {
  onSetMessageBoxProps: (
    heading: string,
    message: string,
    label: string,
    isError: boolean,
    destination: string
  ) => void;
  isAuthorized: boolean;
  onSetEmail: (email: string | null) => void;
  onSetRole: (role: string | null) => void;
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

interface MenuItem {
  _id: string;
  name: string;
  dietary: string[];
  description: string | null;
}

const MainMenu: React.FC<T> = (props) => {
  const [dataLoading, setDataLoading] = useState(true);
  const [initialFetchComplete, setInitialFetchComplete] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);
  const [menuSettings, setMenuSettings] = useState<MenuSettings>({
    menuActive: false,
    date: null,
    showStarters: false,
    showIntermediate: false,
    showMains: false,
    showDesserts: false,
    showPrices: false,
    startersPrice: 0,
    intermediatePrice: 0,
    mainsPrice: 0,
    dessertsPrice: 0,
  });
  const [menuStarters, setMenuStarters] = useState<MenuItem[]>([]);
  const [menuIntermediate, setMenuIntermediate] = useState<MenuItem[]>([]);
  const [menuMains, setMenuMains] = useState<MenuItem[]>([]);
  const [menuDesserts, setMenuDesserts] = useState<MenuItem[]>([]);
  const [selectedItemProperties, setSelectedItemProperties] =
    useState<MenuItem | null>(null);

  //// Navigate Hook
  const navigate = useNavigate();

  //// Functions
  const setMessageBoxPropsHandler = (
    heading: string,
    message: string,
    label: string,
    isError: boolean,
    destination: string
  ) => {
    props.onSetMessageBoxProps(heading, message, label, isError, destination);
  };

  const setSelectedItemPropertiesHandler = (item: MenuItem) => {
    setSelectedItemProperties(item);
  };

  const turnOnEditMenuSettingsModalHandler = () => {
    setModalActive(true);
    setModalType("EditMenuSettings");
  };

  const turnOnEditSectionItemModalHandler = (
    section: string,
    item: MenuItem
  ) => {
    setModalActive(true);
    setModalType(`Edit${section}Item`);
    setSelectedItemProperties(item);
  };

  const turnOnAddSectionItemModalHandler = (section: string) => {
    setModalActive(true);
    setModalType(`Add${section}Item`);
  };

  const turnOnDeleteSectionItemModalHandler = (section: string) => {
    setModalActive(true);
    setModalType(`Delete${section}Item`);
  };

  const turnOffModalHandler = () => {
    setModalActive(false);
    setModalType(null);
  };

  const nullifyEmailHandler = () => {
    props.onSetEmail(null);
  };

  const nullifyRoleHandler = () => {
    props.onSetRole(null);
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
    setMenuSettings({
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
    });
  };

  const setMenuStartersHandler = (array: MenuItem[]) => {
    setMenuStarters(array);
  };

  const setMenuIntermediateHandler = (array: MenuItem[]) => {
    setMenuIntermediate(array);
  };

  const setMenuMainsHandler = (array: MenuItem[]) => {
    setMenuMains(array);
  };

  const setMenuDessertsHandler = (array: MenuItem[]) => {
    setMenuDesserts(array);
  };

  useEffect(() => {
    const initialFetchHandler = async () => {
      if (!initialFetchComplete) {
        try {
          const response = await fetch(
            "https://duke-of-gordon-menu-interface-d83c02c0eebd.herokuapp.com/api/v1/main-menu/get-all-main-menu-data",
            {
              method: "GET",
              mode: "cors",
              cache: "no-cache",
              credentials: "same-origin",
              headers: {
                "Content-Type": "application/json",
              },
              redirect: "follow",
              referrerPolicy: "no-referrer",
            }
          );

          const data = await response.json();
          if (data.status === "fail") {
            setMessageBoxPropsHandler(
              "⚠️ Something went wrong ⚠️",
              data.message,
              "Back to Home",
              true,
              "/home"
            );
            navigate("/alert");
          } else if (data.status === "success") {
            setInitialFetchComplete(true);
            setDataLoading(false);
            setMenuSettings(data.payload.mainMenuSettings[0]);
            setMenuStarters(data.payload.mainMenuStarters);
            setMenuIntermediate(data.payload.mainMenuIntermediate);
            setMenuMains(data.payload.mainMenuMains);
            setMenuDesserts(data.payload.mainMenuDesserts);
          }
        } catch (error) {
          console.error("Fetch error:", error);
        }
      }
    };

    initialFetchHandler();
  }, [initialFetchComplete]); // Dependency array includes initialFetchComplete

  if (props.isAuthorized === false) {
    nullifyEmailHandler();
    nullifyRoleHandler();
    props.onSetMessageBoxProps(
      "⚠️ Not logged in ⚠️",
      "You are not logged in, please login before proceeding",
      "Back to home",
      true,
      "/home"
    );
    navigate("/alert");
  }

  return (
    <React.Fragment>
      <div className={classes.page}>
        <MainMenuSettings
          dataLoading={dataLoading}
          onTurnOnEditMenuSettingsModal={turnOnEditMenuSettingsModalHandler}
          menuSettings={menuSettings}
        />
        <MainMenuSection
          section="Starters"
          dataLoading={dataLoading}
          menu={menuStarters}
          onTurnOnEditSectionItemModal={turnOnEditSectionItemModalHandler}
          onTurnOnAddSectionItemModal={turnOnAddSectionItemModalHandler}
          onTurnOnDeleteSectionItemModalHandler={
            turnOnDeleteSectionItemModalHandler
          }
          onSetSelectedItemProperties={setSelectedItemPropertiesHandler}
        />
        <MainMenuSection
          section="Intermediate"
          dataLoading={dataLoading}
          menu={menuIntermediate}
          onTurnOnEditSectionItemModal={turnOnEditSectionItemModalHandler}
          onTurnOnAddSectionItemModal={turnOnAddSectionItemModalHandler}
          onTurnOnDeleteSectionItemModalHandler={
            turnOnDeleteSectionItemModalHandler
          }
          onSetSelectedItemProperties={setSelectedItemPropertiesHandler}
        />
        <MainMenuSection
          section="Mains"
          dataLoading={dataLoading}
          menu={menuMains}
          onTurnOnEditSectionItemModal={turnOnEditSectionItemModalHandler}
          onTurnOnAddSectionItemModal={turnOnAddSectionItemModalHandler}
          onTurnOnDeleteSectionItemModalHandler={
            turnOnDeleteSectionItemModalHandler
          }
          onSetSelectedItemProperties={setSelectedItemPropertiesHandler}
        />
        <MainMenuSection
          section="Desserts"
          dataLoading={dataLoading}
          menu={menuDesserts}
          onTurnOnEditSectionItemModal={turnOnEditSectionItemModalHandler}
          onTurnOnAddSectionItemModal={turnOnAddSectionItemModalHandler}
          onTurnOnDeleteSectionItemModalHandler={
            turnOnDeleteSectionItemModalHandler
          }
          onSetSelectedItemProperties={setSelectedItemPropertiesHandler}
        />
      </div>

      <ComponentModals
        selectedItemProperties={selectedItemProperties}
        menuStarters={menuStarters}
        menuIntermediate={menuIntermediate}
        menuMains={menuMains}
        menuDesserts={menuDesserts}
        modalActive={modalActive}
        modalType={modalType}
        onSetMessageBoxProps={setMessageBoxPropsHandler}
        menuSettings={menuSettings}
        onTurnOffModal={turnOffModalHandler}
        onSetMenuSettings={setMenuSettingsHandler}
        onSetMenuStarters={setMenuStartersHandler}
        onSetMenuIntermediate={setMenuIntermediateHandler}
        onSetMenuMains={setMenuMainsHandler}
        onSetMenuDesserts={setMenuDessertsHandler}
        menuItem={null}
      />

      <div className={classes.background} />
    </React.Fragment>
  );
};

export default MainMenu;
