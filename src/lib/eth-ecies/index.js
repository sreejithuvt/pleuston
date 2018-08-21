/* eslint-disable no-console */

/**
 * ECIES encrypt/decrypt with Ethereum keys
 * Modified from https://github.com/vhpoet/simple-ecies/blob/master/index.js
 */
import Aes256Gcm from '../aes-256-gcm'
const Crypto = require('crypto')
const EC = require('elliptic').ec
const secp256k1 = require('secp256k1')

const ec = new EC('secp256k1')

const AES256GcmEncrypt = (key, plaintext) => {
    let { ciphertext, iv, tag } = Aes256Gcm.encrypt(plaintext, key)
    let _ciphertext = Buffer.from(ciphertext, 'base64')
    let _iv = Buffer.from(iv, 'base64')
    let _tag = Buffer.from(tag, 'base64')
    console.log('tag length: ', _tag.length, _iv.length, _ciphertext.length, _iv, _tag, _ciphertext)
    return Buffer.concat([_iv, _tag, _ciphertext])
}

const AES256GcmDecrypt = (iv, tag, key, ciphertext) => {
    let plaintext = Aes256Gcm.decrypt(ciphertext.toString('base64'), iv.toString('base64'), tag.toString('base64'), key)
    return plaintext
}

// ###########################################
// ###########################################
// ###########################################

/**
 * Compares if two buffers are equal
 * @param {Buffer} b1
 * @param {Buffer} b2
 * @returns {boolean} true if the buffers are equal
 */
// const BufferEqual = (b1, b2) => {
//     if (b1.length !== b2.length) {
//         return false
//     }
//     let res = 0
//     for (let i = 0; i < b1.length; i++) {
//         res |= b1[i] ^ b2[i]
//     }
//     return res === 0
// }

/**
 * ECIES encrypt
 * @param {Buffer} pubKeyTo Ethereum pub key, 64 bytes
 * @param {Buffer} plaintext Plaintext to be encrypted
 * @param {?{?iv: Buffer, ?ephemPrivKey: Buffer}} opts
 * optional iv (16 bytes) and ephem key (32 bytes)
 * @returns {Buffer} Encrypted message, serialized, 113+ bytes
 */
class EthEcies {
    static Encrypt(pubKeyTo, plaintext) {
        const ephemPrivKeyBuffer = Crypto.randomBytes(32)
        const ephemPrivKey = ec.keyFromPrivate(ephemPrivKeyBuffer)
        const ephemPubKey = ephemPrivKey.getPublic()
        const ephemPubKeyEncoded = Buffer.from(ephemPubKey.encode())

        // Every EC public key begins with the 0x04 prefix before giving
        // the location of the two point on the curve
        let _pubKeyTo = pubKeyTo
        if (pubKeyTo[0] !== 0x04) {
            _pubKeyTo = Buffer.concat([Buffer.from([0x04]), pubKeyTo])
            console.log('adding 04 prefix: ', _pubKeyTo, pubKeyTo)
        }

        // const secpPubKey = secp256k1.publicKeyCreate(ephemPrivKeyBuffer)
        let hash = secp256k1.ecdh(_pubKeyTo, ephemPrivKeyBuffer)
        const encryptionKey = hash.slice(0, 32)
        // const macKey = hash.slice(32)
        // ciphertext consist of iv + tag + encrypted_data
        const ciphertext = AES256GcmEncrypt(encryptionKey, plaintext)
        const serializedCiphertext = Buffer.concat([
            ephemPubKeyEncoded, // 65 bytes
            ciphertext
        ])
        return serializedCiphertext
    }

    /**
     * ECIES decrypt
     * @param {Buffer} privKey Ethereum private key, 32 bytes
     * @param {Buffer} encrypted Encrypted message, serialized, 113+ bytes
     * @returns {Buffer} plaintext
     */

    static Decrypt(privKey, encrypted) {
        // read iv, ephemPubKey, mac, ciphertext from encrypted message
        const ephemPubKeyEncoded = encrypted.slice(0, 65)
        const iv = encrypted.slice(65, 81)
        const tag = encrypted.slice(81, 97)
        const ciphertext = encrypted.slice(97)
        // console.log('ciphertext parts: ',
        //     '\npubkey: ', ephemPubKeyEncoded.toString('hex'),
        //     '\niv:', iv.toString('hex'),
        //     '\ntag:', tag.toString('hex'),
        //     '\ndata:', ciphertext.toString('hex'))

        // const secpPubKey = secp256k1.publicKeyCreate(privKey)
        let hash = secp256k1.ecdh(ephemPubKeyEncoded, privKey)
        const encryptionKey = hash.slice(0, 32)
        // const macKey = hash.slice(32)

        // const dataToMac = Buffer.concat([iv, ephemPubKeyEncoded, ciphertext]);
        // const computedMac = Crypto.createHmac("sha256", macKey).update(dataToMac).digest();
        // // verify mac
        // if (!BufferEqual(computedMac, mac)) {
        //   throw new Error("MAC mismatch");
        // }
        const plaintext = AES256GcmDecrypt(iv, tag, encryptionKey, ciphertext)
        // console.log('decrypted data: ', plaintext)
        return plaintext
    }
}

// module.exports = {
//     encrypt: Encrypt,
//     decrypt: Decrypt
// }
// export default Aes256Gcm
export default EthEcies
