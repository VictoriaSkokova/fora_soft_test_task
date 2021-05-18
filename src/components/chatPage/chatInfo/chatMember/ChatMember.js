import React from 'react';
import './ChatMember.css';

const ChatMember = ({name}) => {
    return (<div className='chatMember'>
        <div className='chatMember_name'>{name}</div>
    </div>);
}

export default ChatMember;