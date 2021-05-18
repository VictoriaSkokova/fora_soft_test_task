import React, {useContext, useEffect, useState} from 'react';
import {SocketContext} from "../../../../context/SocketContext";
import MessageBlock from "./messageBlock/MessageBlock";

const MessagesWindow = () => {
    const context = useContext(SocketContext);
    const [listOfMessages, setListOfMessages] = useState([]);

    useEffect(() => {
        if (context.newMessage) {
            setListOfMessages(prevState => [...prevState, <MessageBlock name={context.newMessage.username}
                                                    time={context.newMessage.time}
                                                    text={context.newMessage.text}
                                                    isCurrentUser={context.newMessage.userId === context.userInfo.userId}
                />]
            )
        }
    }, [context.newMessage])

    return (<div className='messages-window'>
        {listOfMessages?.map(value => value)}
    </div>);
}

export default MessagesWindow;