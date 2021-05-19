import React, {useContext} from 'react';
import './ChatPage.css';
import ChatWindow from './chatWindow/ChatWindow';
import ChatInfo from './chatInfo/ChatInfo';
import {SocketContext} from '../../context/SocketContext';
import VideoChat from "../videoChat/VideoChat";

const ChatPage = () => {
    let context = useContext(SocketContext);

    return (<div className={context.userInfo?.isOnStream ? 'videoPage' : 'chatPage'}>
        <VideoChat/>
        <ChatWindow/>
        <ChatInfo/>
    </div>);
}

export default ChatPage;