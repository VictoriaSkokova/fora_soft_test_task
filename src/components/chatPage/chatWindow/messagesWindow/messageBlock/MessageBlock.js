import React from 'react';
import './MessageBlock.css';

const MessageBlock = (props) => {
    const messageBlockPosition = props.isCurrentUser ? {
        alignSelf: 'flex-end',
        marginRight: '15px'
    } : {
        alignSelf: 'flex-start',
        marginLeft: '15px'
    };

    const textAlign = props.isCurrentUser ? {
        textAlign: 'right',
        marginRight: '5px'
    } : {
        textAlign: 'left',
        marginLeft: '5px'
    }

    const messageBodyColor = props.name === null ? {
        backgroundColor: 'rgb(255, 207, 197)',
        border: '3px solid rgb(255, 207, 197)'
    } : null;

    return (<div className='messageBlock' style={messageBlockPosition}>
        <div className='messageBlock_name' style={textAlign}>
            {props.name}
        </div>
        <div className='messageBlock_messageBody' style={messageBodyColor}>
            <div className='messageBlock_messageBody_text'>
                {props.text}
            </div>
            <div className='messageBlock_messageBody_time' style={textAlign}>
                {props.time}
            </div>
        </div>
    </div>);
};

export default MessageBlock;