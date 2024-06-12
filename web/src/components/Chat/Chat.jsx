// Chat.jsx

import React, { useState, useEffect } from 'react';
import { createChat, getChats, getChatHistory } from '../../services/api';
import './../../assets/styles/Chat.css';
import User from './User';
import ChatList from './ChatList';

const Chat = () => {
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);

    useEffect(() => {
        const fetchChats = async () => {
            const token = localStorage.getItem('token');
            const response = await getChats(token);
            if (response.status === 200) {
                setChats(response.data.chats);
            }
        };

        fetchChats();
    }, []);

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

    const handleSelectChat = async (chatId) => {
        const token = localStorage.getItem('token');
        const response = await getChatHistory(chatId, token);
        if (response.status === 200) {
            setSelectedChat(chatId);
            setChatMessages(response.data.messages);
        }
    };

    return (
        <div className="chat-page">
            <User />
            <div className="chat-container">
                <div className="chat-list-section">
                    <ChatList chats={chats} onSelectChat={handleSelectChat} />
                </div>
                <div className="chat-main-section">
                    <div className="chat-header">
                        <span className="chat-title">Rozmowa z Jacek Jaworek</span>
                    </div>
                    <div className="chat-messages">
                        {chatMessages.map((msg, index) => (
                            <div key={index} className="chat-message">
                                {msg.content}
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
            </div>
        </div>
    );
};

export default Chat;
