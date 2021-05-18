import React from 'react';
import './MessageBlock.css';

const MessageBlock = (props) => {
    const messageBlockPosition = props.isCurrentUser ? {
        right: '10px'
    } : {
        left: '10px'
    };

    return (<div className='messageBlock' style = {messageBlockPosition}>
        <div className='messageBlock_name'>
            {props.name}
        </div>
        <div className='messageBlock_messageBody'>
            <div className='messageBlock_messageBody_text'>
                {props.text}
            </div>
            <div className='messageBlock_messageBody_time'>
                {props.time}
            </div>
        </div>
    </div>);
};

export default MessageBlock;