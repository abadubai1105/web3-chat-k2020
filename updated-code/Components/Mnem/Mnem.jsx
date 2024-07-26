import React, { useEffect, useState} from "react";
import Style from "./Mnem.module.css";
import { generateMnemonic } from "../../Utils/Help";
//import { ChatAppContect } from "../../Context/ChatAppContext";

const Mnem = ({ handleClose, handleSubmit, mnemInputError}) => {
const [mnemonic, setMnemonic] = useState("");

const fetchMnemonic = async () => {
  try {
    const generatedMnemonic = await generateMnemonic();

    if (typeof generatedMnemonic === "string") {
      setMnemonic(generatedMnemonic);
    } else {
      console.error("Generated mnemonic is not a string:");
    }
  } catch (error) {
    console.error("Error generating mnemonic:", error);
  }
};

useEffect(() => {
  fetchMnemonic();
}, []);

const handleMnemonicSubmit =  () => {
  handleSubmit(mnemonic);
};

return (
  <div className={Style.mnem}>
    <div className={Style.mnem_content}>
      <h2>Generated MNEMONIC</h2>
      <h6>You must save all this words for logging in later!</h6>
      {mnemonic && (
        <textarea
          className={Style.mnemonicTextarea}
          value={mnemonic}
          readOnly
        />
      )}
      {mnemInputError && <p className={Style.error}>{mnemInputError}</p>}
      <div className={Style.mnem_buttons}>
        <button onClick={handleMnemonicSubmit} disabled={mnemInputError !== ""}>
          Submit
        </button>
        <button onClick={handleClose}>Cancel</button>
      </div>
    </div>
  </div>
);
};

export default Mnem;