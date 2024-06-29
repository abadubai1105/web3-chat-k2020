

//import Wallet from 'ethereumjs-wallet';
import crypto from 'crypto';

const bip39 = require('bip39');

exports.generateMnemonic = async () => {
    const entropy = crypto.randomBytes(16).toString('hex');

    // Tạo mnemonic phrase từ entropy
    const mnemonic = bip39.entropyToMnemonic(entropy);
    return mnemonic;
}

exports.encrypt= async (text, secret) => {
    const iv = crypto.randomBytes(16);
    alert(iv);
    const cipher = crypto.createCipheriv('aes-256-ctr', Buffer.from(secret, 'hex'), iv);
    alert(cipher);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    alert(encrypted);
    return {
        iv: iv.toString('hex'),
        content: encrypted
    };
}

exports.decrypt = async (msg,secret,iv) => {
    const decipher = crypto.createDecipheriv('aes-256-ctr', Buffer.from(secret, 'hex'), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(msg, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;

}
exports.createHMAC = async (text, secret) => {
    const hmac = crypto.createHmac('sha256', Buffer.from(secret, 'hex'));
    hmac.update(text);
    return hmac.digest('hex');
}
exports.verifyHMAC = async (message, hmacDigest, secret) => {
    const hmac = crypto.createHmac('sha256', Buffer.from(secret, 'hex'));
    hmac.update(message);
    const calculatedDigest = hmac.digest('hex');
    return calculatedDigest === hmacDigest;
}

exports.mnemonicToPrivateKey = async (mnemonic) => {
    const seed = bip39.mnemonicToSeedSync(mnemonic,"");
    const root = bip32.fromSeed(seed);
    
    const path = "m/44'/60'/0'/0/0"; // Example path for Ethereum
    const child = root.derivePath(path);
    const privateKey = child.privateKey.toString('hex');
    return privateKey;
}
exports.pdkdf2 = async (password, salt, iterations, keylen) => {
    return crypto.pbkdf2Sync(password, salt, iterations, keylen, 'sha512').toString('hex');
}
exports.nearestNumberToUppercase = async (inputString) => {
    // Tìm tất cả các chữ cái viết hoa và vị trí của chúng
    let uppercaseLetters = [];
    for (let i = 0; i < inputString.length; i++) {
        if (inputString[i] >= 'A' && inputString[i] <= 'Z') {
            uppercaseLetters.push({ letter: inputString[i], index: i });
        }
    }

    if (uppercaseLetters.length === 0) {
        return null;  // Không có chữ cái viết hoa nào
    }

    let firstUppercase = uppercaseLetters[0];

    // Tìm tất cả các số và vị trí của chúng
    let numbers = [];
    for (let i = 0; i < inputString.length; i++) {
        if (inputString[i] >= '0' && inputString[i] <= '9') {
            numbers.push({ number: inputString[i], index: i });
        }
    }

    if (numbers.length === 0) {
        return null;  // Không có số nào
    }

    // Tìm số gần nhất với chữ cái viết hoa đầu tiên
    let nearestNumber = null;
    let minDistance = Infinity;
    for (let num of numbers) {
        let distance = Math.abs(num.index - firstUppercase.index);
        if (distance < minDistance) {
            nearestNumber = num.number;
            minDistance = distance;
        }
    }

    return nearestNumber;
}

exports.getSubstrings = async (inputString,n) => {
    // Kiểm tra xem n có hợp lệ không
    if (n <= 0 || n > parentString.length) {
        return "Vị trí n không hợp lệ.";
    }
    
    // Tính số ký tự cần lấy
    let numCharacters = Math.floor((n - 1) / 2);
    
    // Lấy chuỗi con từ vị trí n và lấy numCharacters ký tự
    let substring = parentString.substr(n - 1, numCharacters);
    
    return substring;
}

exports.encryptMnemonic = async (mnemonic, password) => {
    const salt = crypto.randomBytes(32);
    const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha512');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(mnemonic, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

exports.decryptMnemonic = async (encryptedMnemonic, password) => {
   // Tách IV và dữ liệu đã mã hóa
   const parts = encryptedMnemonic.split(':');
   const iv = Buffer.from(parts.shift(), 'hex');
   const encryptedText = parts.join(':');
   
   // Tạo một khóa mã hóa từ password bằng cách sử dụng PBKDF2
   const key = crypto.pbkdf2Sync(password, 'salt', 100000, 32, 'sha256');
   
   // Tạo một decipher với thuật toán AES-256-CBC
   const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
   
   // Giải mã mnemonic phrase
   let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
   decrypted += decipher.final('utf8');
   
   return decrypted;
}

/**
 * Generates a random string by hashing the input using SHA-256 algorithm.
 *
 * @param {string} input - The input string to be hashed.
 * @return {string} The hashed string generated from the input.
 */

exports.generateRandomString = async (input) =>{
    // Use the crypto module's createHash method to create a SHA-256 hash object.
    // Update the hash object with the input string and then digest it to get the hashed string.
    // The digest method takes an optional encoding argument, which defaults to 'hex'.
    const hash = crypto.createHash('sha256')
                    .update(input)
                    .digest('hex');
    
    // Return the hashed string.
    return hash;
}

