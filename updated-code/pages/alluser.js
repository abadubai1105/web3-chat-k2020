// import React, { useState, useEffect, useContext } from "react";
// //INTRNAL IMPORT
// import { UserCard } from "../Components/index";
// import Style from "../styles/alluser.module.css";
// import { ChatAppContect } from "../Context/ChatAppContext";

// const alluser = () => {
//   const { userLists, addFriends } = useContext(ChatAppContect);
//   if(!userLists || userLists.length === 0){
//     return <div>
//     <div className={Style.alluser_info}>
//       <h1>No User Yet </h1>
//     </div>
//   </div>
//     }
//   return (
//     <div>
//       <div className={Style.alluser_info}>
//         <h1>Find Your Friends </h1>
//       </div>

//       <div className={Style.alluser}>
//         {userLists.map((el, i) => (
//           <UserCard key={i + 1} el={el} i={i} addFriends={addFriends} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default alluser;

import React, { useState, useContext, useEffect } from "react"; 
import { UserCard } from "../Components/index"; 
import Style from "../styles/alluser.module.css"; 
import { ChatAppContect } from "../Context/ChatAppContext"; 
 
const AllUser = () => { 
  const { userLists, addFriends } = useContext(ChatAppContect); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [filteredUsers, setFilteredUsers] = useState([]); 
 
  useEffect(() => { 
    setFilteredUsers(userLists); 
  }, [userLists]); 
 
  // Hàm tìm kiếm người dùng 
  const handleSearch = (term) => { 
    setSearchTerm(term); 
    if (term.trim() === "") { 
      setFilteredUsers(userLists); 
    } else { 
      const filtered = userLists.filter((user) => { 
        const name = user.name?.toLowerCase() || ""; 
        const address = user.address?.toLowerCase() || ""; 
        return name.includes(term.toLowerCase()) || address.includes(term.toLowerCase()); 
      }); 
      setFilteredUsers(filtered); 
    } 
  }; 
 
  return ( 
    <div className={Style.all}> 
      <div class="input-group flex-nowrap"> 
        <div className={Style.header}> 
          <div className={Style.alluser_info}> 
            <h1>List Friends</h1> 
          </div> 
          <div className={Style.search}> 
            <input 
              type="text" 
              className="form-control" 
              placeholder="Username or Address" 
              aria-label="Username" 
              aria-describedby="addon-wrapping" 
              value={searchTerm} 
              onChange={(e) => handleSearch(e.target.value)} 
            /> 
            <button 
              type="button" 
              className="btn btn-outline-dark" 
              onClick={() => handleSearch(searchTerm)} 
            > 
              <span>Search</span> 
              <i className="bi bi-search"></i> 
            </button> 
          </div> 
        </div> 
      </div> 
      <div className={Style.alluser}> 
        {filteredUsers.map((el, i) => ( 
          <UserCard key={i + 1} el={el} i={i} addFriends={addFriends} /> 
        ))} 
      </div> 
    </div> 
  ); 
}; 
 
export default AllUser;