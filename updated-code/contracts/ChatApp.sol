

// pragma solidity >=0.7.0 <0.9.0;

// contract ChatApp{

   
//     event LoginUser(bool isUserLoggedIn);
//     event RegisterUser(address addr, string name,bool isUserLoggedIn, string pubkey, string pwdHashed);
//     event LogoutUser(bool isUserLoggedIn);
//     event KeyRegistered(address indexed user);
//     event KeyUpdated(address indexed user);
//     event messageSentEvent(address indexed sender, address indexed receiver, string message, uint256 timestamp, string iv,string hmac);


   
//     //USER STRUCT
//     struct user{
//         address addr;
//         string name;
//         friend[] friendList;
//         friend[] addFriendlist;
//         friend[] waitFriendlist;
//         bool isUserLoggedIn;
//         string pubkey;
//         bytes32 passwordHashed;
//         address[] groupList;
//     }

//     struct friend{
//         address pubkey;
//         string name;
//     }

//     struct message{
//         address sender;
//         uint256 timestamp;
//         string msg;
//         string iv;
//         string hmac;
//     }

//     struct AllUserStruck{
//         string name;
//         address accountAddress;
//     }
//     struct Group{
//         string name;
//         address[] members;
//         message[] messages;
//     }

    
//     AllUserStruck[] getAllUsers;

//     mapping(address => user) public userList;
//     mapping(bytes32 => message[]) allMessages;

//     address [] public addresses;

//     //CHECK USER EXIST
//     function checkUserExists(address pubkey) public view returns(bool){
//         return bytes(userList[pubkey].name).length > 0;
//     }

//     function loginUser(address _address, string calldata _name, string calldata _password) external returns(bool){
//         require(checkUserExists(_address), "User is not registered");
//         if(keccak256(abi.encodePacked(userList[_address].name)) ==
//             keccak256(abi.encodePacked(_name)) && userList[_address].addr == 
//             _address && keccak256(abi.encodePacked(_password)) == userList[_address].passwordHashed){
//             userList[msg.sender].isUserLoggedIn = true;
//             emit LoginUser(true);
//             return userList[_address].isUserLoggedIn;
//         } else {
//             emit LoginUser(false);
//             return false;
//         }
//     }

//     function checkIsUserLogged(address _address) public view returns (bool){
//         return (userList[_address].isUserLoggedIn);
//     }
//     function logoutUser(address _address) public{
//         require(checkIsUserLogged(_address), "User is not LogIn");
//         userList[_address].isUserLoggedIn = false;
//         emit LoginUser(false);
        
//     }
//     //CREATE ACCOUNT
//     function registerUser(address _address, string calldata _name,string calldata _pubkey, string calldata _password) external returns(bool){
//         require(bytes(_name).length > 0, "Username cannot be empty");
//         require(checkUserExists(_address) == false, "User already exists");
        
//         userList[_address].name = _name;
//         userList[_address].addr = _address;
//         userList[_address].isUserLoggedIn = false;
//         userList[_address].pubkey = _pubkey;
//         userList[_address].passwordHashed = keccak256(abi.encodePacked(_password));
        
//         emit RegisterUser(_address, _name, false, _pubkey, _password);
//         getAllUsers.push(AllUserStruck(_name, msg.sender));
//         return true;
//     }

//     //GET USERNAME
//     function getUsername(address pubkey) external view returns(string memory){
//         require(checkUserExists(pubkey), "User is not registered");
//         return userList[pubkey].name;
//     }

//     //ADD FRIENDS
//     function addFriend(address friend_key, string calldata name) external{
//         require(checkUserExists(msg.sender), "Create an account first");
//         require(checkUserExists(friend_key), "User is not registered!");
//         require(msg.sender != friend_key, "Users cannot add themeselves as friends");
//         require(checkAlreadyFriends(msg.sender, friend_key)== false, "These users are already friends");

//         _addFriend(msg.sender, friend_key, name);
//         _waitFriend(friend_key, msg.sender, userList[msg.sender].name);
//     }

//     function acptFriend(address friend_key, string calldata name) external {
//         require(checkUserExists(msg.sender), "Create an account first");
//         require(checkUserExists(friend_key), "User is not registered!");

//         _acptFriend(msg.sender, friend_key, name);
//         _acptFriend(friend_key, msg.sender, userList[msg.sender].name);
//     }

