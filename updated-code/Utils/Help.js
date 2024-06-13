

//import Wallet from 'ethereumjs-wallet';
import crypto from 'crypto';


exports.encrypt= (text, secret) => {
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

exports.decrypt = (msg,secret,iv) => {
    const decipher = crypto.createDecipheriv('aes-256-ctr', Buffer.from(secret, 'hex'), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(msg, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;

}
exports.createHMAC = (text, secret) => {
    const hmac = crypto.createHmac('sha256', Buffer.from(secret, 'hex'));
    hmac.update(message);
    return hmac.digest('hex');
}
exports.verifyHMAC = (message, hmacDigest, secret) => {
    const hmac = crypto.createHmac('sha256', Buffer.from(secret, 'hex'));
    hmac.update(message);
    const calculatedDigest = hmac.digest('hex');
    return calculatedDigest === hmacDigest;
}
