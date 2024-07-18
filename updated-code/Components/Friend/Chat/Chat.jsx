import React, { useEffect, useState, useRef,Component} from "react";
import Image from "next/image";
import { useRouter } from "next/router";

// INTERNAL IMPORT
import Style from "./Chat.module.css";
import images from "../../../assets";
import { converTime } from "../../../Utils/apiFeature";
import { Loader } from "../../index";


const Chat  = ({
  functionName,
  readMessage,
  friendMsg,
  account,
  userName,
  loading,
  currentUserName,
  currentUserAddress,
  readUser,
}) => {
  // USE STATE
  const [message, setMessage] = useState("");
  const [chatData, setChatData] = useState({
    name: "",
    address: "",
  });
  const [localFriendMsg, setLocalFriendMsg] = useState([]);
  const [showLoading, setShowLoading] = useState(false);

  const router = useRouter();
  const fname = useRef("");

  const fetchMessages = async () => {
    if (router.isReady && router.query.address) {
      setChatData(router.query);
      await readMessage(router.query.address);
      await readUser(router.query.address);
      await setLocalFriendMsg(friendMsg);
    }
  };

  useEffect(() => {
      fetchMessages();
  }, [router.isReady,router.query]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (chatData.address) {
  //       readMessage(chatData.address);
  //       readUser(chatData.address);
  //       setLocalFriendMsg(friendMsg);
  //     }
  //   }, 10000); // 5 seconds
  
  //   return () => clearInterval(interval);
  // }, [chatData.address, readMessage,readUser]);
  useEffect(() => {
    let intervalId;

    // Set up polling
    intervalId = setInterval(async () => {
      if (chatData.address) {
        await readMessage(chatData.address);
        await setLocalFriendMsg(friendMsg);
      }
    }, 10000); // 5 seconds


    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [chatData.address,readMessage]);
  const handleOnClick = async () => {
    try {
      console.log("Sending message...");
      functionName({
        msg: message,
        address: chatData.address,
        name: chatData.name,
      });
      fname.current.value = "";
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Effect to handle loading state based on keys

  return (
    <div className={Style.Chat}>
      {currentUserName && currentUserAddress && (
        <div className={Style.Chat_user_info}>
          <Image src={images.accountName} alt="image" width={70} height={70} />
          <div className={Style.Chat_user_info_box}>
            <h4>{currentUserName}</h4>
            <p className={Style.show}>{currentUserAddress}</p>
          </div>
        </div>
      )}

      <div className={Style.Chat_box_box}>
        <div className={Style.Chat_box}>
          <div className={Style.Chat_box_left}>
            {localFriendMsg.map((el, i) => (
              <div key={i}>
                {el.sender === chatData.address ? (
                  <div className={Style.Chat_box_left_title}>
                    <Image
                      src={images.accountName}
                      alt="image"
                      width={50}
                      height={50}
                    />
                    <span>
                      {chatData.name} <small>Time: {converTime(el.timestamp)}</small>
                    </span>
                  </div>
                ) : (
                  <div className={Style.Chat_box_left_title}>
                    <Image
                      src={images.accountName}
                      alt="image"
                      width={50}
                      height={50}
                    />
                    <span>
                      {userName} <small>Time: {converTime(el.timestamp)}</small>
                    </span>
                  </div>
                )}
                <p>{el.msg}</p>
              </div>
            ))}
          </div>
        </div>

        {currentUserName && currentUserAddress && (
          <div className={Style.Chat_box_send}>
            <div className={Style.Chat_box_send_img}>
              <Image src={images.smile} alt="smile" width={50} height={50} />
              <input
                type="text"
                placeholder="type your message"
                onChange={(e) => setMessage(e.target.value)}
                ref={fname}
              />
              <Image src={images.file} alt="file" width={50} height={50} />
              {loading ? (
                <Loader />
              ) : (
                <Image
                  src={images.send}
                  alt="send"
                  width={50}
                  height={50}
                  onClick={handleOnClick}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* {showLoading} */}
    </div>
  );
};

export default Chat;
