import React, { FormEvent, useContext, useEffect, useState } from 'react';
import AuthContext from '../../store/AuthContext';
import { Link } from "react-router-dom";
import '../../style/Friends.css';
import { Container } from '@mui/material';
import MyAvatar from '../user/Avatar';
import { ListItem } from '@mui/material';
import { ListItemText } from '@mui/material';
import { ListItemAvatar } from '@mui/material';
import { List } from '@mui/material';
import { FriendContext } from '../../store/FriendshipContext';
import Friend from '../../interfaces/IFriendship'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import PersonAddIcon from '@mui/icons-material/PersonAdd';


const Friends = () => {
	const [friends, setFriends] = useState<any[]>([]);
	const authCtx = useContext(AuthContext);
	const friendCtx = useContext(FriendContext);

	const currentUserId = authCtx.userId;
	const onlineFriends = friends.filter(friend => friend.status === 'ONLINE' && friend.id !== parseInt(currentUserId));
	const offlineFriends = friends.filter(friend => friend.status === 'OFFLINE'&& friend.id !== currentUserId);
	const playingFriends = friends.filter(friend => friend.status === 'PLAYING'&& friend.id !== currentUserId);

	const handleDemand = async (event: FormEvent, receiverId: number) => {
		event.preventDefault();
		try {
			const response = await fetch(`http://localhost:3000/friendship/create`,{
				method: 'POST',
				headers: {
				  'Content-Type': 'application/json',
				  Authorization: `Bearer ${authCtx.token}`,
				},
				body: JSON.stringify({requesterId: currentUserId, receiverId: receiverId}),
			});
			await response.json();
			if (!response.ok) {
				console.log("POST error on /friendship/create");
				return "error";
			  }
		} catch (error) {
			console.log("error", error);
		  }
		}

		useEffect(() => {
			const url = "http://localhost:3000/users/";
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
		<Container maxWidth="sm">
			<h2 className="title-users">Online</h2>
			<List>
				{onlineFriends.map(user => (
					<ListItem key={user.id}>
						<ListItemAvatar>
							<MyAvatar style="s" authCtx={authCtx} alt={"avatar"} avatar={user.avatar} ftAvatar={user.ftAvatar} id={user.id} />
						</ListItemAvatar>
						<Link to={`/users/profile/${user.id}`} className="profile-link">{user.username}</Link>
						<br />
						<div onClick={(event: FormEvent) => { handleDemand(event, user.id) }} className='add-friend'>
							<PersonAddIcon />
						</div>
						<Link to="/chat/message" className='add-friend'> <ChatBubbleIcon /></Link>
					</ListItem>
				))}
			</List>
					<h2 className="title-users" >Offline</h2>
					<ul>
						{offlineFriends.map(friend => (
							<li key={friend.id}><img src={friend.avatar}></img>{friend.username}</li>))}
					</ul>
					<h2 className="title-users">Playing</h2>
					<ul>
						{playingFriends.map(friend => (
							<li key={friend.id}><img src={friend.avatar}></img>{friend.username}</li>))}
					</ul>
			</Container>
		</>
	  );

}

export default Friends;
