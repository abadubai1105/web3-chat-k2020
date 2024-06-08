

// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract ChatApp{

    // constructor() public 
    // {
    //     CAcounter=0;
    //     DHPcounter=0; 
    // }
    event LoginUser(bool isUserLoggedIn);
    event RegisterUser(address addr, string name,bool isUserLoggedIn);
    event LogoutUser(bool isUserLoggedIn);
    event KeyRegistered(address indexed user);
    event KeyUpdated(address indexed user);
<<<<<<< HEAD
    event messageSentEvent(address indexed sender, address indexed receiver, bytes message, uint256 timestamp, bytes32 encryption);

    // uint CAcounter = 0; 
    // uint DHPcounter = 0; 

    

    // struct cipherAssociation 
    // {
    //     uint identifier; 
    //     address issuer;
    //     string cipher; 
    //     address[] accessPool;
    // }
    // struct diffieHellmanPool 
    // {
    //     uint identifier;
    //     uint exchangeCounter; 
    //     address issuer;
    //     uint prime;
    //     uint generator;
    //     uint exhanges; 
    //     address[] accessPool;
    // }
    // struct publicKeyPool 
    // {
    //     uint identifier;
    //     uint publicKey; 
    //     address[] accessPool;
    // }
    // cipherAssociation[] private CA;
    // diffieHellmanPool[] private DHP;

    // mapping(address=> publicKeyPool[]) private PKP;
    // mapping(address=> uint) private PKI;


    // function storeCipher(string memory cipher, address[] memory parties) public
    // returns(uint) 
    // {
    //     cipherAssociation memory c=cipherAssociation(CAcounter, msg.sender, cipher, parties);
    //     CA.push(c); 
    //     CA[CAcounter].accessPool.push(msg.sender); 
    //     uint id=CAcounter;
    //     CAcounter++;
    //     return id;
    // }
    // function addAccessorCipher(uint identifier, address[] memory parties) public returns(bool)
    // {
    //     cipherAssociation storage c=CA[identifier]; 
    //     bool flag=false;
    //     if(c.issuer==msg.sender)
    //         {
    //         flag==true;
    //         for(uint i=0;i<parties.length;i++) 
    //             {
    //             c.accessPool.push(parties[i]); 
    //             }
    //         }
    //     return flag;
    // }
    // function retrieveCipher(uint identifier) public view returns(string memory) 
    // {
    //     cipherAssociation memory c=CA[identifier]; 
    //     for(uint i=0;i<c.accessPool.length;i++)
    //     {
    //         if(c.accessPool[i]==msg.sender) 
    //         {
    //         return c.cipher; 
    //         }
    //     }
    //     return "0"; 
    // }
    // function createNewDHExchange(uint prime, uint generator, uint exchange, address[] memory parties) public returns(uint)
    // {
    //     diffieHellmanPool memory d=diffieHellmanPool(DHPcounter, 0, msg.sender,prime, generator, exchange, parties); 
    //     DHP .push(d);
    //     DHP[DHPcounter].accessPool.push(msg.sender); uint id=DHPcounter;
    //     DHPcounter++;
    //     return id;
    // }
    // function addDHEexchange(uint identifier, uint exchange) public returns(bool) 
    // {
    //     bool flag=false;
    //     for(uint i=0;i<DHP[identifier].accessPool.length;i++) 
    //     {
    //         if(DHP[identifier].accessPool[i]==msg.sender) 
    //         {
    //             DHP[identifier].exhanges = exchange;
    //             flag=true; 
    //         }
    //     }
    //     return flag; 
    // }
    // function addAccessorDH(uint identifier, address[] memory parties) public returns(bool) 
    // {
    //     bool flag = false;
    //     if(DHP[identifier].issuer == msg.sender) 
    //         {
    //         for(uint i=0;i<parties.length;i++) 
    //         { 
    //             DHP[identifier].accessPool.push(parties[i]);
    //         }
    //         flag = true; 
    //     }
    //     return flag; 
    // }
    // function getDHExchange(uint identifier) public view returns(uint) 
    // {
    //     for(uint i=0;i<DHP[identifier].accessPool.length;i++) 
    //         {
    //             if(DHP[identifier].accessPool[i]==msg.sender) 
    //             {
    //                 return DHP[identifier].exhanges; 
    //             }
    //         }   
    //     return 0; 
    // }
    // function createNewKeyPool(uint pubK, address[] memory parties) public returns(uint)
    // {
    //     uint identifier=PKI[msg.sender];
    //     PKI[msg.sender]=identifier+1;
    //     publicKeyPool memory p=publicKeyPool(identifier, pubK, parties); publicKeyPool[] storage keyPool=PKP[msg.sender]; 
    //     keyPool.push(p);
    //     keyPool[identifier].accessPool.push(msg.sender); 
    //     PKP[msg.sender]=keyPool;
    //     return identifier;
    // }
    // function getPubKfromKeyPool(address party, uint identifier) public view returns(uint)
    // {
    //     if(PKI[party]>=identifier) 
    //     {   
    //         return 0; 
    //     }
    //     for(uint i=0;i<PKP[party][identifier].accessPool.length;i++) 
    //         {
    //             if(PKP[party][identifier].accessPool[i]==msg.sender) 
    //                 {
    //                     return PKP[party][identifier].publicKey;
    //                 } 
    //         }
    //         return 0; 
    // }
    //USER STRUCT
    struct user{
        bytes32 publicKeyLeft;
        bytes32 publicKeyRight;
=======

    uint CAcounter = 0; 
    uint DHPcounter = 0; 

    

    struct cipherAssociation 
    {
        uint identifier; 
        address issuer;
        string cipher; 
        address[] accessPool;
    }
    struct diffieHellmanPool 
    {
        uint identifier;
        uint exchangeCounter; 
        address issuer;
        uint prime;
        uint generator;
        uint exhanges; 
        address[] accessPool;
    }
    struct publicKeyPool 
    {
        uint identifier;
        uint publicKey; 
        address[] accessPool;
    }
    cipherAssociation[] private CA;
    diffieHellmanPool[] private DHP;

    mapping(address=> publicKeyPool[]) private PKP;
    mapping(address=> uint) private PKI;


    function storeCipher(string memory cipher, address[] memory parties) public
    returns(uint) 
    {
        cipherAssociation memory c=cipherAssociation(CAcounter, msg.sender, cipher, parties);
        CA.push(c); 
        CA[CAcounter].accessPool.push(msg.sender); 
        uint id=CAcounter;
        CAcounter++;
        return id;
    }
    function addAccessorCipher(uint identifier, address[] memory parties) public returns(bool)
    {
        cipherAssociation storage c=CA[identifier]; 
        bool flag=false;
        if(c.issuer==msg.sender)
            {
            flag==true;
            for(uint i=0;i<parties.length;i++) 
                {
                c.accessPool.push(parties[i]); 
                }
            }
        return flag;
    }
    function retrieveCipher(uint identifier) public view returns(string memory) 
    {
        cipherAssociation memory c=CA[identifier]; 
        for(uint i=0;i<c.accessPool.length;i++)
        {
            if(c.accessPool[i]==msg.sender) 
            {
            return c.cipher; 
            }
        }
        return "0"; 
    }
    function createNewDHExchange(uint prime, uint generator, uint exchange, address[] memory parties) public returns(uint)
    {
        diffieHellmanPool memory d=diffieHellmanPool(DHPcounter, 0, msg.sender,prime, generator, exchange, parties); 
        DHP .push(d);
        DHP[DHPcounter].accessPool.push(msg.sender); uint id=DHPcounter;
        DHPcounter++;
        return id;
    }
    function addDHEexchange(uint identifier, uint exchange) public returns(bool) 
    {
        bool flag=false;
        for(uint i=0;i<DHP[identifier].accessPool.length;i++) 
        {
            if(DHP[identifier].accessPool[i]==msg.sender) 
            {
                DHP[identifier].exhanges = exchange;
                flag=true; 
            }
        }
        return flag; 
    }
    function addAccessorDH(uint identifier, address[] memory parties) public returns(bool) 
    {
        bool flag = false;
        if(DHP[identifier].issuer == msg.sender) 
            {
            for(uint i=0;i<parties.length;i++) 
            { 
                DHP[identifier].accessPool.push(parties[i]);
            }
            flag = true; 
        }
        return flag; 
    }
    function getDHExchange(uint identifier) public view returns(uint) 
    {
        for(uint i=0;i<DHP[identifier].accessPool.length;i++) 
            {
                if(DHP[identifier].accessPool[i]==msg.sender) 
                {
                    return DHP[identifier].exhanges; 
                }
            }   
        return 0; 
    }
    function createNewKeyPool(uint pubK, address[] memory parties) public returns(uint)
    {
        uint identifier=PKI[msg.sender];
        PKI[msg.sender]=identifier+1;
        publicKeyPool memory p=publicKeyPool(identifier, pubK, parties); publicKeyPool[] storage keyPool=PKP[msg.sender]; 
        keyPool.push(p);
        keyPool[identifier].accessPool.push(msg.sender); 
        PKP[msg.sender]=keyPool;
        return identifier;
    }
    function getPubKfromKeyPool(address party, uint identifier) public view returns(uint)
    {
        if(PKI[party]>=identifier) 
        {   
            return 0; 
        }
        for(uint i=0;i<PKP[party][identifier].accessPool.length;i++) 
            {
                if(PKP[party][identifier].accessPool[i]==msg.sender) 
                    {
                        return PKP[party][identifier].publicKey;
                    } 
            }
            return 0; 
    }
    //USER STRUCT
    struct user{
>>>>>>> 33909c455eab14c833485d8ce3a3c1288b322441
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
        bytes msg;
    }

    struct AllUserStruck{
        string name;
        address accountAddress;
    }

    struct PreKeyBundle{
       bytes32 identityKey; //Hash of the identity key
       bytes32 signedPreKey; //Hash of the signed pre key
       bytes32[] oneTimePreKeys; //Hash of the one time pre key
       bytes32 signedPreKeySignature; //Hash of the pre key signature
    }
    AllUserStruck[] getAllUsers;

    mapping(address => user) public userList;
    mapping(bytes32 => message[]) allMessages;
    mapping(address => PreKeyBundle) public preKeyBundles;

    address [] public addresses;

    //CHECK USER EXIST
    function checkUserExists(address pubkey) public view returns(bool){
        return bytes(userList[pubkey].name).length > 0;
    }
     function createAccount(string calldata name) external {
        require(checkUserExists(msg.sender) == false, "User already exists");
        require(bytes(name).length>0, "Username cannot be empty");

        userList[msg.sender].name = name;

        getAllUsers.push(AllUserStruck(name, msg.sender));
    }

    function loginUser(address _address, string memory _name) external returns(bool){
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
    function registerUser(address _address, string memory _name) external returns(bool){
        require(bytes(_name).length > 0, "Username cannot be empty");
        require(checkUserExists(_address) == false, "User already exists");
        
        userList[_address].name = _name;
        userList[_address].addr = _address;
        userList[_address].isUserLoggedIn = false;
        
        emit RegisterUser(_address, _name, false);
        
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
    function sendMessage(address friend_key, bytes calldata _msg,bytes32 encryption) external{
        require(checkUserExists(msg.sender), "Create an account first");
        require(checkUserExists(friend_key), "User is not registered");
        require(checkAlreadyFriends(msg.sender, friend_key), "You are not friend with the given user");

        bytes32 chatCode = _getChatCode(msg.sender, friend_key);
        message memory newMsg = message(msg.sender, block.timestamp, _msg);
        allMessages[chatCode].push(newMsg);

        emit messageSentEvent(msg.sender, friend_key, _msg, block.timestamp, encryption);
    }

    //READ MESSAGE
    function readMessage(address friend_key) external view returns(message[] memory){
        bytes32 chatCode = _getChatCode(msg.sender, friend_key);
        return allMessages[chatCode];
    }

    // function getAllUser() external view returns (AllUserStruck[] memory) {
    //     uint256 length = getAllUsers.length;
    //     AllUserStruck[] memory allUsersData = new AllUserStruck[](length);
    //     for (uint256 i = 0; i < length; i++) {
    //         AllUserStruck memory user = getAllUsers[i];
    //         allUsersData[i] = AllUserStruck(user.name, user.accountAddress);
    //     }

    //     return allUsersData;
    // }

<<<<<<< HEAD
    // function registerKeys(
    //     bytes32 _identityKey,
    //     bytes32 _signedPreKey,
    //     bytes32 _signedPreKeySignature,
    //     bytes32[] memory _oneTimePreKeys
    // ) public {
    //     PreKeyBundle storage bundle = preKeyBundles[msg.sender];
    //     bundle.identityKey = _identityKey;
    //     bundle.signedPreKey = _signedPreKey;
    //     bundle.signedPreKeySignature = _signedPreKeySignature;
    //     bundle.oneTimePreKeys = _oneTimePreKeys;

    //     emit KeyRegistered(msg.sender);
    // }
    // // Retrieve a user's key bundle
    // function getKeyBundle(address addr) public view returns (PreKeyBundle memory) {
    //     return preKeyBundles[addr];
    // }

    // // Function to update one-time pre-keys
    // function updateOneTimePreKeys(bytes32[] memory _oneTimePreKeys) public {
    //     require(preKeyBundles[msg.sender].identityKey != 0, "User not registered");

    //     preKeyBundles[msg.sender].oneTimePreKeys = _oneTimePreKeys;

    //     emit KeyUpdated(msg.sender);
    // }
=======
    function registerKeys(
        bytes32 _identityKey,
        bytes32 _signedPreKey,
        bytes32 _signedPreKeySignature,
        bytes32[] memory _oneTimePreKeys
    ) public {
        PreKeyBundle storage bundle = preKeyBundles[msg.sender];
        bundle.identityKey = _identityKey;
        bundle.signedPreKey = _signedPreKey;
        bundle.signedPreKeySignature = _signedPreKeySignature;
        bundle.oneTimePreKeys = _oneTimePreKeys;

        emit KeyRegistered(msg.sender);
    }
    // Retrieve a user's key bundle
    function getKeyBundle(address addr) public view returns (PreKeyBundle memory) {
        return preKeyBundles[addr];
    }

    // Function to update one-time pre-keys
    function updateOneTimePreKeys(bytes32[] memory _oneTimePreKeys) public {
        require(preKeyBundles[msg.sender].identityKey != 0, "User not registered");

        preKeyBundles[msg.sender].oneTimePreKeys = _oneTimePreKeys;

        emit KeyUpdated(msg.sender);
    }
>>>>>>> 33909c455eab14c833485d8ce3a3c1288b322441

     function getAllAppUser() public view returns(AllUserStruck[] memory){
        return getAllUsers;
    }

}