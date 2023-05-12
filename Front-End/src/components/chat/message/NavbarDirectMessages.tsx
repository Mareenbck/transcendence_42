import React, { FormEvent } from "react";
import { useContext, useEffect, useState } from "react";
import Avatar from '@mui/material/Avatar';
import '../../../style/NavbarChannel.css';
import { FriendContext } from "../../../store/FriendshipContext";
import AuthContext from "../../../store/AuthContext";
import { faUserPlus, faAddressCard, faCircle, faBan, faTableTennisPaddleBall } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Snackbar, Tooltip } from '@mui/material';
import { Link } from "react-router-dom";

export function NavbarChannel(props: any) {
	const friendCtx = useContext(FriendContext);
	const authCtx = useContext(AuthContext);
	const [icon, setIcon] = useState<any>();
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [status, setStatus] = useState<string>('');

	const handleCloseSnackbar = () => {
		setSnackbarOpen(false);
	}

	const fetchAvatar = async (id: string) => {
		const avat: any = await friendCtx.fetchAvatar(parseInt(id));
		if (avat) {
			setIcon(avat);
		}
	};

	useEffect(() => {
		if (props.currentDirect.ftAvatar) {
			setIcon(props.currentDirect.ftAvatar);
		} else {
			fetchAvatar((props.currentDirect.id))
		}
		if (props.currentDirect.status === 'ONLINE') {
			setStatus('online')
		} else if (props.currentDirect.status === 'OFFLINE') {
			setStatus('offline')
		} else {
			setStatus('playing')
		}
	}, [props.currentDirect])

	const handleDemand = async (event: FormEvent, receiverId: number) => {
		event.preventDefault();
		friendCtx.createDemand(receiverId, authCtx.userId)
		setSnackbarOpen(true);
	}

	const isFriend = (userId: any) => {
		return friendCtx.friends.some((friend) => friend.id === userId);
	};

	return (
		<div className="navbar-channel">
			<Avatar variant="rounded" className="channel-avatar-navbar"  src={icon} />
			<div className="name-channel">
				<h4>{props.currentDirect.username}</h4>
				<div className="status-navbar">
					<FontAwesomeIcon icon={faCircle} className={`statusChat-${status}`}/>
					<p>{props.currentDirect.status}</p>
				</div>
			</div>
			<div className="btn-admin-channel">
				<Tooltip title="Add Friend">
					<FontAwesomeIcon
						icon={faUserPlus}
						onClick={(event: FormEvent) => { handleDemand(event, props.currentDirect.id) }}
						className={`add-friend-navbar-chat ${isFriend(props.currentDirect.id) ? 'disabled' : ''}`}
						/>
				</Tooltip>
				<Snackbar
					anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
					open={snackbarOpen}
					autoHideDuration={1000}
					onClose={handleCloseSnackbar}
					message="Request sent"
					/>
				<Tooltip title="Profile page">
					<Link to={`/users/profile/${props.currentDirect.id}`}>
						<FontAwesomeIcon icon={faAddressCard} className={`add-friend-navbar-chat`} />
					</Link>
				</Tooltip>
				<Tooltip title="Block">
					<FontAwesomeIcon icon={faBan} onClick={() => {props.setToBlock(props.getUser(props.currentDirect.id))}} className={`add-friend-navbar-chat`}/>
				</Tooltip>
				<Tooltip title="Invite to Play">
					<Link to={'/game/'}  className='violet-icon' onClick={() => props.inviteGame(props.currentDirect.id)}>
						<FontAwesomeIcon icon={faTableTennisPaddleBall} className={`add-friend-navbar-chat`}/>
					</Link>
				</Tooltip>
			</div>
		</div>
	);
}
export default NavbarChannel;
