import { encrypt } from 'eccrypto';
import { decompress } from './public-key';

export default function encryptWithPublicKey(publicKey, message) {

    // ensure its an uncompressed publicKey
    publicKey = decompress(publicKey);

    // re-add the compression-flag
    var pubString = '04' + publicKey;

    return encrypt(new Buffer(pubString, 'hex'), Buffer(message)).then(function (encryptedBuffers) {
        var encrypted = {
            iv: encryptedBuffers.iv.toString('hex'),
            ephemPublicKey: encryptedBuffers.ephemPublicKey.toString('hex'),
            ciphertext: encryptedBuffers.ciphertext.toString('hex'),
            mac: encryptedBuffers.mac.toString('hex')
        };
        return encrypted;
    });
}