import React, {useContext, useRef} from 'react';
import {SocketContext} from '../../../context/SocketContext';
import MessagesWindow from "./messagesWindow/MessagesWindow";
import sendIcon from "./icons/send.png";
import './ChatWindow.css';

const ChatWindow = () => {
    let context = useContext(SocketContext);
    const inputRef = useRef();

    const handleMessageSend = () => {
        let timeNow = new Date();
        console.log("Message", context.userInfo );
        context.socketSend({
            type: 'message',
            data: {
                user: context.userInfo.userId,
                username: context.userInfo.username,
                room: context.userInfo.roomId,
                text: inputRef.current.value,
                time: `${timeNow.getHours()}:${timeNow.getMinutes()}`
            }
        });
        inputRef.current.value = "";
    }

    return (<div className ='chatWindow'>
        <MessagesWindow/>
        <form className ='chatWindow_form' onSubmit={(e) => e.preventDefault()}>
            <input className ='chatWindow_form_input' placeholder = 'Star typing your message...' ref = {inputRef} type='text'/>
            <button id = {'send_button'} className ='chatWindow_form_button' onClick={handleMessageSend} type = 'button'>
                <img className = 'chatWindow_form_button_icon' src = {sendIcon} alt = 'send icon'/>
            </button>
        </form>
    </div>);
}

export default ChatWindow;