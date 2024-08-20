import React, { createContext,useState, useEffect } from "react";
import { useRouter } from "next/router";
const crypto = require('crypto');
const bip39 = require('bip39');
//INTERNAL IMPORT
import {
  CheckIfWalletConnected,
  connectWallet,
  connectingWithContract,
} from "../Utils/apiFeature";

import {encrypt,decrypt,createHMAC,mnemonicToPrivateKey,verifyHMAC,encryptMnemonic,decryptMnemonic,scrambleString,unscrambleString} from "../Utils/Help";


export const ChatAppContect = createContext();

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
  const [scrambledData,setScrambledData] = useState("");

  //CHAT USER DATA
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserAddress, setCurrentUserAddress] = useState("");

  const router = useRouter();


  
  //FETCH DATA TIME OF PAGE LOAD
  const fetchData = async () => {
    try {
        if(account !== "" && account !== undefined) {
          const contract = await connectingWithContract();
          const updateLogin = await contract.checkIsUserLogged(account);
          const isHavePassword = await sessionStorage.getItem(account);
          if (updateLogin && isHavePassword) {
            //alert("Đăng nhập thành công");
            if(isUserLoggedIn === true) {
              //GET USER NAME
              const userName = await contract.getUsername(account);
              setUserName(userName);
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
              const scrambled = await sessionStorage.getItem(account);
              setScrambledData(scrambled);
            } else {
              setIsUserLoggedIn(true);
              router.push("/");
            }
          } else if (!updateLogin || !isHavePassword) {
            // setIsUserLoggedIn(false);
            router.push("/login");
          }
          // IS SET USER LOGGED IN
          //const isUserLoggedIn = await contract.checkIsUserLogged();
        }
        else{
          router.push("/login");
        }
    } catch (error) {
      if(error === 4001){
        setError("Connection Refused",error);
      }
      setError("Something went wrong1",error);
      alert(error);
    }
  };
  
  const sureWalletConnected = async () => {
    const connectAccount = await connectWallet();
    setAccount(connectAccount);
  };
  useEffect(() => {
    if(account === "" || account === undefined) {
      sureWalletConnected();
      router.push("/");
      return;
    }
    else {
      fetchData();
    }
  }, [isUserLoggedIn,account,friendMsg]);


  async function decryptMessages(messages, secretKey) {
    return Promise.all(
      messages.map(async (msg) => {
        const decryptedMsg = await decrypt(msg.msg, secretKey, msg.iv);
        const isValid = await verifyHMAC(msg.msg, msg.hmac, secretKey);
        if (!isValid) {
          return { ...msg, msg: decryptedMsg };
        } else {
          return { ...msg, msg: 'HMAC verification failed' };
        }
      })
    );
  }
  //REGISTER USER
  const createAccount = async ({name,userAddress,password,mnemonic}) => {
    //event.preventDefault();
    try {
      if (!name || !userAddress || !password || !mnemonic) {
        return setError("Name And Account Address, cannot be empty");

      }
      const contract = await connectingWithContract();
      const alice = crypto.createECDH('secp256k1');
      const mnemonicEncrypted = await encryptMnemonic(mnemonic,password,account);
      const privateKey = await mnemonicToPrivateKey(mnemonic);
      alice.setPrivateKey(privateKey,'hex');
      const alicePublicKey = alice.getPublicKey('hex');
      const getCreatedUser = await contract.registerUser(userAddress, name,alicePublicKey,password);
      setLoading(true); 
      await getCreatedUser.wait().then((res) => {
        alert("User Registered successfully")}
      );
      localStorage.setItem(account,mnemonicEncrypted);
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setError("Error while creating your account Pleas reload browser");
      alert(error);
    }
  }

  //LOGIN USER
  const loginUser = async ({name,userAddress,password}) => {
    try{
      if (!name){
        return setError("Name And Account Address, cannot be empty");
      }
      const contract = await connectingWithContract();
      const tx = await contract.loginUser(userAddress,name,password);
      setLoading(true);
      const rc = await tx.wait();
      const event = rc.events.find((event) => event.event === "LoginUser");
      const [state] = await event.args;
      if (state) {
        // ở đây sẽ là kiểm tra xem ở local storage có private key (mnemonic) của user không
        const localMnemonic = localStorage.getItem(account);
        if (localMnemonic !== null && localMnemonic !== undefined) {
          setIsHaveMnemonic(true);
          setIsUserLoggedIn(true);
          if(sessionStorage.getItem(account) === null) {
            const scrambled = await scrambleString(password);
            sessionStorage.setItem(account,scrambled);
          }
          setLoading(false);

          router.push("/alluser");
          window.location.reload();
        } else { 
          // ở đây nếu ở local storage chưa có thì phải dẫn tới trang nhập mnemonic, ở trang đó set luôn isUserLoggedIn = true
          setIsUserLoggedIn(false);
          setLoading(false);
          window.location.reload();
        }
      } else {
        alert("User LoggedIn failed");
        window.location.reload();
      }
      setLoading(false);
      window.location.reload();
    }
    catch (error) {
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
      sessionStorage.removeItem(account);
      router.push("/login");
    } catch (error) {
      setError("Failed to log out. Please try again.");
    }
  }

  //READ MESSAGE
  const readMessage = async (friendAddress) => {
    try {
      const contract = await connectingWithContract();
      const read = await contract.readMessage(friendAddress);
      if (read.length === 0) {
        setFriendMsg(read);
      } else {
      const friendPublicKeyHex = await contract.getPublicKey(friendAddress);
      const friendPublicKey = Buffer.from(friendPublicKeyHex, 'hex');
      const alice = crypto.createECDH('secp256k1');
      // ở đây sẽ lấy private key (mnemonic) từ local storage để có thể tạo ra private key cho tính secret để giải mã
      const userMnemonic = localStorage.getItem(account);
      const unscramble = await unscrambleString(scrambledData);
      const mnemonicDecrypted = await decryptMnemonic(userMnemonic,unscramble,account);
      const privateKey = await mnemonicToPrivateKey(mnemonicDecrypted);
      alice.setPrivateKey(privateKey,'hex');
      const aliceSecret = alice.computeSecret(friendPublicKey,'hex','hex');
      const decryptedMsg = await decryptMessages(read,aliceSecret);
      setFriendMsg(decryptedMsg);
      }
    } catch (error) {
      setError("Something went wrong",error);
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
    } catch (error) {
      setError("Something went wrong while adding friends, try again");
    }
  };

  //SEND MESSAGE TO YOUR FRIEND
  const sendMessage = async ({ msg, address,name}) => {
    try {
      if (!msg || !address) return setError("Please Type your Message");
      const contract = await connectingWithContract();
      const friendPublicKeyHex = await contract.getPublicKey(address);
      const friendPublicKey = Buffer.from(friendPublicKeyHex,'hex');
      // Tính toán khóa bí mật chung
      const alice = crypto.createECDH('secp256k1');
      // ở đây sẽ lấy private key (mnemonic) từ local storage để có thể tạo ra private key cho tính secret để mã hóa
      const userMnemonic = localStorage.getItem(account);
      const unscramble = await unscrambleString(scrambledData);
      const mnemonicDecrypted = await decryptMnemonic(userMnemonic,unscramble,account);
      const privateKey = await mnemonicToPrivateKey(mnemonicDecrypted);
      alice.setPrivateKey(privateKey,'hex');
      const aliceSecret = alice.computeSecret(friendPublicKey,'hex','hex');
      const encryptedMessage = await encrypt(msg,aliceSecret);
      const hmacdigest = await createHMAC(msg,aliceSecret);
      const addMessage = await contract.sendMessage(address, encryptedMessage.content,encryptedMessage.iv,hmacdigest);
      setLoading(true);
      await addMessage.wait();
      setLoading(false);
      router.push(
        {
        pathname: "/",
        query: { name: `${name}`, address: `${address}` }
      }
    );
    } catch (error) {
      setError("Please reload and try again");
      //alert(error)
    }
  };

  //READ INFO
  const readUser = async (userAddress) => {
    const contract = await connectingWithContract();
    const userName = await contract.getUsername(userAddress);
    setCurrentUserName(userName);
    setCurrentUserAddress(userAddress);
  };

  const changePassword = async ({userAddress, cpassword, oldPassword }) => {
    try {
      const contract = await connectingWithContract();
      const isCorrectPassword = await contract.verifyPassword(oldPassword);
      if(isCorrectPassword){
        if(isUserLoggedIn && userAddress.toLowerCase() === account)
        {
          // Đổi sessionPassword, đổi mnem encrypted, đổi password trên smart contract 
          const change = await contract.changePasswordUser(account,cpassword,oldPassword);
          setLoading(true);
          const rc = await change.wait();
          const event = rc.events.find((event) => event.event === "ChangePasswordUser");
          const [state] = await event.args;
          if (state) {
            setLoading(false); 
            const userMnemonic = localStorage.getItem(account);
            const unscramble = await unscrambleString(scrambledData);
            const mnemonicDecrypted = await decryptMnemonic(userMnemonic,unscramble,account);
            sessionStorage.removeItem(account);
            const scrambled = await scrambleString(cpassword);
            sessionStorage.setItem(account,scrambled);
            setScrambledData(scrambled);
            const newMnemonicEncrypted = await encryptMnemonic(mnemonicDecrypted,cpassword,account);
            localStorage.removeItem(account);
            localStorage.setItem(account,newMnemonicEncrypted);
            router.push("/");
            window.location.reload();
          }
          else{
            setLoading(false);
            alert("Old password is not correct");
            window.location.reload();
          }
        }
        else if (!isUserLoggedIn && userAddress.toLowerCase() === account){
          const userMnemonic = localStorage.getItem(account);
          if(userMnemonic && userMnemonic !== undefined){
            // Đổi mnem encrypted, đổi password trên smart contract
            const change = await contract.changePasswordUser(account,cpassword,oldPassword);
            setLoading(true);
            const rc = await change.wait();
            const event = rc.events.find((event) => event.event === "ChangePasswordUser");
            const [state] = await event.args;
            if (state) {
              setLoading(false); 
              const mnemonicDecrypted = await decryptMnemonic(userMnemonic,oldPassword,account);
              const newMnemonicEncrypted = await encryptMnemonic(mnemonicDecrypted,cpassword,account);
              localStorage.removeItem(account);
              localStorage.setItem(account,newMnemonicEncrypted);
              alert("Password changed successfully");
              router.push("/");
              window.location.reload();
            }
            else{
              setLoading(false);
              alert("Old password is not correct");
              window.location.reload();
            }
          }
          else{
            const change = await contract.changePasswordUser(userAddress,cpassword,oldPassword);
            setLoading(true);
            const rc = await change.wait();
            const event = rc.events.find((event) => event.event === "ChangePasswordUser");
            const [state] = await event.args;
            if (state) {
              setLoading(false); 
              alert("Password changed successfully");
              router.push("/");
              //window.location.reload();
            }
            else{
              setLoading(false);
              alert("Old password is not correct");
              window.location.reload();
            }
          }
        }
      }
      else {
        alert("Old password is not correct");
        router.push("/");
        window.location.reload();
      }
    } catch (error) {
      setError("Something went wrong while changing password, try again");
    }

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
        setAccount,
        fetchData,
        changePassword,
        
      }}
    >
      {children}
    </ChatAppContect.Provider>
  );
};
