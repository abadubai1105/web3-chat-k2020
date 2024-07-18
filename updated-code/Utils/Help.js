

import crypto from 'crypto';
const bip39 = require('bip39');
const HDKey = require('hdkey');
const { ec } = require('elliptic');
const EC = new ec('secp256k1');

exports.generateMnemonic = async () => {
    const entropy = crypto.randomBytes(16).toString('hex');
    const mnemonic = bip39.entropyToMnemonic(entropy);
    return mnemonic;
}

exports.encrypt= async(text, secret) => {
    const key = crypto.createHash('sha256').update((secret)).digest();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-ctr', key,iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
        iv: iv.toString('hex'),
        content: encrypted
    };
}

exports.decrypt = async (msg,secret,iv) => {
    const key = crypto.createHash('sha256').update(secret).digest();
    const decipher = crypto.createDecipheriv('aes-256-ctr', key, Buffer.from(iv, 'hex'));
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
    const seed = bip39.mnemonicToSeed(mnemonic);
    const root = HDKey.fromMasterSeed(seed);
    
    const child = root.derive("m/44'/60'/0'/0/0");
    if (child.privateKey) {
        const privateKey = child.privateKey.toString('hex');
        return privateKey;
    }
}
//Chưa sài
exports.pdkdf2 = async (password, salt, iterations, keylen) => {
    return crypto.pbkdf2Sync(password, salt, iterations, keylen, 'sha512').toString('hex');
}




exports.encryptMnemonic = async (mnemonic, password,salt) => {
    //const salt = crypto.randomBytes(32);
    const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(mnemonic, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

exports.decryptMnemonic = async (encryptedMnemonic, password,salt) => {
   // Tách IV và dữ liệu đã mã hóa
   const parts = encryptedMnemonic.split(':');
   const iv = Buffer.from(parts.shift(), 'hex');
   const encryptedText = parts.join(':');
   
   // Tạo một khóa mã hóa từ password bằng cách sử dụng PBKDF2
   const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
   
   // Tạo một decipher với thuật toán AES-256-CBC
   const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
   
   // Giải mã mnemonic phrase
   let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
   decrypted += decipher.final('utf8');
   
   return decrypted;
}

const generateKey = async(length) => {
    try {
        const buffer = crypto.randomBytes(length);
        return buffer;
    } catch (err) {
        throw err;
    }
};

// XOR two buffers
const xorBuffers = async (buf1, buf2) => {
    const result = Buffer.alloc(buf1.length);
    for (let i = 0; i < buf1.length; i++) {
        result[i] = buf1[i] ^ buf2[i % buf2.length];
    }
    return result;
};

// Scramble the input string
exports.scrambleString = async (input) => {
    const inputBuffer = Buffer.from(input, 'utf8');
    const key = await generateKey(inputBuffer.length);
    const scrambledBuffer = await xorBuffers(inputBuffer, key);
    
    // Combine key and scrambled data
    const result = Buffer.concat([key, scrambledBuffer]);
    
    return result.toString('base64');
};

// Unscramble the scrambled string to get back the original input string
exports.unscrambleString = async (scrambled) => {
    const buffer = Buffer.from(scrambled, 'base64');
    const keyLength = buffer.length / 2;
    const key = buffer.slice(0, keyLength);
    const scrambledData = buffer.slice(keyLength);
    
    const unscrambledBuffer = await xorBuffers(scrambledData, key);
    return unscrambledBuffer.toString('utf8');
};

