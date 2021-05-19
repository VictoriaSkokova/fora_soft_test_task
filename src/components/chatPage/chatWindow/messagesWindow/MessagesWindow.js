import React, {useContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {SocketContext} from '../../../../context/SocketContext';
import MessageBlock from './messageBlock/MessageBlock';
import './MessagesWindow.css';
import showMore from '../icons/more.png';

const MessagesWindow = () => {
    const context = useContext(SocketContext);
    const [listOfMessages, setListOfMessages] = useState([]);
    const [shouldShowMore, setShouldMore] = useState(false);

    const shouldAutoScroll = useRef(false);
    const messageBlockRef = useRef();
    const listOfMessagesRef = useRef();

    useEffect(() => {
        if (context.newMessage) {
            if (findShowMoreValue()) {
                shouldAutoScroll.current = true;
            }
            setListOfMessages(prevState => [...prevState, <MessageBlock name={context.newMessage.username}
                                                                        time={context.newMessage.time}
                                                                        text={context.newMessage.text}
                                                                        isCurrentUser={context.newMessage.userId === context.userInfo.userId}
                                                                        key={Math.random().toString(36).substr(2, 9)}
                />]
            )
        }
    }, [context.newMessage])

    useEffect(() => {
            let messageBlockHeight = messageBlockRef.current.getBoundingClientRect().height;
            let listHeight = listOfMessagesRef.current.getBoundingClientRect().height;

            if (shouldAutoScroll.current) {
                messageBlockRef.current.scrollTop = listHeight - messageBlockHeight;
                setShouldMore(false);
                shouldAutoScroll.current = false;
            } else {
                if (messageBlockRef.current.scrollTop === 0 && listHeight <= messageBlockHeight) {
                    setShouldMore(false);
                } else {
                    setShouldMore(true);
                }
            }

        }, [listOfMessages]
    )

    const handleShowMore = () => {
        let messageBlockHeight = messageBlockRef.current.getBoundingClientRect().height;
        let listHeight = listOfMessagesRef.current.getBoundingClientRect().height;
        messageBlockRef.current.scrollTop = listHeight - messageBlockHeight;
        setShouldMore(false);
    }

    const handleScroll = (event) => {
        if (findShowMoreValue()) {
            setShouldMore(false);
        } else {
            setShouldMore(true);
        }
    }

    const findShowMoreValue = () => {
        let scrollValue = Math.abs(Math.ceil(listOfMessagesRef.current.getBoundingClientRect().height) -
            Math.ceil(messageBlockRef.current.getBoundingClientRect().height));
        let value = Math.abs(Math.ceil(messageBlockRef.current.scrollTop) - scrollValue);
        //console.log(Math.ceil(messageBlockRef.current.scrollTop), scrollValue, value);
        return value <= 30;
    }

    return (<div className='messagesWindow'>
        <div className='messagesWindow_block' ref={messageBlockRef} onWheel={handleScroll}>
            <div className='messagesWindow_block_listOfMessages' ref={listOfMessagesRef}>
                {listOfMessages?.map(value => value)}
            </div>
            <form className={shouldShowMore ? 'messagesWindow_block_form_show' : 'messagesWindow_block_form'}>
                <button type='button' className='messagesWindow_block_form_show_button' onClick={handleShowMore}>
                    <img src={showMore} alt='show more icon' className='messagesWindow_block_form_show_button_icon'/>
                </button>
            </form>
        </div>
    </div>);
}

export default MessagesWindow;