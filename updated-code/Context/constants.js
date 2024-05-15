//POLYGON DEPLOY ADDRESS= 0xA68BDd8c7b77f53B0653AAc61C719f6397C8FA61

import chatApp from "../artifacts/contracts/ChatApp.sol/ChatApp.json";



// export const ChatAppAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
import fs from 'fs/promises'; // Import mô-đun fs với promises

// Hàm để đọc nội dung của tệp và gán giá trị cho ChatAppAddress
function readContractAddress() {
  try {
    const content = afs.readFile("contract-address.txt", "utf8");
    return content;
  } catch (error) {
    console.error('Error reading file:', error);
    return null;
  }
}

// Gọi hàm readContractAddress và export ChatAppAddress
export const ChatAppAddress = readContractAddress()

export const ChatAppABI = chatApp.abi;
