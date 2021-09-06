import React from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

import { RoomsComponent } from "./RoomsComponent";

import { useHistory } from 'react-router';

import { ChatInput } from './ChatInput';
import { Messages } from './Messages';
import { messagingService, authenticationService, encryptionService } from '../../services';

const keypair = require("keypair");

const crypto = require("crypto");
function getNewKey() { // creates a 2048-bits modulus RSA key
    var pair = keypair();
    return {
        privateKey: pair.private,
        publicKey: pair.public
    }
}

export const ChatPage = (props) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [rooms, setRooms] = React.useState([]);
    const [activeRoomIndex, setActiveRoomIndex] = React.useState(0);
    const [activeRoomId, setActiveRoomId] = React.useState("");
    const [connection, setConnection] = React.useState(null);
    const [users, setUsers] = React.useState(null);
    const [messages, setMessages] = React.useState([]);
    const [privateKey, setPrivateKey] = React.useState(null);
    const [latestMessage, setLatestMessage] = React.useState(null);
    const latestChat = React.useRef(null);
    const history = useHistory();

    const currentUserId = React.useRef(authenticationService.currentUserValue.id);
    const currentUserName = React.useRef(authenticationService.currentUserValue.firstName + " " + authenticationService.currentUserValue.lastName);
    latestChat.current = messages;

    const updateCurrentRoom = (index) => {

        setActiveRoomIndex(index);
        setActiveRoomId(rooms[index].id)
    }

    React.useEffect(() => {
        async function fetchData() {
            var pKey = await encryptionService.importPrivateKey(authenticationService.privateKey);
            setPrivateKey(pKey);
            const room = await messagingService.getRooms()

            debugger;
            await setRooms(room);

            if (room.length) {
                setActiveRoomId(room[activeRoomIndex].id);

                const user = await messagingService.getUsersForRoom(room[activeRoomIndex].id);

                if (user == null) {
                    history.push('/404');
                }

                setUsers(user);
                const newConnection = new HubConnectionBuilder()
                    .withUrl('https://localhost:44358/hubs/chat')
                    .withAutomaticReconnect()
                    .build();

                setConnection(newConnection);

                if (newConnection.connectionStarted) {
                    try {
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
                else {
                }
            }
        }

        fetchData();

        setIsLoading(false);
    }, []);

    React.useEffect(() => {
        const startConnection = async () => {
            if (connection) {
                connection.start()
                    .then(async (result) => {
                        console.log('Connected!');

                        connection.invoke('Subscribe', currentUserId.current, activeRoomId);

                        console.log("Subscribed!");

                        console.log(connection);
                        connection.on('TestSubscription', message => {
                            console.log(message);
                        });

                        connection.on('ReceiveMessage', message => {
                            setLatestMessage(message);

                        });
                    })
                    .catch(e => console.log('Connection failed: ', e));
            }
        }

        startConnection();
    }, [connection]);

    React.useEffect(() => {
        if (latestMessage != null) {
            const decryptMessage = async () => {
                const updatedChat = [...latestChat.current];
                var message = latestMessage;
                message.message = await encryptionService.decryptMessage(privateKey, message.message);

                updatedChat.push(message);
                setMessages(updatedChat);
            }

            decryptMessage();
        }
    }, [latestMessage]);

    const sendMessage = async (message) => {
        var messages = [];
        var userIds = [];
        for (let i = 0; i < users.length; i++) {
            let importedPublicKey = await encryptionService.importPublicKey(users[i].publicKey);

            var encryptedMessage = await encryptionService.encryptMessage(importedPublicKey, message);

            messages.push(encryptedMessage);
            userIds.push(users[i].id);
        }

        if (connection.connectionStarted) {
            try {
                debugger;
                await connection.invoke('sendMessage', userIds, messages, activeRoomId, currentUserId.current, currentUserName.current);
            }
            catch (e) {
                console.log(e);
            }
        }
        else {
        }
    }

    return (
        isLoading
            ?

            <p>Loading...</p>
            :
            <div>

                <RoomsComponent
                    rooms={rooms}
                    activeRoomIndex={activeRoomIndex}
                    updateCurrentRoom={updateCurrentRoom}
                />
                <Messages
                    messages={messages}
                />

                <ChatInput
                    sendMessage={sendMessage} />
            </div>
    )
};
