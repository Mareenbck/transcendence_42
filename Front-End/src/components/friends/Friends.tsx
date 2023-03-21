import React, { FormEvent, useContext, useEffect, useRef, useState } from 'react';
import AuthContext from '../../store/AuthContext';
import SideBar from '../auth/SideBar';
import { Link, Navigate, useNavigate } from "react-router-dom";
import style from '../../style/Menu.module.css';
import '../../style/Friends.css';



const Friends = () => {
	const [friends, setFriends] = useState<any[]>([]);
	const authCtx = useContext(AuthContext);

	// const isLoggedIn = authCtx.isLoggedIn;
	const currentUserId = authCtx.userId;

	const onlineFriends = friends.filter(friend => friend.status === 'ONLINE');
	const offlineFriends = friends.filter(friend => friend.status === 'OFFLINE');
	const playingFriends = friends.filter(friend => friend.status === 'PLAYING');


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
				setFriends(data);
			}
			fetchUsers();
		}, [])

	return (
		<>
		<div className= {style.mainPos}>
			<div className='global'>
				<SideBar title="Welcome" />
				<div className="User">
					<h1 className='h1'>USERS LIST</h1>
					<div className='line'></div>
					<h2 className="title">Online Users :</h2>
					<ul>
						{onlineFriends.map(friend => (
							<li key={friend.id} className='friend'>
								{friend.avatar ? <img className='avatar-img' src={friend.avatar} alt={"avatar"} /> : <img className='avatar-img' src={friend.ftAvatar} alt={"ftAvatar"} />}
								<span className='friend-username'>{friend.username}</span>
								<form onSubmit={(event) => handleDemand(event, friend.id)}>
									<button type="submit" className='add-friend'><i className="fa-solid fa-user-plus"></i></button>
								</form>
								<Link to="/chat/message">
								<i className="fa-solid fa-comments"></i>
								</Link>
							</li>
						))}
					</ul>
					<h2 className="title" >Offline Users :</h2>
					<ul>
						{offlineFriends.map(friend => (
						<li key={friend.id}><img src={friend.avatar}></img>{friend.username}</li>))}
					</ul>
					<h2 className="title">Playing Users :</h2>
					<ul>
						{playingFriends.map(friend => (
						<li key={friend.id}><img src={friend.avatar}></img>{friend.username}</li>))}
					</ul>
				</div>
			</div>
		</div>
		</>
	  );

}

export default Friends;
