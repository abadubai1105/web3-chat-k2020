

//import Wallet from 'ethereumjs-wallet';
import crypto from 'crypto';
var algorithm = 'aes-256-ctr';

module.exports.getEncryptAlgorithm = () => {
    return algorithm;

}

module.exports.hexStringToAscii = (hexString) => {
    if(hexString.startsWith('0x')) {
        hexString = hexString.substr(2);
    }
    return Buffer.from(hexString, 'hex').toString('ascii').replace(/\0/g, '');
}

module.exports.getEncryptAlgorithmInHex = () => {
    return '0x' + Buffer.from(algorithm,'ascii').toString('hex');
}

module.exports.privateToPublic = (privateKey) => {
    var account = crypto.createECDH('secp256k1');
    account.setPrivateKey(privateKey);
    return account.getPublicKey();
}

module.exports.computeSecret = (publicKeyBuffer) => {
    var a = crypto.createECDH('secp256k1');
    a.generateKeys();
    a.setPrivateKey(this.getPrivateKeyBuffer());
    return a.computeSecret(publicKeyBuffer);
}

exports.encrypt = (msg,secret) => {
    var cipher = crypto. createCipheriv(algorithm, secret);
    var crypted = cipher.update(msg, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

exports.decrypt = (msg,secret) => {
    var decipher = crypto.createDecipheriv(algorithm, secret);
    var dec = decipher.update(msg, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;

}
// computeSecret = (publicKeyBuffer) => {
//     var a = crypto.createECDH('secp256k1');
//     a.generateKeys();
//     a.setPrivateKey(this.getPrivateKeyBuffer());
//     return a.computeSecret(publicKeyBuffer);
// }