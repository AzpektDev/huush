import { useState } from "react";
import "./../../assets/styles/ChatList.css";

const ChatList = ({ chats, onSelectChat }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredChats = chats.filter((chat) => chat.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="chat-list">
      <div className="chat-list-header">Chat List</div>
      <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      {filteredChats.map((chat) => (
        <div key={chat.id} className="chat-list-item" onClick={() => onSelectChat(chat.id)}>
          <div className="chat-list-item-name">{chat.name}</div>
          <div className="chat-list-item-last-message">{chat.last_message}</div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
