import React, {useContext, useEffect, useRef, useState} from 'react';
import './VideoChat.css';
import endCall from './icons/end_call.png';
import micOn from './icons/mic.png';
import micOff from './icons/mic_off.png';
import cameraOn from './icons/videocamera.png';
import cameraOff from './icons/videocamera_off.png';
import {SocketContext} from '../../context/SocketContext';
import {currentUserWebRTC} from '../../context/userWebRTC';
import VideoChatUser from './videoChatUser/VideoChatUser';

const VideoChat = () => {
    let context = useContext(SocketContext);
    const localVideoTag = useRef();
    const [listShowVideo, setListShowVideo] = useState([]);
    const [buttonCamera, setButtonCamera] = useState(true);
    const [buttonMic, setButtonMic] = useState(true);

    const handleEndCall = () => {
        context.userStream(false);
        currentUserWebRTC._isCameraOn = false;
        currentUserWebRTC._localStream = null;
        currentUserWebRTC._streams = {};
        let timeNow = new Date();
        let timeMinutes = timeNow.getMinutes().toString();
        timeMinutes = timeMinutes.length === 1 ? `0${timeMinutes}` : timeMinutes;
        let timeHours = timeNow.getHours().toString();
        timeHours = timeHours.length === 1 ? `0${timeHours}` : timeHours;
        context.socketSend({
            type: 'leaveWebRtc',
            data: {
                userId: context.userInfo.userId,
                username: context.userInfo.username,
                roomId: context.userInfo.roomId,
                time: `${timeHours}:${timeMinutes}`
            }
        })
    };

    useEffect(() => {
        if (context.localVideo && localVideoTag) {
            localVideoTag.current.srcObject = context.localVideo;
        }
    }, [context.localVideo])

    useEffect(() => {
        setListShowVideo(context.listVideo.filter(item => item !== context.userInfo.userId).map(videoItem => {
            return <VideoChatUser id={videoItem.id} type='remote' stream={videoItem.stream}/>
        }))
    }, [context.listVideo])

    return (<div className='videoChat'>
        <div className='videoChat_block'>
            <div className='videoChat_block_list'>
                <div className='videoChatUser'>
                    <video autoPlay muted className='local-video' ref={localVideoTag}/>
                </div>
                {
                    listShowVideo.map(value => value)
                }
            </div>
            <form className='videoChat_block_form'>
                <button className='videoChat_block_form_button_camera' type='button' onClick={() => {
                    context.toggleVideo();
                    setButtonCamera(!buttonCamera);
                }}>
                    <img src={buttonCamera ? cameraOn : cameraOff} alt='camera icon'/>
                </button>
                <button className='videoChat_block_form_button_microphone' type='button' onClick={() => {
                    context.toggleAudio();
                    setButtonMic(!buttonMic);
                }}>
                    <img src={buttonMic ? micOn : micOff} alt='microphone icon'/>
                </button>
                <button className='videoChat_block_form_button_left' type='button' onClick={handleEndCall}>
                    <img src={endCall} alt='left icon'/>
                </button>
            </form>
        </div>
    </div>);
}

export default VideoChat;