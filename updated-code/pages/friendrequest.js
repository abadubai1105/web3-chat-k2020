import React, { useState, useEffect, useContext } from "react";
//INTRNAL IMPORT
import { FriendRequestCard } from "../Components/index";
import Style from "../styles/friendrequest.module.css";
import { ChatAppContect } from "../Context/ChatAppContext";

const friendrequest = () => {
  const { waitFriendLists, acptFriends } = useContext(ChatAppContect);
  if(!waitFriendLists || waitFriendLists.length === 0){
    return <div>
    <div className={Style.friendrequest_info}>
      <h1>No Friends Request Yet </h1>
    </div>
  </div>
    }
  return (
    <div>
      <div className={Style.friendrequest_info}>
        <h1>Accept Your Friends </h1>
      </div>

      <div className={Style.friendrequest}>
        {waitFriendLists.map((el, i) => (
         <FriendRequestCard key={i + 1} el={el} i={i} acptFriends={acptFriends} />
        ))}
      </div>
    </div>
  );
};

export default friendrequest;
