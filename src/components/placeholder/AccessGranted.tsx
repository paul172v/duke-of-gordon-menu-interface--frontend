import React from "react";

import classes from "./AccessGranted.module.scss";

const AccessGranted: React.FC = () => {
  return (
    <div className={classes.box}>
      <h2 className={classes.heading}>Access Granted</h2>
    </div>
  );
};

export default AccessGranted;
