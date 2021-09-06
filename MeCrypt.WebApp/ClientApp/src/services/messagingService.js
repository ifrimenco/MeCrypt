import { authHeader, authHeaderWithJson, handleResponse } from "../helpers";

const crypto = require("crypto");

export const messagingService = {
    encryptMessage,
    decryptMessage,
    createRoom,
    getRooms,
    getUsersForRoom
};

function encryptMessage(publicKey, data) {
    const encryptedData = crypto.publicEncrypt(
        {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
        // We convert the data string to a buffer using `Buffer.from`
        Buffer.from(data)
    );

    return encryptedData.toString("base64");
}

function decryptMessage(privateKey, data) {
    try {
        const decryptedData = crypto.privateDecrypt(
            {
                key: privateKey,
                // In order to decrypt the data, we need to specify the
                // same hashing function and padding scheme that we used to
                // encrypt the data in the previous step
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: "sha256",
            },
            data
        );
        return decryptedData.toString();
    }
    catch (e) {
        debugger;
    }
}

async function createRoom(name, users) {
    const requestOptions = {
        method: 'POST',
        headers: authHeaderWithJson(),
        body: JSON.stringify({ name, users })
    }
    const response = await fetch(`messages/createRoom`, requestOptions)
        .then(handleResponse);

    return response;
}

async function getRooms() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    }

    const response = await fetch(`messages/getrooms`, requestOptions)
        .then(handleResponse);

    return response;
}

async function getUsersForRoom(roomId) {
    if (roomId == null) {
        return null;
    }
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    }

    const response = await fetch(`messages/getUsersForRoom/${roomId}`, requestOptions)
        .then(handleResponse);

    return response;
}