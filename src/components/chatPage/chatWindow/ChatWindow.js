import React, {useContext, useRef, useEffect} from 'react';
import {SocketContext} from '../../../context/SocketContext';
import MessagesWindow from "./messagesWindow/MessagesWindow";
import sendIcon from "./icons/send.png";
import './ChatWindow.css';

const ChatWindow = () => {
    let context = useContext(SocketContext);
    const inputRef = useRef();

    const handleMessageSend = () => {
        let timeNow = new Date();
        let timeMinutes = timeNow.getMinutes().toString();
        timeMinutes = timeMinutes.length === 1 ? `0${timeMinutes}` : timeMinutes;
        let timeHours = timeNow.getHours().toString();
        timeHours = timeHours.length === 1 ? `0${timeHours}` : timeHours;
        console.log("Message", context.userInfo);
        context.socketSend({
            type: 'message',
            data: {
                user: context.userInfo.userId,
                username: context.userInfo.username,
                room: context.userInfo.roomId,
                text: inputRef.current.value,
                time: `${timeHours}:${timeMinutes}`
            }
        });
        inputRef.current.value = "";
    }

    useEffect(() => {
        if(context.errorMessage.messageError && inputRef){
            inputRef.current.style.backgroundColor = 'rgba(255, 234, 231, 30)';
            setTimeout(() => {inputRef.current.style.backgroundColor = 'rgb(253, 254, 255)';}, 500)
        }
    }, [context.errorMessage.messageError]);

    useEffect(() => {
        if(inputRef) {
            inputRef.current.focus();
        }
    }, [inputRef]);

    return (<div className='chatWindow'>
        <MessagesWindow/>
        <form className='chatWindow_form' onSubmit={(e) => {
            e.preventDefault();
            handleMessageSend();
        }}>
            <input className='chatWindow_form_input' placeholder='Star typing your message...' ref={inputRef}
                   type='text'/>
            <button id={'send_button'} className='chatWindow_form_button' onClick={handleMessageSend} type='button'>
                <img className='chatWindow_form_button_icon' src={sendIcon} alt='send icon'/>
            </button>
        </form>
    </div>);
}

export default ChatWindow;