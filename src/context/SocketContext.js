import React, {useCallback, useEffect, useRef, useState} from 'react';
import {io} from 'socket.io-client';
import {currentWebRTC} from '../context/WebRTC';

//Set end point of socket connection
const ENDPOINT = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ?
    'http://localhost:8080' : 'https://fora-soft-webrtc-chat.herokuapp.com/';

const DEFAULT_SOCKET = {};

//Create context for exchanging information
const SocketContext = React.createContext(DEFAULT_SOCKET);

//Creating socket provider react component
const SocketContextProvider = props => {
    const {children, room} = props;
    const [roomId, setRoom] = useState(props.room);
    const [socket, setSocket] = useState();
    const [logged, setLogged] = useState(false);
    const [userInfo, setUserInfo] = useState();
    const [listOfMembers, setListOfMembers] = useState();
    const [isStreamOn, setIsStreamOn] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const [errorMessage, setErrorMessage] = useState({loggedError: false, messageError: false});
    const [localVideo, setLocalVideo] = useState();
    const [listVideo, setListVideo] = useState([]);
    const [userVideoName, setUserVideoName] = useState(null);

    const listRef = useRef([]);

    const toggleVideo = () => {
        localVideo.getVideoTracks().forEach(track => track.enabled = !track.enabled)
    }

    const toggleAudio = () => {
        localVideo.getAudioTracks().forEach(track => track.enabled = !track.enabled)
    }

    //Create and socket in state
    useEffect(() => {
        if (room) {
            setSocket(io(ENDPOINT, {
                    transports: ['websocket', 'polling']
                }
            ));
        }
    }, [roomId]);

    //Set room id from link string
    useEffect(() => {
        setRoom(props.room);
    }, [props.room])

    //Check is connection "ok"
    const onConnect = useCallback(() => {
        if (socket)
            console.log(socket?.connected);
    }, [socket?.connected]);

    //Exit room if socket disconnect
    const onDisconnect = () => {
        let array = listVideo.map(value => value);
        let index = listVideo.findIndex(value => value.id === userInfo.userId);
        array.splice(index, 1);
        setListVideo(array.map(value => value));
        setLogged(false);
        setNewMessage(undefined);
        setUserInfo(undefined);
        setListOfMembers(undefined);
        setIsStreamOn(false);
    }

    const onMessage = (data) => {
        setNewMessage({
            userId: data.userSendingMessage,
            username: data.username,
            text: data.text,
            time: data.time
        });
    }

    const onSrcObject = (id, stream) => {
        console.log("onSrcObject", listVideo, id, stream)
        if (listRef.current.find(value => value.id === id) === undefined) {
            setListVideo((prevState) => {
                    return [
                        ...prevState, {id, stream}
                    ]
                }
            )
            listRef.current.push({id, stream});
        }
    }

    const onLogged = (data) => {
        setUserInfo({
            username: data.username,
            userId: data.userId,
            roomId: data.roomId,
            isOnStream: false
        });
        setIsStreamOn(data.isStreamOnline);
        currentWebRTC.socket = socket;
        currentWebRTC.userId = data.userId;
        currentWebRTC.roomId = data.roomId;
        currentWebRTC.onSrcObject = onSrcObject;
        setLogged(true);
    }

    const onUpdateList = (data) => {
        setListOfMembers(data);
    }

    const onHandleError = (data) => {
        if (data.errorType === 'loggedError') {
            setErrorMessage(prevState => {
                return {...prevState, loggedError: true}
            })
        } else {
            setErrorMessage(prevState => {
                return {...prevState, messageError: true}
            })
        }
    }

    const onHandleStreamOn = () => {
        setIsStreamOn(true);
    }

    const onHandleStreamOff = () => {
        setIsStreamOn(false);
    }

    const onHandleSetUserName = (data) => {
        setUserVideoName(data.name);
    }

    const onHandleUserLeft = (data) => {
        let array = listVideo.map(value => value);
        let index = listVideo.findIndex(value => value.id === data.userId);
        array.splice(index, 1);
        setListVideo(array.map(value => value));
    }

    useEffect(() => {
        if (socket && room) {
            socket.on('connect', onConnect);
            socket.on('disconnect', onDisconnect);
            socket.on('logged', onLogged);
            socket.on('send:message', onMessage);
            socket.on('change:list', onUpdateList);
            socket.on('error', onHandleError);
            socket.on('streamOn', onHandleStreamOn);
            socket.on('streamOff', onHandleStreamOff);
            socket.on('setUserName', onHandleSetUserName);
            socket.on('userLeftRTC', onHandleUserLeft);
            socket.on('webRTC', currentWebRTC.socketReceived);
        }
    }, [socket])


    const socketSend = useCallback(({type, data}) => {
        if (socket) {
            socket.emit(type, data);
            setErrorMessage({loggedError: false, messageError: false});
        }
    }, [socket]);

    const userStream = (isOnStream, mediaStream) => {
        setUserInfo((prevState) => {
            return {...prevState, isOnStream}
        });
        if (isOnStream)
            setLocalVideo(mediaStream);
        else {
            currentWebRTC.onBeforeUnload();
        }
    }

    return (
        <SocketContext.Provider
            value={{
                room,
                socket,
                socketSend,
                logged,
                newMessage,
                isStreamOn,
                listOfMembers,
                userInfo,
                errorMessage,
                userStream,
                localVideo,
                listVideo,
                userVideoName,
                toggleVideo,
                toggleAudio
            }}>
            {children}
        </SocketContext.Provider>
    )
}

export {SocketContext, SocketContextProvider};
