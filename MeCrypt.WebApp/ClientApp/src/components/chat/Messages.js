import React from 'react';

const Message = (props) => (
    <div style={{ background: "#eee", borderRadius: '5px', padding: '0 10px' }}>
        <p><strong>{props.userName}</strong> </p>
        <br />
        <p>{props.message}</p>
    </div>
);

export const Messages = (props) => {
    const messages = props.messages
        .map(m => <Message
            userName={m.userName}
            message={m.message} />);

    return (
        <div>
            {messages}
        </div>
    )
};
