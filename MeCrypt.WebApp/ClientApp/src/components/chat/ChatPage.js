import React from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

import { messagingService, authenticationService, encryptionService } from '../../services';
import { ChatInput } from './ChatInput';
import { Messages } from './Messages';
import { permissionTypes } from '../../helpers';

export const ChatPage = (props) => {
    const sf = () => {
        setForceUpdate(forceUpdate + 1);
    }
    const [forceUpdate, setForceUpdate] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(true);
    const [rooms, setRooms] = React.useState(null);
    const [activeRoomIndex, setActiveRoomIndex] = React.useState(null);
    const [activeRoomId, setActiveRoomId] = React.useState("");
    const [connection, setConnection] = React.useState(null);
    const [users, setUsers] = React.useState(null);
    const [messages, setMessages] = React.useState([]);
    const [privateKey, setPrivateKey] = React.useState(null);
    const [latestMessage, setLatestMessage] = React.useState(null);
    const publicKey = React.useRef(authenticationService.publicKey);
    const latestChat = React.useRef(null);
    const history = useHistory();

    const jwtToken = React.useRef(authenticationService.currentUserValue.token);
    const currentUserId = React.useRef(authenticationService.currentUserValue.id);
    const currentUserName = React.useRef(authenticationService.currentUserValue.firstName + " " + authenticationService.currentUserValue.lastName);
    latestChat.current = messages;

    const updateCurrentRoom = (index) => {
        if (index === activeRoomIndex) {
            return;
        }

        setActiveRoomIndex(index);
        setActiveRoomId(rooms[index].id)
    }

    React.useEffect(() => {
        if (!authenticationService.hasPermission(permissionTypes.Messages_ReadWrite)) {
            history.push('/unauthorized')
        }

        async function fetchData() {
            var privateKey = await encryptionService.importPrivateKey(authenticationService.privateKey);

            setPrivateKey(privateKey);

            const room = await messagingService.getRooms()

            if (room != null) {
                setRooms(room);
            }
        }

        fetchData();

        setIsLoading(false);
    }, []);

    React.useEffect(() => {
        if (rooms !== null && rooms.length > 0) {
            setActiveRoomIndex(0);
        }
    }, [rooms]);

    React.useEffect(() => {
        async function connectR() {
            if (rooms === null || rooms.length === 0) return;

            setActiveRoomId(rooms[activeRoomIndex].id);
            const user = await messagingService.getUsersForRoom(rooms[activeRoomIndex].id);

            if (user == null) {
                history.push('/404');
            }

            const messagesStored = await messagingService.getMessagesForRoom(rooms[activeRoomIndex].id);
            setMessages([]);
            var msgs = []
            if (messagesStored != null) {
                for (let i = 0; i < messagesStored.length; i++) {
                    let sender = user.find(u => u.id == messagesStored[i].senderId);
                    let senderName = `${sender.firstName} ${sender.lastName}`;
                    let msg = {
                        senderName: senderName,
                        message: messagesStored[i].cryptedContent,
                        senderId: messagesStored[i].senderId,
                        roomId: rooms[activeRoomIndex].id
                    }
                    msgs.push(msg);
                    msgs[i].message = await encryptionService.decryptMessage(privateKey, msgs[i].message);
                }

                setMessages(msgs);
            }


            setUsers(user);
            if (connection != null) {
                connection.stop();
            }

            const newConnection = new HubConnectionBuilder()
                .withUrl(`https://localhost:44358/hubs/chat/?roomId=${rooms[activeRoomIndex].id}&accessToken=${jwtToken.current}`, {
                    skipNegotiation: true,
                    transport: 1 // web sockets - de schimbat in enum
                })
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

        connectR();

        setIsLoading(false);
    }, [activeRoomIndex]);


    React.useEffect(() => {
        const startConnection = async () => {
            if (connection) {
                connection.start()
                    .then(async (result) => {
                        console.log('Connected!');
                        var userIds = [];
                        for (let i = 0; i < users.length; i++) {
                            userIds.push(users[i].id);
                        }

                        connection.invoke('Subscribe', currentUserId.current, userIds, activeRoomId, publicKey.current);

                        console.log("Subscribed!");

                        console.log(connection);
                        connection.on('TestSubscription', message => {
                            console.log(message);
                        });

                        connection.on('ReceiveMessage', message => { // if message.roomId === currentRoomId...
                            setLatestMessage(message);
                        });

                        connection.on('TriggerAddUser', (userMsg) => {
                            var user = users;
                            for (let i = 0; i < user.length; i++) {
                                if (user[i].id == userMsg.id) {
                                    user[i].publicKey = userMsg.publicKey;
                                }
                            }

                            setUsers(user);
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
        var encryptedMessages = [];
        var userIds = [];
        for (let i = 0; i < users.length; i++) {
            let importedPublicKey = await encryptionService.importPublicKey(users[i].publicKey);

            var encryptedMessage = await encryptionService.encryptMessage(importedPublicKey, message);
            encryptedMessages.push(encryptedMessage);
            userIds.push(users[i].id);
        }

        if (connection.connectionStarted) {
            try {
                await connection.invoke('sendMessage', userIds, encryptedMessages, activeRoomId, currentUserId.current, currentUserName.current);
                await messagingService.storeMessages(encryptedMessages, userIds, activeRoomId);
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
                <div class="card roomsComponent">
                    <br />
                    <h2>Chat Rooms</h2>
                    <ul class="roomsList list-group list-group-flush">
                        <br />
                        {rooms && rooms.length > 0
                            ? <>{rooms.map((room, index) =>
                                <>
                                    {
                                        index != activeRoomIndex
                                            ? <li onClick={(e) => { updateCurrentRoom(index) }} key={index} className="roomItem list-group-item">{room.name}</li>
                                            : <li onClick={(e) => { updateCurrentRoom(index) }} key={index} className="roomItem activeRoomItem list-group-item">{room.name}</li>
                                    }
                                </>
                            )}
                            </>
                            : <p>You aren't member of any rooms. :(</p>
                        }
                    </ul>
                    <Link to={`/createRoom`}><button className="btn btn-primary">Create Room</button></Link>
                </div>
                {
                    rooms && rooms.length > 0
                        ? <div className="messagesContainer">
                            {rooms[activeRoomIndex] !== undefined && <div className="roomTitle"><h1>{rooms[activeRoomIndex].name}</h1></div>}
                            <div className="chatWindow">
                                <Messages
                                    messages={messages}
                                />

                            </div>
                            <ChatInput
                                sendMessage={sendMessage} />
                        </div>
                        : <>
                        </>
                }
            </div>
    )
};
