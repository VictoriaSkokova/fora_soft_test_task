import {React, useState, useEffect, useContext} from 'react';
import {SocketContext, SocketContextProvider} from '../../context/SocketContext';
import ChatPage from "../chatPage/ChatPage";
import LoginPage from "../loginPage/LoginPage";

const MainPage = () => {
    const socketContext = useContext(SocketContext);

    return (<div>
        {socketContext.logged ? <ChatPage/> : <LoginPage/>}
    </div>);
}

export default MainPage;