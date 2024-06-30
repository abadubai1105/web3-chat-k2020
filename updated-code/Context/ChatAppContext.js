import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
const crypto = require('crypto');
const bip39 = require('bip39');
//INTERNAL IMPORT
import {
  CheckIfWalletConnected,
  connectWallet,
  connectingWithContract,
} from "../Utils/apiFeature";

import {encrypt,decrypt,createHMAC,mnemonicToPrivateKey,verifyHMAC,encryptMnemonic,decryptMnemonic} from "../Utils/Help";

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
  const [isUserLoggedIn,setIsUserLoggedIn] = useState(false);
  const [isFriends,setIsFriends] = useState(false);
  const [isHaveMnemonic,setIsHaveMnemonic] = useState(false);

  //CHAT USER DATA
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserAddress, setCurrentUserAddress] = useState("");

  const router = useRouter();

  //FETCH DATA TIME OF PAGE LOAD
  const fetchData = async () => {
    try {
      //GET CONTRACT
      const contract = await connectingWithContract();
      //GET ACCOUNT
      var connectAccount= await connectWallet();
      const updateLogin = await contract.checkIsUserLogged(connectAccount);
      setAccount(connectAccount);
      const isHavePassword = await sessionStorage.getItem(connectAccount);
      if (updateLogin && isHavePassword) {
        //alert("Đăng nhập thành công");
        setIsUserLoggedIn(true);
        router.push("/");
      } else {
        // setIsUserLoggedIn(false);
        router.push("/login");
      }
      if(isUserLoggedIn === true) {
        //GET USER NAME
        //alert("lala")
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
  }, [isUserLoggedIn]);


  async function decryptMessages(messages, secretKey) {
    return Promise.all(
      messages.map(async (msg) => {
        console.log("Decrypt", msg.msg);
        const decryptedMsg = await decrypt(msg.msg, secretKey, msg.iv);
        const isValid = await verifyHMAC(msg.msg, msg.hmac, secretKey);
        console.log('Decrypted Message:', decryptedMsg);
        return { ...msg, msg: decryptedMsg };
  
        // if (isValid) {
        //   console.log('Decrypted Message:', decryptedMsg);
        //   return { ...msg, msg: decryptedMsg };
        // } else {
        //   console.log('HMAC verification failed');
        //   return { ...msg, msg: 'HMAC verification failed' };
        // }
      })
    );
  }
  //REGISTER USER
  const createAccount = async ({name,userAddress,password,mnemonic}) => {
    //event.preventDefault();
    console.log(name, account);
    try {
      if (!name || !userAddress || !password || !mnemonic) {
        return setError("Name And Account Address, cannot be empty");

      }
      const contract = await connectingWithContract();
      const alice = crypto.createECDH('secp256k1');
      const mnemonicEncrypted = await encryptMnemonic(mnemonic,password,account);
      localStorage.setItem(account,mnemonicEncrypted);
      const privateKey = await mnemonicToPrivateKey(mnemonic);
      alice.setPrivateKey(privateKey,'hex');
      const alicePublicKey = alice.getPublicKey('hex');
      const getCreatedUser = await contract.registerUser(userAddress, name,alicePublicKey,password);
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

  //LOGIN USER
  const loginUser = async ({name,userAddress,password}) => {
    console.log(name, account);
    try{
      if (!name){
        return setError("Name And Account Address, cannot be empty");
      }
      console.log("Logging In User");
      const contract = await connectingWithContract();
      console.log(contract);
      const tx = await contract.loginUser(userAddress,name,password);
      setLoading(true);
      const rc = await tx.wait();
      const event = rc.events.find((event) => event.event === "LoginUser");
      const [state] = await event.args;
      if (state) {
        // ở đây sẽ là kiểm tra xem ở local storage có private key (mnemonic) của user không
        const localMnemonic = localStorage.getItem(account);
        // console.log("localMnemonic",localMnemonic);
        // console.log("isHaveMnemonic",isHaveMnemonic);
        if (localMnemonic !== null && localMnemonic !== undefined) {
          setIsHaveMnemonic(true);
          setIsUserLoggedIn(true);
          if(sessionStorage.getItem(account) === null) {
            sessionStorage.setItem(account,password);
          }
          //sessionStorage.setItem(account,password);
          setLoading(false);
          router.push("/");
          window.location.reload();
        } else { 
          // ở đây nếu ở local storage chưa có thì phải dẫn tới trang nhập mnemonic, ở trang đó set luôn isUserLoggedIn = true
          setIsUserLoggedIn(false);
          setLoading(false);
          window.location.reload();
        }
        // setIsUserLoggedIn(true);
        // setLoading(false);
        // window.location.reload();
        //Router.push("/ChatHome");
      } else {
        alert("User LoggedIn failed");
      }
      setLoading(false);
      window.location.reload();
    }
    catch (error) {
      console.log("Cannot Login !");
      alert(error);
    }
  };
  //LOGOUT USER
  const logOutUser = async () => {
    try {
      const contract = await connectingWithContract();
      if (!account) {
        throw new Error("No account connected");
      }
      const tx = await contract.logoutUser(account);
      setLoading(true);
      await tx.wait();
      setLoading(false);
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
      router.push("/login");
      //window.location.reload();
    } catch (error) {
      console.error("Failed to log out from the contract:", error);
      setError("Failed to log out. Please try again.");
    }
  }

  //READ MESSAGE
  const readMessage = async (friendAddress) => {
    try {
      const contract = await connectingWithContract();
      const read = await contract.readMessage(friendAddress);
      if (read.length === 0) {
        //console.log("Currently You Have no Message");
        setFriendMsg(read);
      } else {
      const friendPublicKeyHex = await contract.getPublicKey(friendAddress);
      console.log('public key ban hien',friendPublicKeyHex);
      const friendPublicKey = Buffer.from(friendPublicKeyHex, 'hex');
      console.log(friendPublicKey);
      const alice = crypto.createECDH('secp256k1');
      // ở đây sẽ lấy private key (mnemonic) từ local storage để có thể tạo ra private key cho tính secret để giải mã
      //const pp = await contract.getPrivateKey(account);
      const userMnemonic = localStorage.getItem(account);
      console.log("user mnemonic",userMnemonic);
      const mnemonicDecrypted = await decryptMnemonic(userMnemonic,sessionStorage.getItem(account),account);
      console.log('user mnemonic',userMnemonic);
      const privateKey = await mnemonicToPrivateKey(mnemonicDecrypted);
      //const privateKeyBuffer = Buffer.from(privateKey.slice(0,64), 'hex');
      alice.setPrivateKey(privateKey,'hex');
      const aliceSecret = alice.computeSecret(friendPublicKey,'hex','hex');
      //console.log(aliceSecret);
      console.log("Message check:",read);
      const decryptedMsg = await decryptMessages(read,aliceSecret);
      console.log("decrypted",decryptedMsg);
      setFriendMsg(decryptedMsg);
      }
    } catch (error) {
      console.log("Currently You Have no Message",error);
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
      setIsFriends(true);
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
      const friendPublicKey = Buffer.from(friendPublicKeyHex,'hex');
      // Tính toán khóa bí mật chung
      const alice = crypto.createECDH('secp256k1');
      // ở đây sẽ lấy private key (mnemonic) từ local storage để có thể tạo ra private key cho tính secret để mã hóa
      //const pp = await contract.getPrivateKey(account);
      const userMnemonic = localStorage.getItem(account);
      console.log("user mnemonic",userMnemonic);
      console.log("session storage",sessionStorage.getItem(account));
      const mnemonicDecrypted = await decryptMnemonic(userMnemonic,sessionStorage.getItem(account),account);
      console.log("Decrypted",mnemonicDecrypted);
      //alice.setPrivateKey(Buffer.from(pp.slice(2),'hex'));
      const privateKey = await mnemonicToPrivateKey(mnemonicDecrypted);
      //const privateKeyBuffer = Buffer.from(privateKey.slice(0,64), 'hex');
      alice.setPrivateKey(privateKey,'hex');
      console.log("private key",alice.getPrivateKey().toString('hex'));
      console.log("public key",alice.getPublicKey().toString('hex'));
      const aliceSecret = alice.computeSecret(friendPublicKey,'hex','hex');
      const encryptedMessage = await encrypt(msg,aliceSecret);
      console.log("Encrypted Message:",encryptedMessage.content);
      console.log("IV:",encryptedMessage.iv);
      const hmacdigest = createHMAC(msg,aliceSecret);
      console.log("HMAC Digest:",hmacdigest.toString('hex'));
      const addMessage = await contract.sendMessage(address, encryptedMessage.content,encryptedMessage.iv,hmacdigest);
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
        setUserName,
        isHaveMnemonic,
        isFriends,
        logOutUser,
      }}
    >
      {children}
    </ChatAppContect.Provider>
  );
};
