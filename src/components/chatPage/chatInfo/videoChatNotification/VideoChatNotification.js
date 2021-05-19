import React, {useContext} from 'react';
import {SocketContext} from '../../../../context/SocketContext';
import './VideChatNotification.css';

//React component of notification that someone in video chat now
//so users can join them
const VideoChatNotification = () => {
    const context = useContext(SocketContext);

    //Handler for button click - call interface change and video chat enter
    const handleStartCall = () => {
        context.userStream(true);
    };

    return (<div className='videoChatNotification'>
        <header className='videoChatNotification_header'>Join video chat!</header>
        <form className='videoChatNotification_form'>
            <button className='videoChatNotification_form_button' type='button' onClick={handleStartCall}>Join</button>
        </form>
    </div>);
}

export default VideoChatNotification;