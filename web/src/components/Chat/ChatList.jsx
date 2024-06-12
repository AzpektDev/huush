// ChatList.jsx

import React from 'react';
import './../../assets/styles/ChatList.css';

const ChatList = ({ chats, onSelectChat }) => {
    return (
        <div className="chat-list">
            <div className="chat-list-header">Chat List</div>
            <input type="text" name="" id="" />
            {chats.map((chat) => (
                <div
                    key={chat.id}
                    className="chat-list-item"
                    onClick={() => onSelectChat(chat.id)}
                >
                    {chat.name}
                    {chat.last_message}
                </div>
            ))}
        </div>
    );
};

export default ChatList;