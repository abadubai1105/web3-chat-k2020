  import React, { useState, useEffect, useContext } from "react";
  import Image from "next/image";

  // INTERNAL IMPORT
  import Style from "./UserCard.module.css";
  import images from "../../assets";

  const UserCard = ({ el, i, addFriends }) => {
    // State to manage the image source
    const [imageSrc, setImageSrc] = useState(images[`image${i + 1}`]);
    const isFriends = useContext("ChatAppContect");

    // Effect to load image from local storage
    useEffect(() => {
      const savedImage = localStorage.getItem(`userImage-${i}`);
      if (savedImage) {
        setImageSrc(savedImage);
      }
    }, [i]);

    // Function to handle image change
    const handleImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImageSrc = e.target.result;
          setImageSrc(newImageSrc);
          localStorage.setItem(`userImage-${i}`, newImageSrc);
        };
        reader.readAsDataURL(file);
      }
    };

    return (
      <div className={Style.UserCard}>
        <div className={Style.UserCard_box}>
          <div className={Style.UserCard_box_img_wrapper}>
            <Image
              className={Style.UserCard_box_img}
              src={imageSrc}
              alt="user"
              width={100}
              height={100}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
              id={`upload-button-${i}`}
            />
            <label htmlFor={`upload-button-${i}`} className={Style.uploadButton}>
              Change Image
            </label>
          </div>

          <div className={Style.UserCard_box_info}>
            <h3>{el.name}</h3>
            <p>{el.accountAddress.slice(0, 25)}..</p>
            {!isFriends ? (
            <button
              onClick={() =>
                addFriends({ name: el.name, userAddress: el.accountAddress })
              }
            >
              Add Friend
            </button>) : (<p>Already Friend</p>)}
          </div>
        </div>

        <small className={Style.number}>{i + 1}</small>
      </div>
    );
  };

  export default UserCard;
