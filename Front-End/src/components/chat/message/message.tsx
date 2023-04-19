import './message.css'
import {format} from 'timeago.js'
import MyAvatar from '../../user/Avatar';
import React from 'react';

export default function Message2({ message2, own, user, authCtx }) {

  return (
    <div className= {own ? "message own" : "message"}>
      <div className="messageTop">
       <MyAvatar authCtx={authCtx} id={user.id} style="xs" avatar={user.avatar} ftAvatar={user.ftAvatar}/>
        <p className="messageText">
         {message2.content}
        </p>
      </div>
      <div className="messageBottom" > {user.username} - {format(message2.createdAt)}</div>
    </div>

  );

}

