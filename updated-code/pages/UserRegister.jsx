import React, { useState, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
//INTERNAL IMPORT
import Style from "../Components/Register/UserRegister.module.css";
import images from "../assets";
import { ChatAppContect } from "../Context/ChatAppContext";
import { Loader } from "../Components/index";
import { useRouter } from "next/router";

const Register = ({
  openBox,
  title,
  address,
  head,
  smallInfo,
  image,
}) => {
  //USESTATE
  const [name, setName] = useState("");
  const [userAddress, setUserAddress] = useState(address);
  const router = useRouter();

  const { loading,createAccount} = useContext(ChatAppContect);
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
                  //value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className={Style.inputGroup}>
                <Image src={images.account} alt="user" width={30} height={30} />
                <input
                  required
                  type="text"
                  placeholder={address || "Enter address.."}
                  //value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                />
              </div>

              <div className={Style.buttonGroup}>
                <button onClick={() => createAccount({ name, userAddress })}>
                  {""}
                  <Image src={images.send} alt="send" width={30} height={30} />
                  {""}
                  Submit
                </button>

                <button onClick={() => router.push("/login")}>
                  {""}
                  <Image src={images.close} alt="send" width={30} height={30} />
                  {""}
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;