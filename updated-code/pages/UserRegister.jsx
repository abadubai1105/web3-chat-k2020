
import React, { useState, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
//INTERNAL IMPORT
import Style from "../Components/Model/Model.module.css";
import images from "../assets";
import { ChatAppContect } from "../Context/ChatAppContext";
import { Loader } from "../Components/index";


const Register = ({
  openBox,
  title,
  address,
  head,
  info,
  smallInfo,
  image,
}) => {
  //USESTATE
  const [name, setName] = useState("");
  const [userAddress, setUserAddress] = useState(address);

  const { loading,createAccount,setUserName,account} = useContext(ChatAppContect);
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
          <p>{info}</p>
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
                  required
                  type="text"
                  placeholder="your name"
                  //value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className={Style.Model_box_right_name_info}>
                <Image src={images.account} alt="user" width={30} height={30} />
                <input
                  required
                  type="text"
                  placeholder={address || "Enter address.."}
                  //value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                />
              </div>

              <div className={Style.Model_box_right_name_btn}>
                <button onClick={() => createAccount({ name, userAddress })}>
                  {""}
                  <Image src={images.send} alt="send" width={30} height={30} />
                  {""}
                  Submit
                </button>

                <button onClick={() => history.back()}>
                  {""}
                  <Image src={images.close} alt="send" width={30} height={30} />
                  {""}
                  Cancle
                </button>
                <p>Chưa có tài khoản? <Link href='/UserRegister' onClick={() => openBox(false)}>Đăng Ký</Link></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;