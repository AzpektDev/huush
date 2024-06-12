import React, { useState, useEffect } from 'react';
import { createChat } from '../../services/api';
import './../../assets/styles/chat.css';

const Chat = () => {
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);

    const handleSendMessage = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Unauthorized!');
            return;
        }

        const response = await createChat(token);
        if (response.status === 200) {
            setChatMessages([...chatMessages, message]);
            setMessage('');
        } else {
            alert('Message sending failed!');
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-list">
                {chatMessages.map((msg, index) => (
                    <div key={index} className="chat-message">
                        {msg}
                    </div>
                ))}
            </div>
            <div className="new-message">
                <input
                    type="text"
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
