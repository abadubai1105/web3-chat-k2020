import React, { useState, useContext, useEffect } from "react"; 
import { UserCard } from "../Components/index"; 
import Style from "../styles/alluser.module.css"; 
import { ChatAppContect } from "../Context/ChatAppContext"; 
import 'bootstrap/dist/css/bootstrap.css';
 
const AllUser = () => { 
  const { userLists, addFriends, currentUserAddress } = useContext(ChatAppContect); 
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
          <UserCard key={i + 1} el={el} i={i} addFriends={addFriends} currentUserAddress={currentUserAddress} /> 
        ))} 
      </div> 
    </div> 
  ); 
}; 
 
export default AllUser;