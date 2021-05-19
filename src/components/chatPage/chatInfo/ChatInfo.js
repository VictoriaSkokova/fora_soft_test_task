import React, {useContext, useEffect, useState, useRef} from 'react';
import './ChatInfo.css';
import {SocketContext} from '../../../context/SocketContext';
import VideoChatNotification from './videoChatNotification/VideoChatNotification';
import ChatMember from './chatMember/ChatMember';
import cameraIcon from './icons/videocamera.png'
import './ChatInfo.css';
import {currentUserWebRTC} from '../../../context/userWebRTC';
import {currentWebRTC} from '../../../context/WebRTC';

//React component for side panel with list of users online
// and video chat notification
const ChatInfo = () => {
    const context = useContext(SocketContext);
    //State variable - array of users online in current room
    const [listOfMembers, setListOfMembers] = useState([]);
    //State variable - bool value, true - user gave access to camera and micro, false - not
    const [streamAccess, setStreamAccess] = useState(false);

    //useEffect executing after context.listOfMembers changes
    //update list of users online and call rerender for its display
    useEffect(() => {
        setListOfMembers(context.listOfMembers?.map(value => {
            return <ChatMember name={value.username} key={Math.random().toString(36).substr(2, 9)}/>
        }));
    }, [context.listOfMembers])

    //Handler for click on button with camera icon - setting user params and calling
    // function that requests permission to access camera and microphone and sets state in variables
    //for showing video chat page
    const handleStartCall = () => {
        currentUserWebRTC.user = {
            userId: context.userInfo.userId,
            username: context.userInfo.username,
            roomId: context.userInfo.roomId
        };
        //currentUserWebRTC.setLocalStream(getUserMedia());
        getUserMedia();
    };

    const getUserMedia = () => {
        return navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(stream => {
            //currentUserWebRTC.localStream = stream;
            setStreamAccess(true);
            context.userStream(true, stream);
            currentUserWebRTC.setLocalStream(stream, true);
        })
            .catch((error) => {
                context.userStream(false, null);
                setStreamAccess(false);
                alert('You have rejected the use of the camera and microphone, without it video chat cannot work. Please, change camera permission settings.');
                currentUserWebRTC.setLocalStream(null, false);
            }).finally(() => {
                currentUserWebRTC.localId = context.userInfo.userId;
                console.log(currentUserWebRTC.localStream);
            })
    }

    useEffect(() => {
        if (streamAccess) {
            currentWebRTC.sendWebRTCMessage(undefined, 'newPeerReceived', undefined);
            let timeNow = new Date();
            let timeMinutes = timeNow.getMinutes().toString();
            timeMinutes = timeMinutes.length === 1 ? `0${timeMinutes}` : timeMinutes;
            let timeHours = timeNow.getHours().toString();
            timeHours = timeHours.length === 1 ? `0${timeHours}` : timeHours;
            context.socketSend({type: 'newWebRCT',
                data: {
                    userId: currentUserWebRTC.user.userId,
                    username: currentUserWebRTC.user.username,
                    roomId: currentUserWebRTC.user.roomId,
                    time: `${timeHours}:${timeMinutes}`
                }
            });
        }
    }, [streamAccess])

    return (<div className='chatInfo'>
        {context.isStreamOn ? <VideoChatNotification/> : null}
        <div className='chatInfo_header'>
            <div className={'chatInfo_paragraph'}>Online in chat room</div>
            <form className='chatInfo_form'>
                <button className='chatInfo_form_button' type='button' onClick={handleStartCall}>
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