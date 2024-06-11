import React from "react";
import Chats from "../../components/chatComponents/chats/chats";
import Header from "../../components/chatComponents/header/header";
import TextWindow from "../../components/chatComponents/textWindow/textWindow";

const Chat = () => {
    return (
        <div>
            <div><Header/></div>
        <Chats />
        <TextWindow />
        </div>
    );
}

export default Chat;