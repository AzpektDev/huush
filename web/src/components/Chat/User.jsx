import { useEffect, useState } from "react";
import "./../../assets/styles/User.css";

const User = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
   
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className="user-bar">
      <span className="user-name">Huushin as {username}</span>
    </div>
  );
};

export default User;
