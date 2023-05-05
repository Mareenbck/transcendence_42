import React, { useContext, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Avatar, ListItem, Tooltip } from '@mui/material';
import { ListItemAvatar } from '@mui/material';
import { faBan, faTableTennisPaddleBall } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Friend from '../interfaces/IFriendship';
import { UserChat } from '../../../interfaces/iChat';
import AuthContext from '../../../store/AuthContext';
import Fetch from '../../../interfaces/Fetch';
import useSocket from '../../../service/socket';

const UsersAction = (props: any) => {
	const authCtx = useContext(AuthContext);
	const [me, setMe] = useState<UserChat | null>(null);

	console.log("props --->")
	console.log(props)

	// pour le mécanisme des blocked,j'ai besoin de ME as user puisque je ne suis pas dans allWith direct messsage
	async function getMe() {
		if (authCtx) {
			const response = await Fetch.fetch(authCtx.token, "GET", `users/block`, +authCtx.userId);
			setMe(response);
		}
	};
	const [unfromBlock, setUnfromBlock] = useState<number | null>();
	const [sendMessage, addListener] = useSocket();
	const [fromBlock, setFromBlock] = useState<number | null>(null);
	const [blockForMe, setBlockForMe] = useState<number | null>();
	const [unblockForMe, setUnblockForMe] = useState<number | null>();

	useEffect(() => {
		getMe();
	}, [unfromBlock, fromBlock, blockForMe, unblockForMe]);

	useEffect(() => {
		addListener("wasUnblocked", data => {
		  if (+data.id !== +authCtx.userId)
		  { setUnfromBlock(+data.id);}
		});
	  });

	  useEffect(() => {
		addListener("wasBlocked", data => {
		  if (+data.id !== +authCtx.userId)
		  { setFromBlock(+data.id);}
		});
	  });
	  useEffect(() => {
		addListener("blockForMe", data => {
		  if (+data.id !== +authCtx.userId)
			{ setBlockForMe(+data.id);}
		});
	  });
	  useEffect(() => {
		addListener("unblockForMe", data => {
		  if (+data.id !== +authCtx.userId)
			{ setUnblockForMe(+data.id);}
		});
	  });

  // suis-je bloqué
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
							<Avatar variant="rounded" className="users-chatlist-avatar"  src={user.ftAvatar ? user.ftAvatar : user.avatar} />
						</ListItemAvatar>
						<div className="dicuss-link" onClick={props.isHeBlocked(user.id) ? () => props.getDirect(user) : undefined}>
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
								<FontAwesomeIcon icon={faBan} onClick={() => {props.setToBlock(props.getUser(user.id))}} className={`btn-chatlist`}/>
							</Tooltip>
							<Tooltip title="Invite to Play">
								<Link to={'/game/'}  className='violet-icon' onClick={() => props.inviteGame(user.id)}>
									<FontAwesomeIcon icon={faTableTennisPaddleBall} className={`btn-chatlist`}/>
								</Link>
							</Tooltip>
						</div>
						</>
						) : (
						<FontAwesomeIcon icon={faBan} onClick={() => {props.setToUnblock(props.getUser(user.id))}} className={`btn-chatlist-clicked`}/>
						)}
				</ListItem>
			))}
		</>
	);
}

export default UsersAction;
