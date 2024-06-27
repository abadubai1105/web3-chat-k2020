import React, { useState, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
// INTERNAL IMPORT
import Style from "../styles/login.module.css";
import images from "../assets";
import { ChatAppContect } from "../Context/ChatAppContext";
import { Loader, Model, Register } from "../Components/index";

const Login = () => {
  const { loginUser, registerUser, loading, account, userName, error, connectWallet } = useContext(ChatAppContect);
  const [openModel, setOpenModel] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);

  const handleLogin = () => {
    loginUser(email, password);
  };

  const handleRegister = () => {
    registerUser(email, password);
  };

  const openUser = () => {
    setOpenModel(true);
    setOpenRegister(true);
  }

  return (
    <div className={Style.loginContainer}>
      {loading && <Loader />}
      <div className={Style.loginForm}>
        <Image src={images.buddy} alt="Logo" width={150} height={150} />
        <h1>WELCOME TO WEB3 CHAT APP</h1>
        <div>
            {account == "" ? (
              <button onClick={() => connectWallet()}>
                <span>LET'S START</span>
              </button>
            ) : (
              <button onClick={() => openUser()}>
                LET'S START
              </button>
            )}
          </div>
      </div>
      {openModel && (
        <div className={Style.modelBox}>
          <Model
            openBox={setOpenModel}
            title="WELCOME TO WEB3 CHAT APP"
            head="FROM K20"
            smallInfo="LOG IN/REGISTER"
            image={images.hero}
            functionName={loginUser}
            address={account}
          />
        </div>
      )}
      {error == "" ? "" : <Error error={error} />}
    </div>
  );
};

export default Login;