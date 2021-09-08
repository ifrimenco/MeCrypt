import { authHeader, authHeaderWithJson, handleResponse } from "../helpers";

const crypto = require("crypto");

export const messagingService = {
    createRoom,
    getRooms,
    getUsersForRoom,
    getMessagesForRoom,
    storeMessages
};

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

async function storeMessages(messages, users, roomId) {
    var userMessages = [];

    for (let i = 0; i < messages.length; i++) {
        userMessages.push({
            item1: users[i],
            item2: messages[i]
        });
    }

    const requestOptions = {
        method: 'POST',
        headers: authHeaderWithJson(),
        body: JSON.stringify({ roomId, userMessages })
    };

    const response = await fetch(`messages/storeMessages`, requestOptions)
        .then(handleResponse);

    return response;
}

async function getMessagesForRoom(roomId) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    const response = await fetch(`messages/getMessagesForRoom/${roomId}`, requestOptions)
        .then(handleResponse)

    return response;
}

