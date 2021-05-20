import React, {useContext, useEffect, useRef} from 'react';
import './VideoChatUser.css';
import {SocketContext} from "../../../context/SocketContext";

const VideoChatUser = ({type, id, stream}) => {
    const videoRef = useRef();
    const context = useContext(SocketContext);

    useEffect(() => {
        if (videoRef && type !== 'local') {
            videoRef.current.srcObject = stream;
            context.socketSend({
                type: 'getUserName',
                data: {id: id}
            });
        }
    }, [videoRef]);


    return (<div className='videoChatUser'>
        <video ref={videoRef} autoPlay muted = {type === 'local'} className={`video-${id}`}/>
    </div>)
}

export default VideoChatUser;