import React, { useState, useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Style from "../Components/Register/UserRegister.module.css";
import images from "../assets";
import { ChatAppContect } from "../Context/ChatAppContext";
import { Loader, Mnem } from "../Components/index";

const Register = ({ openBox, title, address, head, smallInfo, image }) => {
  const [name, setName] = useState("");
  const [userAddress, setUserAddress] = useState(address);
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [mnemVisible, setMnemVisible] = useState(false);
  const [mnemInput, setMnemInput] = useState("");
  const [mnemInputError, setMnemInputError] = useState("");
  const router = useRouter();

  const { loading, createAccount } = useContext(ChatAppContect);

  const validatePassword = (password) => {
    const hasNumber = /\d/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    if (!hasNumber.test(password) || !hasSpecialChar.test(password)) {
      setPasswordError("Password must contain a number and a special character.");
    } else {
      setPasswordError("");
    }
  };
  const samePassword = (password, cpassword) => {
    if (password !== cpassword) {
      setPasswordError("Passwords do not match.");
    } else {
      setPasswordError("");
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
    samePassword(newPassword, cpassword);
  };

  const handleCPasswordChange = (e) => {
    const newCPassword = e.target.value;
    setCPassword(newCPassword);
    validatePassword(newCPassword);
    samePassword(newCPassword, password);
  };

  const handleMnemInputChange = (e) => {
    const input = e.target.value;
    const promise = Promise.resolve(input);
    promise.then((words) => {
      const word = words.split(" ");
      if (word.length < 12 || word.length > 25) {
        setMnemInputError("Mnemonic must be between 12 and 25 words.");
      } else {
        setMnemInputError("");
      }
      setMnemInput(input);
      return word;
    });
  };

  const handleSubmit = async (mnemonic) => {
    // Check if any required fields are empty or have errors
    if (!name || !userAddress || !password || passwordError || mnemInputError|| !cpassword) {
      alert("Please fill in all required fields correctly.");
      return;
    } 
    else {
        setPasswordError("");
        setMnemVisible(false);
        try {
          await createAccount({ name, userAddress, password, mnemonic });
        } catch (error) {
          console.error("Error in handleSubmit:", error);
        }
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Disable the Submit button if any required fields are empty or have errors
  const isSubmitDisabled = !name || !userAddress || !password || passwordError || mnemInputError || !cpassword;

  return (
    <div className={Style.Model}>
      <div className={Style.Model_box}>
        <div className={Style.Model_box_right}>
          <h1>
            {title} <span>{head}</span>
          </h1>
          <small>{smallInfo}</small>

          {loading ? (
            <Loader />
          ) : (
            <div className={Style.container}>
              <h1>REGISTER USER</h1>
              <div className={Style.input_group}>
                <Image src={images.username} alt="user" width={30} height={30} />
                <input required type="text" placeholder="your name" onChange={(e) => setName(e.target.value)} />
              </div>
              <div className={Style.input_group}>
                <Image src={images.account} alt="user" width={30} height={30} />
                <input required type="text" placeholder={address || "Enter address.."} onChange={(e) => setUserAddress(e.target.value)} />
              </div>
              <div className={Style.input_group}>
                <Image src={images.smile} alt="password" width={30} height={30} />
                <div className={Style.password_input_wrapper}>
                  <input
                    required
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Enter password"
                    onChange={handlePasswordChange}
                  />
                  <button
                    type="button"
                    className={Style.toggle_password}
                    onClick={togglePasswordVisibility}
                  >
                    {passwordVisible ? (
                      <Image src={images.eye_close} alt="hide password" width={30} height={30} />
                    ) : (
                      <Image src={images.eye_open} alt="show password" width={30} height={30} />
                    )}
                  </button>
                </div>
              </div>
              <div className={Style.input_group}>
                <Image src={images.smile} alt="password" width={30} height={30} />
                <div className={Style.password_input_wrapper}>
                  <input
                    required
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Confirm password"
                    onChange={handleCPasswordChange}
                  />
                </div>
              </div>
              {passwordError && (<p className={Style.error}>{passwordError}</p>)}
              <div className={Style.button_group}>
              <button onClick={() => setMnemVisible(true)} disabled={isSubmitDisabled}>
                    <Image src={images.send} alt="send" width={30} height={30} />
                    Submit
                  </button>

                <button onClick={() => router.push("/login")}>
                  <Image src={images.close} alt="close" width={30} height={30} />
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {mnemVisible && (
        <Mnem
          handleClose={() => setMnemVisible(false)}
          handleSubmit={handleSubmit}
          mnemInput={mnemInput}
          handleMnemInputChange={handleMnemInputChange}
          mnemInputError={mnemInputError}
        />
      )}
    </div>
  );
};

export default Register;
