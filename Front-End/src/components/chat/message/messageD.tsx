import './message.css'
import {format} from 'timeago.js'
import MyAvatar from '../../user/Avatar';
import React from 'react';
import { Avatar } from '@mui/material';

export default function MessageD({ messageD, own, user, authCtx }) {

	return (
	<div className= {own ? "message own" : "message"}>
		<div className="messageTop">
		<Avatar variant="rounded" className="users-msgD-avatar"  src={user.ftAvatar ? user.ftAvatar : user.avatar} />
		<p className="messageText">
			{messageD.content}
		</p>
		</div>
		<div className="messageBottom" > {user.username} - {format(messageD.createdAt)}</div>
	</div>
	);

}
