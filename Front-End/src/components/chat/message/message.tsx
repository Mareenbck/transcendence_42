import './message.css'
import {format} from 'timeago.js'
import React from 'react';
import { Avatar } from '@mui/material';

export default function Message2({ message2, own, user, authCtx }: any) {

  return (
    <div className= {own ? "message own" : "message"}>
      <div className="messageTop">
		    <Avatar variant="rounded" className="users-msgD-avatar"  src={user.avatar ? user.avatar : user.ftAvatar} />
        <p className="messageText">
         {message2.content}
        </p>
      </div>
      <div className="messageBottom" > {user.username} - {format(message2.createdAt)}</div>
    </div>

  );

}

