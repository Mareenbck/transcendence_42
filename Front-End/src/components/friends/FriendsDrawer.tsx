import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../store/AuthContext';
import '../../style/Friends.css';
import { Container } from '@mui/material';
import { FriendContext } from '../../store/FriendshipContext';
import Friend from '../../interfaces/IFriendship'
import FriendsList from './FriendsList';

const Friends = () => {
	const [friends, setFriends] = useState<any[]>([]);
	const authCtx = useContext(AuthContext);
	const friendCtx = useContext(FriendContext);

	const currentUserId = authCtx.userId;
	const onlineFriends = friends.filter(friend => friend.status === 'ONLINE' && friend.id !== parseInt(currentUserId));
	const offlineFriends = friends.filter(friend => friend.status === 'OFFLINE'&& friend.id !== currentUserId);
	const playingFriends = friends.filter(friend => friend.status === 'PLAYING'&& friend.id !== currentUserId);

	useEffect(() => {
		const url = "http://" + window.location.hostname + ':3000'  + "/users/";
		const fetchUsers = async () => {
			const response = await fetch(
				url,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${authCtx.token}`
					}
				}
			)
			const data = await response.json();
			const updatedFriends = await Promise.all(data.map(async (friend: Friend) => {
				const avatar = await friendCtx.fetchAvatar(friend.id);
				return { ...friend, avatar };
			}));
			setFriends(updatedFriends);
		}
		fetchUsers();
	}, [])

	return (
		<>
		<div className='contain-drawer'>
			<div className='title-drawer'>
				<h2>Members</h2>
			</div>
			<Container maxWidth="sm">
				<FriendsList title="Online" users={onlineFriends} />
				<FriendsList title="Offline" users={offlineFriends} />
				<FriendsList title="Playing" users={playingFriends} />
			</Container>
		</div>
		</>
	  );

}

export default Friends;
