import React from 'react';

import { authenticationService } from '../../services';

export const Messages = (props) => {
    const currentUserId = React.useRef(authenticationService.currentUserValue.id);
    const messages = props.messages
        .map(m =>
            <>
                {m.senderId != currentUserId.current
                    ? <div className="message">
                        <p><strong>{m.senderName}</strong> </p>
                        <p>{m.message}</p>
                    </div>
                    :
                    <div className="currentUserMessage">
                        <p><strong>{m.senderName}</strong> </p>
                        <p>{m.message}</p>
                    </div>
                }
            </>);

    return (
        <div>
            {messages}
        </div>
    )
};
