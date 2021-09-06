import * as base64 from '../helpers/base64';
export const encryptionService = {
    testEncryption,
    exportPublicKey,
    exportPrivateKey,
    importPrivateKey,
    importPublicKey,
    encryptMessage,
    decryptMessage,
    getNewKey
};

function encoding(type) {
    let enc = new TextEncoder();
    let dec = new TextDecoder(enc.encoding);

    var d = function decodeMessage(message) {
        var decoded = dec.decode(message);
        return decoded;
    }

    var e = function getMessageEncoding(message) {
        return enc.encode(message);
    }

    if (type == 'e')
        return e;

    if (type == 'd')
        return d;

}

var encode = encoding('e');
var decode = encoding('d');


async function exportPrivateKey(key) {
    const exported = await window.crypto.subtle.exportKey(
        "pkcs8",
        key
    );
    const exportedAsString = ab2str(exported);
    const exportedAsBase64 = window.btoa(exportedAsString);
    const pemExported = `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64}\n-----END PRIVATE KEY-----`;

    return pemExported;
}

async function exportPublicKey(key) {
    var exported = await window.crypto.subtle.exportKey(
        "spki",
        key
    );

    const exportedAsString = ab2str(exported);
    const exportedAsBase64 = window.btoa(exportedAsString);
    const pemExported = `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;

    return pemExported;
}

async function importPrivateKey(pem) {
    // fetch the part of the PEM string between header and footer
    const pemHeader = "-----BEGIN PRIVATE KEY-----";
    const pemFooter = "-----END PRIVATE KEY-----";
    const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
    // base64 decode the string to get the binary data
    const binaryDerString = window.atob(pemContents);
    // convert from a binary string to an ArrayBuffer
    const binaryDer = str2ab(binaryDerString);

    var imported = await window.crypto.subtle.importKey(
        "pkcs8",
        binaryDer,
        {
            name: "RSA-OAEP",
            // Consider using a 4096-bit key for systems that require long-term security
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true,
        ["decrypt"]
    );

    return imported;
}

async function importPublicKey(pem) {
    // fetch the part of the PEM string between header and footer
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";
    const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
    // base64 decode the string to get the binary data
    const binaryDerString = window.atob(pemContents);
    // convert from a binary string to an ArrayBuffer
    const binaryDer = str2ab(binaryDerString);

    var imported = await window.crypto.subtle.importKey(
        "spki",
        binaryDer,
        {
            name: "RSA-OAEP",
            // Consider using a 4096-bit key for systems that require long-term security
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true,
        ["encrypt"]
    );

    return imported;
}

async function getNewKey() { // creates a 2048-bits modulus RSA key
    var keyPair = await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
    );

    return keyPair;
}

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

async function decryptMessage(key, ciphertext) {
    let decrypted;
    ciphertext = encode(ciphertext);
    try {
        decrypted = await window.crypto.subtle.decrypt(
            {
                name: "RSA-OAEP"
            },
            key,
            ciphertext
        );
    }
    catch (e) {
        debugger;
    }
    return decode(decrypted);
}

function arrayBufferToBase64(buffer) {
    var len = buffer.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return window.btoa(binary);
}
async function encryptMessage(key, message) {
    let encoded = encode(message);
    let ciphertext = await window.crypto.subtle.encrypt(
        {
            name: "RSA-OAEP"
        },
        key,
        encoded
    );

    debugger;
    var x = decode(ciphertext);
    var y = encode(x);

    return x;
}

async function testEncryption() {
    debugger;
    let message = "AAAAAA";
    let key = await getNewKey();

    let exportedPublicKey = await exportPublicKey(key.publicKey);
    let exportedPrivateKey = await exportPrivateKey(key.privateKey);

    let importedPublicKey = await importPublicKey(exportedPublicKey);
    let importedPrivateKey = await importPrivateKey(exportedPrivateKey);

    let encrypted = await encryptMessage(importedPublicKey, message);

    let decrypted = await decryptMessage(importedPrivateKey, encrypted);
    debugger;
}