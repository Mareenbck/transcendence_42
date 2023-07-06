import React, { useContext, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Avatar, ListItem, Tooltip } from '@mui/material';
import { ListItemAvatar } from '@mui/material';
import { faBan, faTableTennisPaddleBall } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserChat } from '../../../interfaces/iChat';
import AuthContext from '../../../store/AuthContext';
import Fetch from '../../../interfaces/Fetch';

const UsersAction = (props: any) => {
	const authCtx = useContext(AuthContext);
	const [me, setMe] = useState<UserChat | null>(null);

	async function getMe() {
		if (authCtx) {
			const response = await Fetch.fetch(authCtx.token, "GET", `users/block`, +authCtx.userId);
			setMe(response);
		}
	};

	useEffect(() => {
		getMe();
	}, [props.chat]);

  const amIBlocked = (userXid: number): string => {
  if (me && userXid && me?.blockedFrom.find((u: UserChat) => +u.id === +userXid))
      { return "users-list-blocked"; }
    else
      {return "users-list";}
  };

	return (
		<>
		<h2 className="title-users">{props.title} - <span>{props.users.length}</span></h2>
			{props.users.map((user: UserChat) => (
				<ListItem key={user.id} className={amIBlocked(user.id)}>
					<div className='avatar-username-inlist'>
						<ListItemAvatar>
							<Avatar variant="rounded" className="users-chatlist-avatar"  src={user.avatar ? user.avatar : user.ftAvatar} />
						</ListItemAvatar>
						<div className="dicuss-link" onClick={props.chat.isHeBlocked(user.id) ? () => props.chat.getDirect(user) : undefined}>
							{user.username}
						</div>
					</div>
					<br />
					{ amIBlocked(user.id) === 'users-list-blocked' ? (
						<FontAwesomeIcon icon={faBan} className={`btn-chatlist-disable`} />
					) : props.isHeBlocked(user.id) ? (
						<>
						<div className='btn-inlist'>
							<Tooltip title="Block">
								<FontAwesomeIcon icon={faBan} onClick={() => {props.chat.setToBlock(props.chat.getUser(user.id))}} className={`btn-chatlist`}/>
							</Tooltip>
							{!props.offlineFriends && (
							<Tooltip title="Invite to Play">
								<Link to={'/game/'} className='violet-icon' onClick={() => props.chat.inviteGame(user.id)}>
								<FontAwesomeIcon icon={faTableTennisPaddleBall} className={`btn-chatlist`}/>
								</Link>
							</Tooltip>
							)}
						</div>
						</>
						) : (
						<FontAwesomeIcon icon={faBan} onClick={() => {props.chat.setToUnblock(props.chat.getUser(user.id))}} className={`btn-chatlist-clicked`}/>
						)}
				</ListItem>
			))}
		</>
	);
}

export default UsersAction;
