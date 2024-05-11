import React, { useState, useEffect, useContext } from "react";
//INTRNAL IMPORT
import { UserCard } from "../Components/index";
import Style from "../styles/alluser.module.css";
import { ChatAppContect } from "../Context/ChatAppContext";

const alluser = () => {
  const { userLists, addFriends } = useContext(ChatAppContect);
  if(!userLists || userLists.length === 0){
    return <div>
    <div className={Style.alluser_info}>
      <h1>No User Yet </h1>
    </div>
  </div>
    }
  return (
    <div>
      <div className={Style.alluser_info}>
        <h1>Find Your Friends </h1>
      </div>

      <div className={Style.alluser}>
        {userLists.map((el, i) => (
          <UserCard key={i + 1} el={el} i={i} addFriends={addFriends} />
        ))}
      </div>
    </div>
  );
};

export default alluser;
