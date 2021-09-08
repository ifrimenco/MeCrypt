import React, { useState } from 'react';

export const ChatInput = (props) => {
    const [message, setMessage] = useState('');

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            onSubmit(event);
        }
    }

    const onSubmit = (event) => {
        event.preventDefault();
        const isMessageProvided = message && message !== '';

        if (isMessageProvided) {
            props.sendMessage(message);
        }
        setMessage('');
    }

    const onMessageUpdate = (e) => {
        setMessage(e.target.value);
    }

    return (
        <form className="chatInput"
            onKeyPress={(event) => { handleKeyPress(event) }}
            onSubmit={onSubmit}>
            <br />
            <input
                autocomplete="off"
                type="text"
                className="inputBox"
                name="message"
                placeholder="Enter a message..."
                value={message}
                onChange={onMessageUpdate} />
            <br /><br />
            <button type="button" className="btn btn-primary" onClick={(e) => { onSubmit(e)}}>Send</button>
        </form>
    )
};