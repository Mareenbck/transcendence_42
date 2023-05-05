import React from 'react';
import { Link } from "react-router-dom";
import { Avatar, ListItem, Tooltip } from '@mui/material';
import { ListItemAvatar } from '@mui/material';
import { faBan, faTableTennisPaddleBall } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Friend from '../interfaces/IFriendship';
import { UserChat } from '../../../interfaces/iChat';

const UsersAction = (props: any) => {

	return (
		<>
		<h2 className="title-users">{props.title} - <span>{props.users.length}</span></h2>
			{props.users.map((user: UserChat) => (
				<ListItem key={user.id} className='users-list'>
					<div className='avatar-username-inlist'>
						<ListItemAvatar>
							<Avatar variant="rounded" className="users-chatlist-avatar"  src={user.ftAvatar ? user.ftAvatar : user.avatar} />
						</ListItemAvatar>
						<div className="dicuss-link" onClick={props.isHeBlocked(user.id) ? () => props.getDirect(user) : undefined}>
							{user.username}
						</div>
					</div>
					<br />
					{props.isHeBlocked(user.id) ?
						<>
						<div className='btn-inlist'>
							<Tooltip title="Block">
								<FontAwesomeIcon icon={faBan} onClick={() => {props.setToBlock(props.getUser(user.id))}} className={`btn-chatlist`}/>
							</Tooltip>
							<Tooltip title="Invite to Play">
								<Link to={'/game/'}  className='violet-icon' onClick={() => props.inviteGame(user.id)}>
									<FontAwesomeIcon icon={faTableTennisPaddleBall} className={`btn-chatlist`}/>
								</Link>
							</Tooltip>
						</div>
						</>
						: <FontAwesomeIcon icon={faBan} onClick={() => {props.setToUnblock(props.getUser(user.id))}} className={`btn-chatlist-clicked`}/>
					}
				</ListItem>
			))}
		</>
	);
}

export default UsersAction;
