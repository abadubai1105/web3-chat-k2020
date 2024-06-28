import React, { useState, useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
// INTERNAL IMPORT
import Style from "../Components/Register/UserRegister.module.css";
import images from "../assets";
import { ChatAppContect } from "../Context/ChatAppContext";
import { Loader, Mnem } from "../Components/index";

const Register = ({
  openBox,
  title,
  address,
  head,
  smallInfo,
  image,
}) => {
  // USESTATE
  const [name, setName] = useState("");
  const [userAddress, setUserAddress] = useState(address);
  const [password, setPassword] = useState("");
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

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const handleMnemInputChange = (e) => {
    const input = e.target.value;
    setMnemInput(input);
    if (input.length < 9 || input.length > 15) {
      setMnemInputError("Text must be between 9 and 15 characters.");
    } else {
      setMnemInputError("");
    }
  };

  const handleSubmit = () => {
    if (mnemInput.length >= 9 && mnemInput.length <= 15) {
      setMnemVisible(false);
      createAccount({ name, userAddress, password, extraText: mnemInput });
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className={Style.Model}>
      <div className={Style.Model_box}>
        <div className={Style.Model_box_left}>
          <Image src={image} alt="buddy" width={100} height={100} />
        </div>
        <div className={Style.Model_box_right}>
          <h1>
            {title} <span>{head}</span>
          </h1>
          <small>{smallInfo}</small>

          {loading == true ? (
            <Loader />
          ) : (
            <div className={Style.container}>
              <h1>REGISTER USER</h1>
              <div className={Style.inputGroup}>
                <Image
                  src={images.username}
                  alt="user"
                  width={30}
                  height={30}
                />
                <input
                  required
                  type="text"
                  placeholder="your name"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className={Style.inputGroup}>
                <Image src={images.account} alt="user" width={30} height={30} />
                <input
                  required
                  type="text"
                  placeholder={address || "Enter address.."}
                  onChange={(e) => setUserAddress(e.target.value)}
                />
              </div>
              <div className={Style.inputGroup}>
                <Image src={images.smile} alt="password" width={30} height={30} />
                <div className={Style.passwordInputWrapper}>
                  <input
                    required
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Enter password"
                    onChange={handlePasswordChange}
                  />
                  <button
                    type="button"
                    className={Style.togglePassword}
                    onClick={togglePasswordVisibility}
                  >
                    {passwordVisible ? <Image src={images.eye_close} alt="hide password" width={30} height={30}/> 
                      : <Image src = {images.eye_open} alt="show password" width={30} height={30}/>}
                  </button>
                </div>
                {passwordError && <p className={Style.error}>{passwordError}</p>}
              </div>
              <div className={Style.buttonGroup}>
                <button
                  onClick={() => setMnemVisible(true)}
                  disabled={passwordError !== ""}
                >
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
