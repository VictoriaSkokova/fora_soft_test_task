import React, {useContext, useEffect, useState, useRef} from 'react';
import './ChatInfo.css';
import {SocketContext} from '../../../context/SocketContext';
import VideoChatNotification from './videoChatNotification/VideoChatNotification';
import ChatMember from './chatMember/ChatMember';
import cameraIcon from './icons/videocamera.png'
import './ChatInfo.css';

const ChatInfo = () => {
    const context = useContext(SocketContext);
    const [listOfMembers, setListOfMembers] = useState([]);

    useEffect(() => {
        setListOfMembers(context.listOfMembers?.map(value => {
            return <ChatMember name={value.username}/>
        }));
    }, [context.listOfMembers])

    return (<div className='chatInfo'>
        {context.isStreamOn ? <VideoChatNotification/> : null}
        <div className='chatInfo_header'>
            <div className={'chatInfo_paragraph'}>Online in chat room</div>
            <form className='chatInfo_form'>
                <button className='chatInfo_form_button' type='button'>
                    <img src={cameraIcon} className='chatInfo_form_button_icon'/>
                </button>
            </form>
        </div>
        <div className='chatInfo_listOfMembers'>
            {listOfMembers?.map(value => value)}
        </div>
    </div>);
}

export default ChatInfo;