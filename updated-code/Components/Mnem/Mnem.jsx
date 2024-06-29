import React, { useEffect, useState } from "react";
import Style from "./Mnem.module.css";
import { generateMnemonic } from "../../Utils/Help";

const Mnem = ({
  handleClose,
  handleSubmit,
  mnemInput,
  handleMnemInputChange,
  mnemInputError,
}) => {
  const [mnemonic, setMnemonic] = useState("");
  const [selectedWords, setSelectedWords] = useState([]);

  useEffect(() => {
    const fetchMnemonic = async () => {
      try {
        const generatedMnemonic = await generateMnemonic();
        console.log("Generated Mnemonic:", generatedMnemonic);

        if (typeof generatedMnemonic === "string") {
          setMnemonic(generatedMnemonic);
          handleMnemInputChange({ target: { value: generatedMnemonic } });
        } else {
          console.error("Generated mnemonic is not a string:", generatedMnemonic);
        }
      } catch (error) {
        console.error("Error generating mnemonic:", error);
      }
    };

    fetchMnemonic();
  }, [handleMnemInputChange]);

  const handleWordClick = (word) => {
    const newSelectedWords = [...selectedWords];
    if (newSelectedWords.includes(word)) {
      // Remove word if it's already selected
      const index = newSelectedWords.indexOf(word);
      newSelectedWords.splice(index, 1);
    } else if (newSelectedWords.length < 3) {
      // Add word if it's not already selected and we haven't selected 3 words yet
      newSelectedWords.push(word);
    }

    setSelectedWords(newSelectedWords);

    // Save selected words to localStorage
    localStorage.setItem('selectedMnemonicWords', JSON.stringify(newSelectedWords));
  };

  return (
    <div className={Style.mnem}>
      <div className={Style.mnem_content}>
        <h2>Generated MNEMONIC</h2>
        <h6>Please choose 3 word to secure your account!</h6>
        {mnemonic && (
          <div className={Style.mnemonicWords}>
            {mnemonic.split(" ").map((word, index) => (
              <button
                key={index}
                className={`${Style.mnemonicWord} ${selectedWords.includes(word) ? Style.selected : ""}`}
                onClick={() => handleWordClick(word)}
              >
                {word}
              </button>
            ))}
          </div>
        )}
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
