import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {ethers }  from "ethers";
const crypto = require('crypto');
//const KeyHelper = signal.KeyHelper;
//INTERNAL IMPORT
import {
  CheckIfWalletConnected,
  connectWallet,
  connectingWithContract,
} from "../Utils/apiFeature";

import {encrypt,decrypt,computeSecret,createHMAC} from "../Utils/Help";

export const ChatAppContect = React.createContext();

export const ChatAppProvider = ({ children }) => {
  //USESTATE
  const [account, setAccount] = useState("");
  const [userName, setUserName] = useState("");
  const [friendLists, setFriendLists] = useState([]);
  const [addFriendLists, setAddFriendLists] = useState([]);
  const [waitFriendLists, setWaitFriendLists] = useState([]);
  const [friendMsg, setFriendMsg] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLists, setUserLists] = useState([]);
  const [error, setError] = useState("");
  const [isUserLoggedIn,setIsUserLoggedIn] = useState("");

  //CHAT USER DATA
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserAddress, setCurrentUserAddress] = useState("");

  const router = useRouter();

  //FETCH DATA TIME OF PAGE LOAD
  // const fetchData = async () => {
  //   try {
  //     //GET CONTRACT
  //     const contract = await connectingWithContract();
  //     //GET ACCOUNT
  //     const connectAccount = await connectWallet();
  //     setAccount(connectAccount);
  //     //GET USER NAME
  //     const userName = await contract.getUsername(connectAccount);
  //     setUserName(userName);
  //     //GET MY FRIEND LIST
  //     const friendLists = await contract.getMyFriendList();
  //     setFriendLists(friendLists);
  //     //GET WAIT FRIEND LIST
  //     const waitFriendLists = await contract.getMyWFriendList();
  //     setWaitFriendLists(waitFriendLists);
  //     //GET ADD FRIEND LIST
  //     const addFriendLists = await contract.getMyAFriendList();
  //     setAddFriendLists(addFriendLists);
  //     //GET ALL APP USER LIST
  //     const userList = await contract.getAllAppUser();
  //     setUserLists(userList);
  //     // IS SET USER LOGGED IN
  //     const isUserLoggedIn = await contract.checkIsUserLogged();
  //   } catch (error) {
  //     // setError("Please Install And Connect Your Wallet");
  //     console.log(error);
  //   }
  // };
  // useEffect(() => {
  //   fetchData();
  // }, []);
  const fetchData = async () => {
    try {
      if(isUserLoggedIn === false){
        router.push("/login");
      }
      //GET CONTRACT
      const contract = await connectingWithContract();
      //GET ACCOUNT
      var connectAccount= await connectWallet();
      const updateLogin = await contract.checkIsUserLogged(connectAccount);
      setAccount(connectAccount);
      setIsUserLoggedIn(updateLogin);
      if (updateLogin) {
        setIsUserLoggedIn(true);
      }
      if(isUserLoggedIn === true) {
        //alert(isUserLoggedIn);
        //GET USER NAME
        const userName = await contract.getUsername(connectAccount);
        setUserName(userName);
        //alert(userName);
        //GET MY FRIEND LIST
        const friendLists = await contract.getMyFriendList();
        setFriendLists(friendLists);
        //GET WAIT FRIEND LIST
        const waitFriendLists = await contract.getMyWFriendList();
        setWaitFriendLists(waitFriendLists);
        //GET ADD FRIEND LIST
        const addFriendLists = await contract.getMyAFriendList();
        setAddFriendLists(addFriendLists);
        
        //GET ALL APP USER LIST
        const userList = await contract.getAllAppUser();
        setUserLists(userList);
        router.push("/alluser");
      } 
      // IS SET USER LOGGED IN
      //const isUserLoggedIn = await contract.checkIsUserLogged();
    } catch (error) {
      // setError("Please Install And Connect Your Wallet");
      console.log(error);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [isUserLoggedIn])
  // const checkUserLogin = async () => {
  //   try {
  //     const contract = await connectingWithContract();
  //     const isUserLoggedIn = await contract.checkIsUserLogged();
  //     setIsUserLoggedIn(isUserLoggedIn);
  //     if(isUserLoggedIn === true){
  //       fetchData();
  //     }
  //     else{
  //       router.reload();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  
  // }
  // useEffect(() => {
  //   checkUserLogin();
  // }, []);
    //REGISTER USER


  const decryptMessages = (messages,secretKey) => {
    return messages.map((msg) => {
      const decryptedMsg = decrypt(msg.msg,secretKey,msg.iv);
      //const isValid = verifyHMAC(msg.msg,msg.hmac,secretKey);
      // if (isValid) {
      //   console.log('Decrypted Message:', decryptedMessage);
      //   //setFriendMsg(decryptedMessage);
      // } else {
      //   console.log('HMAC verification failed');
      //   //return;
      // }
      return { ...msg, msg: decryptedMsg };
    });
  };
  //REGISTER USER
  const createAccount = async ({name,userAddress}) => {
    //event.preventDefault();
    console.log(name, account);
    try {
      if (!name){
        return setError("Name And Account Address, cannot be empty");
      }
      const contract = await connectingWithContract();
      console.log(contract);
      
      const alice = crypto.createECDH('secp256k1');
      alice.generateKeys();
      const alicePublicKey = '0x'+ alice.getPublicKey('hex');
      const alicePrivateKey = '0x'+ alice.getPrivateKey('hex');
      const getCreatedUser = await contract.registerUser(userAddress, name,alicePublicKey,alicePrivateKey);
      setLoading(true);
      await getCreatedUser.wait().then((res) => {
        alert("User Registered successfully")});
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setError("Error while creating your account Pleas reload browser");
      alert(error);
    }
  }


  const loginUser = async ({name,userAddress}) => {
    console.log(name, account);
    try{
      if (!name){
        return setError("Name And Account Address, cannot be empty");
      }
      console.log("Logging In User");
      const contract = await connectingWithContract();
      console.log(contract);
      const tx = await contract.loginUser(userAddress,name);
      setLoading(true);
      const rc = await tx.wait();
      const event = rc.events.find((event) => event.event === "LoginUser");
      const [isUserLoggedIn] = await event.args;
      if (isUserLoggedIn) {
        console.log("User LoggedIn successfully");
        setLoading(false);
        window.location.reload();
        //Router.push("/ChatHome");
      } else {
        alert("User LoggedIn failed");
      }
    }
      catch (error) {
        console.log("Cannot login");
        alert(error);
      }
    };
  
    // Logout user
    const logOutUser = async () => {
      try {
        // Ensure you are connected to the contract
        const contract = await connectingWithContract();
        if (!account) {
          throw new Error("No account connected");
        }
  
        // Interact with the smart contract to log out
        const tx = await contract.logoutUser(account);
        await tx.wait();
  
        // Clear local state and localStorage
        setAccount("");
        setUserName("");
        setFriendLists([]);
        setAddFriendLists([]);
        setWaitFriendLists([]);
        setFriendMsg([]);
        setUserLists([]);
        setCurrentUserName("");
        setCurrentUserAddress("");
        setIsUserLoggedIn(false);
        localStorage.removeItem("accountAddress");
  
        // Redirect to the login page
        router.push("/login");
      } catch (error) {
        console.error("Failed to log out from the contract:", error);
        setError("Failed to log out. Please try again.");
      }
    };

    //READ MESSAGE
  
    const readMessage = async (friendAddress) => {
      try {
        const contract = await connectingWithContract();
        const read = await contract.readMessage(friendAddress);

        if (read.length === 0) {
          setFriendMsg(read);
        } else {
        const friendPublicKeyHex = await contract.getPublicKey(friendAddress);
        const friendPublicKey = Buffer.from(friendPublicKeyHex.slice(2), 'hex');
        const alice = crypto.createECDH('secp256k1');
        const pp = await contract.getPrivateKey(account);
        alice.setPrivateKey(Buffer.from(pp.slice(2),'hex'));
        const aliceSecret = alice.computeSecret(friendPublicKey,'hex','hex');
        const decryptedMsg = decryptMessages(read,aliceSecret);
        setFriendMsg(decryptedMsg);
      }
    } catch (error) {
      console.log("Currently You Have no Message");
    }
  };

  //ADD YOUR FRIENDS
  const addFriends = async ({ name, userAddress }) => {
    try {
      if (!name || !userAddress) return setError("Please provide data");
      const contract = await connectingWithContract();
      const addMyFriend = await contract.addFriend(userAddress, name);
      setLoading(true);
      await addMyFriend.wait();
      setLoading(false);
      router.push("/");
      window.location.reload();
    } catch (error) {
      setError("Something went wrong while adding friends, try again");
    }
  };

  //ACPT FRIENDS
  const acptFriends = async ({ name, userAddress }) => {
    try {
      if (!name || !userAddress) return setError("Please provide data");
      const contract = await connectingWithContract();
      const addMyFriend = await contract.acptFriend(userAddress, name);
      setLoading(true);
      await addMyFriend.wait();
      setLoading(false);
      router.push("/");
      window.location.reload();
    } catch (error) {
      setError("Something went wrong while adding friends, try again");
    }
  };

  //SEND MESSAGE TO YOUR FRIEND
  const sendMessage = async ({ msg, address,publicKey}) => {
    try {
      if (!msg || !address) return setError("Please Type your Message");
      const contract = await connectingWithContract();
      const friendPublicKeyHex = await contract.getPublicKey(address);
      const friendPublicKey = Buffer.from(friendPublicKeyHex.slice(2),'hex'); // Loại bỏ '0x' prefix
      // Tính toán khóa bí mật chung
      const alice = crypto.createECDH('secp256k1');
      const pp = await contract.getPrivateKey(account);
      alice.setPrivateKey(Buffer.from(pp.slice(2),'hex'));
      const aliceSecret = alice.computeSecret(friendPublicKey,'hex','hex');
      const encryptedMessage = encrypt(msg,aliceSecret);
      //const hmacdigest = createHMAC(msg,aliceSecret)
      const addMessage = await contract.sendMessage(address, encryptedMessage.content,encryptedMessage.iv);
      setLoading(true);
      await addMessage.wait();
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setError("Please reload and try again");
      alert(error)
    }
  };

  //READ INFO
  const readUser = async (userAddress) => {
    const contract = await connectingWithContract();
    const userName = await contract.getUsername(userAddress);
    setCurrentUserName(userName);
    setCurrentUserAddress(userAddress);
  };

  
  return (
    <ChatAppContect.Provider
      value={{
        readMessage,
        createAccount,
        addFriends,
        acptFriends,
        sendMessage,
        readUser,
        connectWallet,
        CheckIfWalletConnected,
        connectingWithContract,
        setIsUserLoggedIn,
        loginUser,
        logOutUser,
        setUserName,
        isUserLoggedIn,
        account,
        userName,
        friendLists,
        addFriendLists,
        waitFriendLists,
        friendMsg,
        userLists,
        loading,
        error,
        currentUserName,
        currentUserAddress,
        
      }}
    >
      {children}
    </ChatAppContect.Provider>
  );
};
