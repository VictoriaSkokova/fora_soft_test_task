import React, {useCallback, useEffect, useRef, useState} from 'react';
import {io} from 'socket.io-client';

const ENDPOINT = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ?
    'http://localhost:8080' : 'https://fora-soft-webrtc-chat.herokuapp.com/';

const DEFAULT_SOCKET = {};

const SocketContext = React.createContext(DEFAULT_SOCKET);

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

    useEffect(() => {
        if (room)
        {
            setSocket(io(ENDPOINT, {
                    transports: ['websocket', 'polling']
                }
            ));
        }
    }, [roomId]);

    useEffect(() => {
        setRoom(props.room);
    }, [props.room])

    const onConnect = useCallback(() => {
        if (socket)
            console.log(socket?.connected);
    }, [socket?.connected]);

    const onDisconnect = () => {
        setLogged(false);
        setNewMessage(undefined);
    }

    const onMessage = (data) => {
        setNewMessage({
            userId: data.userSendingMessage,
            username: data.username,
            text: data.text,
            time: data.time
        });
    }

    const onLogged = (data) => {
        setLogged(true);
        setUserInfo({
            username: data.username,
            userId: data.userId,
            roomId: data.roomId
        });
        setIsStreamOn(data.isStreamOn);
    }

    const onUpdateList = (data) => {
        setListOfMembers(data);
    }

    const onHandleError = (data) => {
        if(data.errorType === 'loggedError') {
            setErrorMessage(prevState => {
                return {...prevState, loggedError: true}
            })
        } else {
            setErrorMessage(prevState => {
                return {...prevState, messageError: true}
            })
        }
        console.log(data);
    }

    useEffect(() => {
        if (socket && room) {
            socket.on('connect', onConnect);
            socket.on('disconnect', onDisconnect);
            socket.on('logged', onLogged);
            socket.on('send:message', onMessage);
            socket.on('change:list', onUpdateList);
            socket.on('error', onHandleError)
        }
    }, [socket])


// data = { to: ..., message: ... }
// type = webRTC / message

    const socketSend = useCallback(({type, data}) => {
        if (socket) {
            socket.emit(type, data);
            setErrorMessage({loggedError: false, messageError: false});
        }
    }, [socket]);

    return (
        <SocketContext.Provider
            value={{room, socket, socketSend, logged, newMessage, isStreamOn, listOfMembers, userInfo, errorMessage}}>
            {children}
        </SocketContext.Provider>
    )
}

export {SocketContext, SocketContextProvider};
