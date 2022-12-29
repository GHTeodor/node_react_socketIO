import React, {useEffect, useRef, useState} from 'react';

import socket from "../socket";

const Chat = ({users, messages, userName, roomId, onAddMessage}) => {
    const [messageValue, setMessageValue] = useState("");
    const messagesRef = useRef(null);

    const onSendMessage = () => {
        socket.emit("ROOM:NEW_MESSAGE", {
            roomId,
            userName,
            text: messageValue,
        });
        onAddMessage({userName, text: messageValue});
        setMessageValue('');
    };

    useEffect(() => {
        messagesRef.current.scrollTo(0, messagesRef.current.scrollHeight);
    }, [messages]);

    return (
        <div className="chat">
            <div className="chat-users">
                <i>Room: <u>{roomId}</u></i>
                <hr />
                <b>Online ({users.length}):</b>
                <ul>
                    {users.map((name, index) => (
                        <li className={name === userName ? "highlightUser" : ""} key={name + index}>{name}</li>))}
                </ul>
            </div>
            <div className="chat-messages">
                <div ref={messagesRef} className="messages">
                    {messages.map((message, index) => <div key={index} className="message">
                        <p>{message.text}</p>
                        <div>
                            <span>{message.userName}</span>
                        </div>
                    </div>)}
                </div>
                <form>
                    <textarea value={messageValue}
                              onChange={(e) => setMessageValue(e.target.value)}
                              className="form-control"
                              rows="3"></textarea>
                    <button disabled={!messageValue} onClick={onSendMessage} type="button" className="btn btn-primary">Send</button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
