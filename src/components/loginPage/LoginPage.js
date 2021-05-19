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
            let timeNow = new Date();
            let timeMinutes = timeNow.getMinutes().toString();
            timeMinutes = timeMinutes.length === 1 ? `0${timeMinutes}` : timeMinutes;
            let timeHours = timeNow.getHours().toString();
            timeHours = timeHours.length === 1 ? `0${timeHours}` : timeHours;
            socketContext.socketSend({
                type: 'join',
                data: {room: socketContext.room, username: inputRef.current.value, time: `${timeHours}:${timeMinutes}`}
            })
        }
    }

    useEffect(() => {
        if(socketContext.errorMessage.loggedError && inputRef){
            inputRef.current.style.backgroundColor = 'rgba(255, 234, 231, 30)';
            setTimeout(() => {inputRef.current.style.backgroundColor = 'rgb(253, 254, 255)';}, 500)
        }
    }, [socketContext.errorMessage.loggedError]);

    useEffect(() => {
        if(inputRef) {
            inputRef.current.focus();
        }
    }, [inputRef]);

    return (<div className='loginPage'>
        <header className='loginPage_header'>Enter username to login to the chat room</header>
        <form className='loginPage_form' onSubmit={(e) => {
            e.preventDefault();
            onConnect();
        }}>
            <input className='loginPage_form_input' placeholder='Username' ref={inputRef} type='text'/>
            <button className='loginPage_form_button' type='button' onClick={onConnect}>Join!</button>
        </form>
    </div>);

}

export default LoginPage;