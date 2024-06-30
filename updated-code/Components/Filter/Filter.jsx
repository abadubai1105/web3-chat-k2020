import React, { useState, useContext } from "react";
import Image from "next/image";
import 'bootstrap/dist/css/bootstrap.css';

//INTERNAL IMPORT
import Style from "./Filter.module.css";
import images from "../../assets";
import { ChatAppContect } from "../../Context/ChatAppContext";
import { Model } from "../index";

const Filter = () => {
  const { account, addFriends } = useContext(ChatAppContect);

  //USESTATE
  const [addFriend, setAddFriend] = useState(false);
  return (
    <div className={Style.Filter}>
      <div className={Style.Filter_box}>
        <div className={Style.Filter_box_left}>
          <div className={Style.Filter_box_left_search}>
            <Image src={images.search} alt="image" width={20} height={20} />
            <input type="text" placeholder="search.." />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
