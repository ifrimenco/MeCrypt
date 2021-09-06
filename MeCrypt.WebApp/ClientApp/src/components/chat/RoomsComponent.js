import React from 'react';

export const RoomsComponent = (props) => {
    const rooms = props.rooms;
    const activeRoomIndex = props.activeRoomIndex;
    const updateCurrentRoom = props.updateCurrentRoom;

    return (
        <div class="card roomsComponent">
            <h2>Chat Rooms</h2>
            <ul class="list-group list-group-flush">
                {rooms.length > 0
                    ? <>{rooms.map((room, index) => 
                        <li key={room.id} class="list-group-item">{room.name}</li>
                    )}
                    </>
                    : <p>You aren't member of any rooms. Create One</p>
                }
            </ul>
        </div>
    )
};
