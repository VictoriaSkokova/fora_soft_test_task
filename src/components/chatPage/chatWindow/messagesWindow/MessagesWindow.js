import React, {useContext, useEffect, useState} from 'react';
import {SocketContext} from '../../../../context/SocketContext';
import MessageBlock from './messageBlock/MessageBlock';
import './MessagesWindow.css';

const MessagesWindow = () => {
    const context = useContext(SocketContext);
    const [listOfMessages, setListOfMessages] = useState([]);

    useEffect(() => {
        if (context.newMessage) {
            setListOfMessages(prevState => [...prevState, <MessageBlock name={context.newMessage.username}
                                                                        time={context.newMessage.time}
                                                                        text={context.newMessage.text}
                                                                        isCurrentUser={context.newMessage.userId === context.userInfo.userId}
                                                                        key={Symbol("message").toString()}
                />]
            )
        }
    }, [context.newMessage])

    return (<div className='messagesWindow'>
        <div className='messagesWindow_block'>
            <div className='messagesWindow_block_listOfMessages'>
                {listOfMessages?.map(value => value)}
            </div>
        </div>
    </div>);
}

export default MessagesWindow;