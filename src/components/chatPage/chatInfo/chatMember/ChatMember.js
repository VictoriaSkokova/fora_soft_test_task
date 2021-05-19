import React from 'react';
import './ChatMember.css';

//React component for chat member's name in list of users online
const ChatMember = ({name}) => {
    return (<div className='chatMember'>
        <div className='chatMember_name'>{name}</div>
    </div>);
}

export default ChatMember;