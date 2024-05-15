// import React, { useState, useEffect, useContext } from "react";
// //INTRNAL IMPORT
// import { FriendRequestCard } from "../Components/index";
// import Style from "../styles/friendrequest.module.css";
// import { ChatAppContect } from "../Context/ChatAppContext";

// const Register = () => {
//   // Khởi tạo state cho thông tin người dùng
  

//   const {isUserLoggedIn,
//     connectWallet,
//     setUserName,
//     setAccount,
//     createAccount} = useContext(ChatAppContect);

//   // useEffect(() => {
//   //   connectWallet();
//   // }, []);
  
//   // Hàm xử lý khi người dùng thay đổi thông tin
//   const [name, setName] = useState("");

//   return (
//     <div className="formContainer">
//       <div className="formWrapper">
//         <span className="logo">Decentralized Messenger</span>
//         <span className="title">Registration</span>
//         <form onSubmit={createAccount({name})}>
//           <input
//             required
//             type="text"
//             placeholder="Username"
//             onChange={(e) => setName(e.target.value)}
//           />
//           {/* <input
//             required
//             type="password"
//             placeholder="Password"
//             onChange={(e) => setPassword(e.target.value)}
//           /> */}
//           <button type="submit">Sign up</button>
//         </form>
//         {/* <p>
//           You do have an account? <span class="register_login"><Link href="/Login">Login</Link>{" "}</span>
//         </p> */}
//       </div>
//     </div>
//   );
// };


// export default Register;

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

  const { loading,createAccount} = useContext(ChatAppContect);
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
                  type="text"
                  placeholder="your name"
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

              <div className={Style.Model_box_right_name_btn}>
                <button onClick={() => createAccount({ name, userAddress })}>
                  {""}
                  <Image src={images.send} alt="send" width={30} height={30} />
                  {""}
                  Submit
                </button>

                <button onClick={() => openBox(false)}>
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