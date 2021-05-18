import React, {useContext, useEffect, useRef} from 'react';
import {SocketContext} from '../../context/SocketContext';
import './LoginPage.css';

//React component for login page
const LoginPage = () => {
    //Ref to input tag for getting its value
    const inputRef = useRef();

    //Using Context to ensure the transfer of up-to-date data
    const socketContext = useContext(SocketContext);

    //Function for sending request to login chat
    const onConnect = () => {
        if (inputRef.current) {
            let messageDate = new Date();
            socketContext.socketSend({
                type: 'join',
                data: {room: socketContext.room, username: inputRef.current.value, time: `${messageDate.getHours()}:${messageDate.getMinutes()}`}
            })
        }
    }

    return (<div className='loginPage'>
        <header className='loginPage_header'>Enter username to login to the chat room</header>
        <form className='loginPage_form'>
            <input className='loginPage_form_input' placeholder='Username' ref={inputRef}/>
            <button className='loginPage_form_button' type='button' onClick={onConnect}>Enter chat room</button>
        </form>
    </div>);

}

export default LoginPage;