//     //checkAlreadyFriends
//     function checkAlreadyFriends(address pubkey1, address pubkey2) internal view returns (bool){

//         if(userList[pubkey1].friendList.length > userList[pubkey2].friendList.length){
//             address tmp = pubkey1;
//             pubkey1 = pubkey2;
//             pubkey2 = tmp;
//         }

//         for(uint256 i = 0; i < userList[pubkey1].friendList.length; i++){
            
//             if(userList[pubkey1].friendList[i].pubkey == pubkey2) return true;
//         }
//         return false;
//     }

//     function _acptFriend(address me, address friend_key, string memory name) internal{
//         friend memory newFriend = friend(friend_key, name);
//         userList[me].friendList.push(newFriend);
//     }

//     function _addFriend(address me, address friend_key, string memory name) internal{
//         friend memory newFriend = friend(friend_key, name);
//         userList[me].addFriendlist.push(newFriend);
//     }

//     function _waitFriend(address me, address friend_key, string memory name) internal{
//         friend memory newFriend = friend(friend_key, name);
//         userList[me].waitFriendlist.push(newFriend);
//     }

//     //GETMY FRIEND
//     function getMyFriendList() external view returns(friend[] memory){
//         return userList[msg.sender].friendList;
//     }

//     //GET LIST ADD FRIEND
//     function getMyAFriendList() external view returns(friend[] memory){
//         return userList[msg.sender].addFriendlist;
//     }

//     //GET LIST WAIT FRIEND
//     function getMyWFriendList() external view returns(friend[] memory){
//         return userList[msg.sender].waitFriendlist;
//     }

//     //get chat code
//     function _getChatCode(address pubkey1, address pubkey2) internal pure returns(bytes32){
//         if(pubkey1 < pubkey2){
//             return keccak256(abi.encodePacked(pubkey1, pubkey2));
//         } else 
//         return keccak256(abi.encodePacked(pubkey2, pubkey1));
//     }

//     //SEND MESSAGE
//     function sendMessage(address friend_key, string calldata _msg, string calldata iv,string calldata hmac) external{
//        require(checkUserExists(msg.sender), "Create an account first");
//         require(checkUserExists(friend_key), "User is not registered");
//         require(checkAlreadyFriends(msg.sender, friend_key), "You are not friend with the given user");

//         bytes32 chatCode = _getChatCode(msg.sender, friend_key);
//         message memory newMsg = message(msg.sender, block.timestamp, _msg, iv,hmac);
//         allMessages[chatCode].push(newMsg);

//         emit messageSentEvent(msg.sender, friend_key, _msg, block.timestamp, iv,hmac);
//     }

//     //READ MESSAGE
//     function readMessage(address friend_key) external view returns(message[] memory){
//         bytes32 chatCode = _getChatCode(msg.sender, friend_key);
//         return allMessages[chatCode];
//     }

//     //GET ALL USER
//      function getAllAppUser() public view returns(AllUserStruck[] memory){
//         return getAllUsers;
//     }

//     function getPublicKey(address addr) public view returns(string memory){
//         return userList[addr].pubkey;
//     }
//     // function getPrivateKey(address addr) public view returns(string memory){
//     //     return userList[addr].privkey;
//     // }

//     function changePasswordUser(address addr, bytes32 password) public{
//         require(addr != address(0), 
//         "User with given address does not exist.");

//         userList[addr].passwordHashed = password;
//     }

//     // function createGroup(string memory groupName, address[] memory members) external{
//     //     require(checkUserExists(msg.sender), "Create an account first");
//     //     require(members.length > 1, "Group must have at least 2 members");
//     //     bytes32 groupCode = keccak256(abi.encodePacked(groupName));
//     //     groupList[groupCode] = Group({
//     //         name: groupName,
//     //         members: members,
//     //         messages: new message[](0)
//     //     });
//     // }

// }



// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract ChatApp{

   
    event LoginUser(bool isUserLoggedIn);
    event RegisterUser(address addr, string name,bool isUserLoggedIn, string pubkey, string pwdHashed);
    event LogoutUser(bool isUserLoggedIn);
    event KeyRegistered(address indexed user);
    event KeyUpdated(address indexed user);
    event messageSentEvent(address indexed sender, address indexed receiver, string message, uint256 timestamp, string iv,string hmac);

    event ChangePasswordUser(bool success);
    //event FileUploaded(address indexed user, string name);


   
    //USER STRUCT
    struct user{
        address addr;
        string name;
        friend[] friendList;
        friend[] addFriendlist;
        friend[] waitFriendlist;
        bool isUserLoggedIn;
        string pubkey;
        bytes32 passwordHashed;
    }

    struct friend{
        address pubkey;
        string name;
    }

    struct message{
        address sender;
        uint256 timestamp;
        string msg;
        string iv;
        string hmac;
    }

    struct AllUserStruck{
        string name;
        address accountAddress;
    }
    struct File {
        string name;
        bytes data;
    }

    
    AllUserStruck[] getAllUsers;

    mapping(address => user) public userList;
    mapping(bytes32 => message[]) allMessages;

    // mapping(address => File[]) fileStorage;


    // function uploadFile(string memory _name, bytes memory _data) public {
    //     fileStorage[msg.sender].push(File(_name, _data));
    //     emit FileUploaded(msg.sender, _name);
    // }

    // function getFile(address _address, uint index) public view returns (string memory name, bytes memory data) {
    //     require(index < fileStorage[_address].length, "File does not exist");
    //     File storage file = fileStorage[_address][index];
    //     return (file.name, file.data);
    // }

    // function getFileCount(address _address) public view returns (uint) {
    //     return fileStorage[_address].length;
    // }


    address [] public addresses;

    //CHECK USER EXIST
    function checkUserExists(address pubkey) public view returns(bool){
        return bytes(userList[pubkey].name).length > 0;
    }

    function loginUser(address _address, string calldata _name, string calldata _password) external returns(bool){
        require(checkUserExists(_address), "User is not registered");
        if(keccak256(abi.encodePacked(userList[_address].name)) ==
            keccak256(abi.encodePacked(_name)) && userList[_address].addr == 
            _address && keccak256(abi.encodePacked(_password)) == userList[_address].passwordHashed){
            userList[msg.sender].isUserLoggedIn = true;
            emit LoginUser(true);
            return userList[_address].isUserLoggedIn;
        } else {
            emit LoginUser(false);
            return false;
        }
    }

    function checkIsUserLogged(address _address) public view returns (bool){
        return (userList[_address].isUserLoggedIn);
    }
    function logoutUser(address _address) public{
        require(checkIsUserLogged(_address), "User is not registered");
        userList[_address].isUserLoggedIn = false;
        emit LoginUser(false);
        
    }
    //CREATE ACCOUNT
    function registerUser(address _address, string calldata _name,string calldata _pubkey, string calldata _password) external returns(bool){
        require(bytes(_name).length > 0, "Username cannot be empty");
        require(checkUserExists(_address) == false, "User already exists");
        
        userList[_address].name = _name;
        userList[_address].addr = _address;
        userList[_address].isUserLoggedIn = false;
        userList[_address].pubkey = _pubkey;
        userList[_address].passwordHashed = keccak256(abi.encodePacked(_password));
        
        emit RegisterUser(_address, _name, false, _pubkey, _password);
        getAllUsers.push(AllUserStruck(_name, msg.sender));
        return true;
    }

    //GET USERNAME
    function getUsername(address pubkey) external view returns(string memory){
        require(checkUserExists(pubkey), "User is not registered");
        return userList[pubkey].name;
    }

    function removeAcptFriend(address friend_key) internal{
        require(checkUserExists(msg.sender), "Create an account first");
        require(checkUserExists(friend_key), "User is not registered!");
        _removeAcptFriend(msg.sender, friend_key);
        _removeAcptFriend(friend_key, msg.sender);
    }
    function _removeAcptFriend(address me, address friend_key) internal{
        for(uint256 i = 0; i < userList[me].addFriendlist.length; i++){
            if(userList[me].addFriendlist[i].pubkey == friend_key){
                userList[me].addFriendlist[i] = userList[me].addFriendlist[userList[me].addFriendlist.length-1];
                userList[me].addFriendlist.pop();
            }
        }
        for(uint256 i = 0; i < userList[me].waitFriendlist.length; i++){
            if(userList[me].waitFriendlist[i].pubkey == friend_key){
                userList[me].waitFriendlist[i] = userList[me].waitFriendlist[userList[me].waitFriendlist.length-1];
                userList[me].waitFriendlist.pop();
            }
        }
    }
    //ADD FRIENDS
    function addFriend(address friend_key, string calldata name) external{
        require(checkUserExists(msg.sender), "Create an account first");
        require(checkUserExists(friend_key), "User is not registered!");
        require(msg.sender != friend_key, "Users cannot add themeselves as friends");
        require(checkAlreadyFriends(msg.sender, friend_key)== false, "These users are already friends");

        _addFriend(msg.sender, friend_key, name);
        _waitFriend(friend_key, msg.sender, userList[msg.sender].name);
    }

    function acptFriend(address friend_key, string calldata name) external {
        require(checkUserExists(msg.sender), "Create an account first");
        require(checkUserExists(friend_key), "User is not registered!");

        _acptFriend(msg.sender, friend_key, name);
        _acptFriend(friend_key, msg.sender, userList[msg.sender].name);
        removeAcptFriend(friend_key);
    }

    //checkAlreadyFriends
    function checkAlreadyFriends(address pubkey1, address pubkey2) internal view returns (bool){

        if(userList[pubkey1].friendList.length > userList[pubkey2].friendList.length){
            address tmp = pubkey1;
            pubkey1 = pubkey2;
            pubkey2 = tmp;
        }

        for(uint256 i = 0; i < userList[pubkey1].friendList.length; i++){
            
            if(userList[pubkey1].friendList[i].pubkey == pubkey2) return true;
        }
        return false;
    }

    function _acptFriend(address me, address friend_key, string memory name) internal{
        friend memory newFriend = friend(friend_key, name);
        userList[me].friendList.push(newFriend);
    }

    function _addFriend(address me, address friend_key, string memory name) internal{
        friend memory newFriend = friend(friend_key, name);
        userList[me].addFriendlist.push(newFriend);
    }

    function _waitFriend(address me, address friend_key, string memory name) internal{
        friend memory newFriend = friend(friend_key, name);
        userList[me].waitFriendlist.push(newFriend);
    }

    //GETMY FRIEND
    function getMyFriendList() external view returns(friend[] memory){
        return userList[msg.sender].friendList;
    }

    //GET LIST ADD FRIEND
    function getMyAFriendList() external view returns(friend[] memory){
        return userList[msg.sender].addFriendlist;
    }

    //GET LIST WAIT FRIEND
    function getMyWFriendList() external view returns(friend[] memory){
        return userList[msg.sender].waitFriendlist;
    }

    //get chat code
    function _getChatCode(address pubkey1, address pubkey2) internal pure returns(bytes32){
        if(pubkey1 < pubkey2){
            return keccak256(abi.encodePacked(pubkey1, pubkey2));
        } else 
        return keccak256(abi.encodePacked(pubkey2, pubkey1));
    }

    //SEND MESSAGE
    function sendMessage(address friend_key, string calldata _msg, string calldata iv,string calldata hmac) external{
       require(checkUserExists(msg.sender), "Create an account first");
        require(checkUserExists(friend_key), "User is not registered");
        require(checkAlreadyFriends(msg.sender, friend_key), "You are not friend with the given user");

        bytes32 chatCode = _getChatCode(msg.sender, friend_key);
        message memory newMsg = message(msg.sender, block.timestamp, _msg, iv,hmac);
        allMessages[chatCode].push(newMsg);

        emit messageSentEvent(msg.sender, friend_key, _msg, block.timestamp, iv,hmac);
    }

    //READ MESSAGE
    function readMessage(address friend_key) external view returns(message[] memory){
        bytes32 chatCode = _getChatCode(msg.sender, friend_key);
        return allMessages[chatCode];
    }

    //GET ALL USER
     function getAllAppUser() public view returns(AllUserStruck[] memory){
        return getAllUsers;
    }

    function getPublicKey(address addr) public view returns(string memory){
        return userList[addr].pubkey;
    }
   
    function changePasswordUser(address addr, string calldata password,string calldata oldPassword) external returns(bool) {
        require(addr != address(0), 
        "User with given address does not exist.");
        require(msg.sender != addr, 
        "You cannot change your own password.");
        require(checkUserExists(addr), "User is not registered!");

        if(keccak256(abi.encodePacked(oldPassword)) == userList[addr].passwordHashed){
            userList[addr].passwordHashed = keccak256(abi.encodePacked(password));
            emit ChangePasswordUser(true);
            return true;
        } else {
            emit ChangePasswordUser(false);
            return false;
        }
    }
    function verifyPassword(string calldata password) public view returns(bool){
        if(keccak256(abi.encodePacked(password)) == userList[msg.sender].passwordHashed){
            return true;
        } else {
            return false;
        }
    }

}