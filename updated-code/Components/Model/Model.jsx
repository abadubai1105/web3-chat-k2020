import React, { useState, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
// INTERNAL IMPORT
import Style from "./Model.module.css";
import images from "../../assets";
import { ChatAppContect } from "../../Context/ChatAppContext";
import { Loader } from "../../Components/index";

const Model = ({
  openBox,
  title,
  address,
  head,
  smallInfo,
  image,
  functionName,
}) => {
  // USESTATE
  const [name, setName] = useState("");
  const [userAddress, setUserAddress] = useState(address);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { loading } = useContext(ChatAppContect);

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

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className={Style.Model}>
      <div className={Style.Model_box}>
        <div className={Style.Model_box_left}>
          <Image src={image} alt="buddy" width={700} height={700} />
        </div>
        <div className={Style.Model_box_right}>
          <h1>
            {title} <span>{head}</span>
          </h1>
          <small>{smallInfo}</small>

          {loading == true ? (
            <Loader />
          ) : (
            <div className={Style.Model_box_right_name}>
              <div className={Style.Model_box_right_name_info}>
                <Image
                  src={images.username}
                  alt="user"
                  width={30}
                  height={30}
                />
                <input
                  type="text"
                  placeholder="Your name"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className={Style.Model_box_right_name_info}>
                <Image src={images.account} alt="user" width={30} height={30} />
                <input
                  type="text"
                  placeholder={address || "Enter address.."}
                  onChange={(e) => setUserAddress(e.target.value)}
                />
              </div>
              <div className={Style.Model_box_right_name_info}>
                <Image src={images.smile} alt="password" width={30} height={30} />
                <div className={Style.password_input_wrapper}>
                  <input
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Enter password"
                    onChange={handlePasswordChange}
                  />
                  <button
                    type="button"
                    className={Style.toggle_password}
                    onClick={togglePasswordVisibility}
                  >
                    {passwordVisible ? <Image src={images.eye_close} alt="hide password" width={30} height={30}/> 
                      : <Image src = {images.eye_open} alt="show password" width={30} height={30}/>}
                  </button>
                </div>
                {passwordError && <p className={Style.error}>{passwordError}</p>}
              </div>
              <div className={Style.Model_box_right_name_btn}>
                <button
                  onClick={() => functionName({ name, userAddress, password })}
                  disabled={passwordError !== ""}
                >
                  <Image src={images.send} alt="send" width={30} height={30} />
                  Submit
                </button>

                <button onClick={() => openBox(false)}>
                  <Image src={images.close} alt="close" width={30} height={30} />
                  Cancel
                </button>
                <p>
                  Do not have account?{" "}
                  <Link href='/UserRegister' onClick={() => openBox(false)}>
                    Register
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Model;
