

// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract ChatApp{

    event LoginUser(bool isUserLoggedIn);
    event CreateAccount(address addr, string name,bool isUserLoggedIn);
    event LogoutUser(bool isUserLoggedIn);
    //USER STRUCT
    struct user{
        address addr;
        string name;
        friend[] friendList;
        friend[] addFriendlist;
        friend[] waitFriendlist;
        bool isUserLoggedIn;
    }

    struct friend{
        address pubkey;
        string name;
    }

    struct message{
        address sender;
        uint256 timestamp;
        string msg;
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

    function loginUser(address _address, string memory _name) public returns(bool){
        require(checkUserExists(_address), "User is not registered");
        if(keccak256(abi.encodePacked(userList[_address].name)) ==
            keccak256(abi.encodePacked(_name)) && userList[_address].addr == _address){
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
    function createAccount(address _address, string memory _name) public returns(bool){
        require(userList[_address].addr != msg.sender,  "User already exists!"); 
        require(bytes(_name).length>0, "Username cannot be empty");

        userList[_address].name = _name;
        userList[_address].addr = _address;
        userList[_address].isUserLoggedIn = false;
        emit CreateAccount(_address, _name, false);
        //getAllUsers.push(AllUserStruck(_name, _address));
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

    //ACPT FRIEND REQUEST
    function acptFriend(address friend_key, string calldata name) external{
        require(checkUserExists(msg.sender), "Create an account first");
        require(checkUserExists(friend_key), "User is not registered!");
        require(msg.sender != friend_key, "Users cannot add themeselves as friends");
        require(checkAlreadyFriends(msg.sender, friend_key)== false, "These users are already friends");

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
    function sendMessage(address friend_key, string calldata _msg) external{
        require(checkUserExists(msg.sender), "Create an account first");
        require(checkUserExists(friend_key), "User is not registered");
        require(checkAlreadyFriends(msg.sender, friend_key), "You are not friend with the given user");

        bytes32 chatCode = _getChatCode(msg.sender, friend_key);
        message memory newMsg = message(msg.sender, block.timestamp, _msg);
        allMessages[chatCode].push(newMsg);
    }

    //READ MESSAGE
    function readMessage(address friend_key) external view returns(message[] memory){
        bytes32 chatCode = _getChatCode(msg.sender, friend_key);
        return allMessages[chatCode];
    }

    function getAllAppUser() public returns(address[] memory,string[] memory){
        address [] memory mAddresses = new address [](addresses.length);
        string [] memory Name = new string [](addresses.length);

        for(uint i = 0; i < addresses.length; i++){
             mAddresses[i] = addresses[i];
            Name[i] = userList[addresses[i]].name;
        }
        return(mAddresses,Name);
    }
    
}