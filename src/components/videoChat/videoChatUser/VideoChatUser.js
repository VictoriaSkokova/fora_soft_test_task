import React, {useContext, useEffect, useRef} from 'react';
import './VideoChatUser.css';
import {SocketContext} from "../../../context/SocketContext";

const VideoChatUser = ({type, id, stream}) => {
    const videoRef = useRef();
    const context = useContext(SocketContext);

    useEffect(() => {
        console.log([type, id, stream]);
        if (videoRef && type !== 'local') {
            videoRef.current.srcObject = stream;
        }
    }, [videoRef]);

    useEffect(() => {
        console.log("VideoChatUser", type, id, stream);
        context.socketSend({
            type: 'getUserName',
            data: {id: id}
        });
    }, [id])

    return (<div className='videoChatUser'>
        <div className='videoChatUser_name'>{context.userVideoName}</div>
        <video ref={videoRef} autoPlay muted = {type === 'local'} className={`video-${id}`}/>
    </div>)
}

export default VideoChatUser;