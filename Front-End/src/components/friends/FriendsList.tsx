import React, { FormEvent, useContext, useState } from 'react';
import AuthContext from '../../store/AuthContext';
import { Link } from "react-router-dom";
import '../../style/Friends.css';
import MyAvatar from '../user/Avatar';
import { ListItem } from '@mui/material';
import { ListItemAvatar } from '@mui/material';
import { Snackbar } from '@mui/material';
import { faUserPlus, faComment } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useSocket from '../../service/socket';
import { FriendContext } from '../../store/FriendshipContext';
import Friend from '../../interfaces/IFriendship';

const FriendsList = (props: any) => {
	const authCtx = useContext(AuthContext);
	const friendCtx = useContext(FriendContext);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [sendMessage, addListener] = useSocket();

	const currentUserId = authCtx.userId;

	const handleCloseSnackbar = () => {
		setSnackbarOpen(false);
	}

	const handleDemand = async (event: FormEvent, receiverId: number) => {
		event.preventDefault();
		try {
			const response = await fetch("http://" + window.location.hostname + ':3000'  + `/friendship/create`,{
				method: 'POST',
				headers: {
				  'Content-Type': 'application/json',
				  Authorization: `Bearer ${authCtx.token}`,
				},
				body: JSON.stringify({requesterId: currentUserId, receiverId: receiverId}),
			});
			const data = await response.json();
			setSnackbarOpen(true);
			sendMessage('createDemand', data.receiverId);
			if (!response.ok) {
				console.log("POST error on /friendship/create");
				return "error";
			}
		} catch (error) {
			console.log("error", error);
		}
	}

	const isFriend = (userId: any) => {
		return friendCtx.friends.some((friend) => friend.id === userId);
	  };


	return (
		<>
			<h2 className="title-users">{props.title} - <span>{props.users.length}</span></h2>
				{props.users.map((user: Friend) => (
					<ListItem key={user.id} className='users-list'>
						<div className='avatar-username-inlist'>
							<ListItemAvatar>
								<MyAvatar style="s" authCtx={authCtx} alt={"avatar"} avatar={user.avatar} ftAvatar={user.ftAvatar} id={user.id} />
							</ListItemAvatar>
							<Link to={`/users/profile/${user.id}`} className="profile-link">{user.username}</Link>
						</div>
						<br />
						<div className='btn-inlist'>
							<FontAwesomeIcon
								icon={faUserPlus}
								onClick={(event: FormEvent) => { handleDemand(event, user.id) }}
								className={`add-friend ${isFriend(user.id) ? 'disabled' : ''}`}
								/>
							<Snackbar
								anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
								open={snackbarOpen}
								autoHideDuration={1000}
								onClose={handleCloseSnackbar}
								message="Request sent"
								/>
							<Link to="/chat/message"> <FontAwesomeIcon icon={faComment} className='add-friend'/></Link>
						</div>
					</ListItem>
				))}
		</>
	  );

}

export default FriendsList;
