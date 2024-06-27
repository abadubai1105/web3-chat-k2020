import React, { useContext } from "react";
import Image from "next/image";

//INTERNAL IMPORT
import Style from "./UserCard.module.css";
import images from "../../assets";
const FriendRequestCard = ({ el, i, acptFriends }) => {
  const isFriends = useContext("ChatAppContect");

  return (
    <div className={Style.UserCard}>
      <div className={Style.UserCard_box}>
        <Image
          className={Style.UserCard_box_img}
          src={images[`image${i + 1}`]}
          alt="user"
          width={100}
          height={100}
        />

        <div className={Style.UserCard_box_info}>
          <h3>{el.name}</h3>
          <p>{el.pubkey.slice(0, 25)}..</p>
          {!isFriends ? (
          <button
            onClick={() =>
              acptFriends({ name: el.name, userAddress: el.pubkey })
            }
          >
            Accept
          </button>) : (<p>Accepted</p>)}
        </div>
      </div>

      <small className={Style.number}>{i + 1}</small>
    </div>
  );
};

export default FriendRequestCard;
