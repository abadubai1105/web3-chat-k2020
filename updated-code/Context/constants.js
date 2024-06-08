//POLYGON DEPLOY ADDRESS= 0xA68BDd8c7b77f53B0653AAc61C719f6397C8FA61

import chatApp from "../artifacts/contracts/ChatApp.sol/ChatApp.json";
<<<<<<< HEAD

// export const ChatAppAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const ChatAppAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
=======



// export const ChatAppAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
var fs = require("fs"); // Import mô-đun fs với promises
>>>>>>> 33909c455eab14c833485d8ce3a3c1288b322441

let fileContent;



//Hàm để đọc nội dung của tệp và gán giá trị cho ChatAppAddress
function readContractAddress() {
  try {
    const content = fs.readFile("../updated-code/contract-address.txt",(error,data) => {});
    return content.toString();
  } catch (error) {
    console.error('Error reading file:', error);
    return null;
  }
}
fileContent = readContractAddress();
console.log(fileContent);
// Gọi hàm readContractAddress và export ChatAppAddress
export const ChatAppAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const ChatAppABI = chatApp.abi;
