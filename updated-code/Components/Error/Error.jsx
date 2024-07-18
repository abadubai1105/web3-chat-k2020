import React, { useState, useEffect } from "react";

//INTERNAL IMPORT
import Style from "./Error.module.css";

const Error = ({ error, duration = 5000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    // Clean up the timer on component unmount
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className={Style.Error}>
      <div className={Style.Error_box}>
        <h1>Please Fix This Error & Reload Browser</h1>
        {error}
      </div>
    </div>
  );
};

export default Error;
