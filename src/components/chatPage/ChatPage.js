import React from 'react';
import './ChatPage.css';
import ChatWindow from './chatWindow/ChatWindow';
import ChatInfo from './chatInfo/ChatInfo';

const ChatPage = () => {

    return (<div className='chatPage'>
        <ChatWindow/>
        <ChatInfo/>
    </div>);
};

export default ChatPage;