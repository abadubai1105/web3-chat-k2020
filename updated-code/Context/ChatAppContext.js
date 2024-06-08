import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {ethers }  from "ethers";
import {
  KeyHelper,
  SignalProtocolAddress,
  SessionBuilder,
  SessionCipher,
  Storage,
} from '@privacyresearch/libsignal-protocol-typescript';
//const KeyHelper = signal.KeyHelper;
//INTERNAL IMPORT
import {
  CheckIfWalletConnected,
  connectWallet,
  connectingWithContract,
} from "../Utils/apiFeature";

import Utils from "../Utils/Help";

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
  const fetchData = async () => {
    try {
      //GET CONTRACT
      const contract = await connectingWithContract();
      //GET ACCOUNT
      var connectAccount= await connectWallet();
      setAccount(connectAccount);
      //GET USER NAME
      const userName = await contract.getUsername(connectAccount);
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
      console.log(userList);
      setUserLists(userList);
      // IS SET USER LOGGED IN
      const isUserLoggedIn = await contract.checkIsUserLogged();
    } catch (error) {
      // setError("Please Install And Connect Your Wallet");
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);



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
      const getCreatedUser = await contract.registerUser(userAddress, name);

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
      setLoading(false);
      window.location.reload();
      //Router.push("/");
    }
    catch (error) {
      console.log("Currently You Have no Message");
      alert(error);
    }
  };

  //READ MESSAGE
  const readMessage = async (friendAddress) => {
    try {
      const contract = await connectingWithContract();
      const read = await contract.readMessage(friendAddress);
      decryptedMessage = Utils.decrypt(read);
      setFriendMsg(decryptedMessage);
    } catch (error) {
      console.log("Currently You Have no Message");
    }
  };

  async function generateKeys() {
    const identityKeyPair = await KeyHelper.generateIdentityKeyPair();
    const registrationId = KeyHelper.generateRegistrationId();
    const signedPreKey = await KeyHelper.generateSignedPreKey(identityKeyPair, 1);
    const oneTimePreKeys = await KeyHelper.generatePreKeys(0, 10);

    return {
        identityKeyPair,
        registrationId,
        signedPreKey,
        oneTimePreKeys
    };
  }
  async function registerKeys(identityKeyPair, signedPreKey, signedPreKeySignature, oneTimePreKeys) {
    const identityKey = identityKeyPair.pubKey;
    const signedPreKeyPublic = signedPreKey.keyPair.pubKey;
    const oneTimePreKeysPublic = oneTimePreKeys.map(key => key.pubKey);

    const tx = await contract.registerKeys(
        identityKey,
        signedPreKeyPublic,
        signedPreKeySignature,
        oneTimePreKeysPublic
    );

    await tx.wait();
    console.log("Keys registered successfully");
  }
  async function getKeyBundle(userAddress) {
    const keyBundle = await contract.getKeyBundle(userAddress);
    console.log("Key Bundle:", keyBundle);
    return keyBundle;
  }
  async function encryptMessage(receiverAddress, plaintext) {
    // Get the receiver's key bundle from the smart contract
    const receiverKeyBundle = await getKeyBundle(receiverAddress);

    // Create a session builder
    const sessionBuilder = new signal.SessionBuilder(store, receiverAddress);

    // Process the receiver's pre-key bundle
    await sessionBuilder.processPreKey({
        identityKey: receiverKeyBundle.identityKey,
        signedPreKey: receiverKeyBundle.signedPreKey,
        signedPreKeySignature: receiverKeyBundle.signedPreKeySignature,
        preKey: receiverKeyBundle.oneTimePreKeys[0], // Using the first one-time pre-key
    });

    // Create a session cipher
    const sessionCipher = new signal.SessionCipher(store, receiverAddress);

    // Encrypt the message
    const ciphertext = await sessionCipher.encrypt(Buffer.from(plaintext, 'utf-8'));
    return ciphertext;
  }
  async function decryptMessage(senderAddress, ciphertext) {
    // Create a session cipher
    const sessionCipher = new signal.SessionCipher(store, senderAddress);

    // Decrypt the message
    const plaintext = await sessionCipher.decryptPreKeyWhisperMessage(ciphertext.body, 'binary');
    return plaintext.toString('utf-8');
  }
  // const registerKeys = async () => {
  //   try {
  //     if (!provider || !signer || !contract) {
  //       setStatus("Provider, signer, or contract not initialized");
  //       return;
  //     }

  //     // Generate keys using @privacyresearch/libsignal-protocol-typescript
  //     const identityKeyPair = await KeyHelper.generateIdentityKeyPair();
  //     const signedPreKey = await KeyHelper.generateSignedPreKey(identityKeyPair, 1);
  //     const oneTimePreKeys = await KeyHelper.generatePreKeys(0, 10);

  //     const identityKey = '0x' + Buffer.from(identityKeyPair.pubKey).toString('hex');
  //     const signedPreKeyPublic = '0x' + Buffer.from(signedPreKey.keyPair.pubKey).toString('hex');
  //     const signedPreKeySignature = '0x' + Buffer.from(signedPreKey.signature).toString('hex');
  //     const oneTimePreKeysPublic = oneTimePreKeys.map(key => '0x' + Buffer.from(key.pubKey).toString('hex'));

  //     console.log("Registering keys with the following data:", {
  //       identityKey,
  //       signedPreKeyPublic,
  //       signedPreKeySignature,
  //       oneTimePreKeysPublic
  //     });

  //     const tx = await contract.registerKeys(
  //       identityKey,
  //       signedPreKeyPublic,
  //       signedPreKeySignature,
  //       oneTimePreKeysPublic
  //     );

  //     await tx.wait();
  //     setStatus('Keys registered successfully');
  //   } catch (error) {
  //     console.error("Error registering keys:", error);
  //     setStatus('Error registering keys');
  //   }
  // };
  //CREATE ACCOUNT
  // const createAccount = async (event) => {
  //   event.preventDefault();
  //   console.log(name, account);
  //   try {
  //     if (!name || !account)
  //       return setError("Name And Account Address, cannot be empty");

  //     const contract = await connectingWithContract();
  //     console.log(contract);
  //     const getCreatedUser = await contract.createAccount(name);

  //     setLoading(true);
  //     await getCreatedUser.wait();
  //     setLoading(false);
  //     window.location.reload();
  //   } catch (error) {
  //     setError("Error while creating your account Pleas reload browser");
  //   }
  // };



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
  const sendMessage = async ({ msg, address }) => {
    try {
      if (!msg || !address) return setError("Please Type your Message");

      const contract = await connectingWithContract();
      var publicKeyBuffer = Buffer.from(publicKey, 'hex');
      var encryptedRaw = Utils.encrypt(msg,Utils.computeSecret(publicKeyBuffer));
      var encryptedMessage = '0x' + encryptedRaw.toString('hex');
      const addMessage = await contract.sendMessage(address, encryptedMessage,Utils.getEncryptAlgorithmInHex());
      setLoading(true);
      await addMessage.wait();
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setError("Please reload and try again");
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
      }}
    >
      {children}
    </ChatAppContect.Provider>
  );
};
