

// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract ChatApp{

   
    event LoginUser(bool isUserLoggedIn);
    event RegisterUser(address addr, string name,bool isUserLoggedIn, string pubkey, string pwdHashed);
    event LogoutUser(bool isUserLoggedIn);
    event KeyRegistered(address indexed user);
    event KeyUpdated(address indexed user);
    event messageSentEvent(address indexed sender, address indexed receiver, string message, uint256 timestamp, string iv,string hmac);


   
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

    
    AllUserStruck[] getAllUsers;

    mapping(address => user) public userList;
    mapping(bytes32 => message[]) allMessages;

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
    // function getPrivateKey(address addr) public view returns(string memory){
    //     return userList[addr].privkey;
    // }

}