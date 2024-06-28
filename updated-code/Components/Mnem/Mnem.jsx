import React from "react";
import Style from "./Mnem.module.css";

const Mnem = ({
  handleClose,
  handleSubmit,
  mnemInput,
  handleMnemInputChange,
  mnemInputError,
}) => {
  return (
    <div className={Style.mnem}>
      <div className={Style.mnem_content}>
        <h2>Enter MNEMONIC</h2>
        <input
          type="text"
          value={mnemInput}
          onChange={handleMnemInputChange}
          placeholder="Enter text between 9-15 characters"
        />
        {mnemInputError && <p className={Style.error}>{mnemInputError}</p>}
        <div className={Style.mnem_buttons}>
          <button onClick={handleSubmit} disabled={mnemInputError !== ""}>
            Submit
          </button>
          <button onClick={handleClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Mnem;
