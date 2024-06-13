import { useEffect, useState } from "react";
import { searchUser } from "../../services/api";
import "./../../assets/styles/ChatList.css";

const ChatList = ({ chats, onSelectChat, onSelectUser }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const handleSearch = async () => {
      const token = localStorage.getItem("token");
      if (searchTerm.length > 0) {
        const response = await searchUser(searchTerm, token);
        if (response.data && response.data.user) {
          setUsers(response.data.user);
        } else {
          setUsers([]);
        }
      } else {
        setUsers([]);
      }
    };

    handleSearch();
  }, [searchTerm]);

  const isSearching = searchTerm.length > 0;

  return (
    <div className="chat-list">
      <div className="chat-list-header">Chat List</div>
      <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      {isSearching ? (
        users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className="chat-list-item" onClick={() => onSelectUser(user.id, user.username)}>
              <div className="chat-list-item-name">{user.username}</div>
            </div>
          ))
        ) : (
          <div className="no-results">No users found</div>
        )
      ) : chats.length > 0 ? (
        chats.map((chat) => (
          <div key={chat.id} className="chat-list-item" onClick={() => onSelectChat(chat.id, chat.name)}>
            <div className="chat-list-item-name">{chat.name}</div>
            <div className="chat-list-item-last-message">{chat.last_message}</div>
          </div>
        ))
      ) : (
        <div className="no-results">No chats available</div>
      )}
    </div>
  );
};

export default ChatList;
