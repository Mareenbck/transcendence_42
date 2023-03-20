import React, { FormEvent, useContext, useEffect, useRef, useState } from 'react';
import AuthContext from '../../store/AuthContext';


const Friends = () => {
	const [friends, setFriends] = useState<any[]>([]);
	const authCtx = useContext(AuthContext);

	const onlineFriends = friends.filter(friend => friend.status === 'ONLINE');
	const offlineFriends = friends.filter(friend => friend.status === 'OFFLINE');
	const playingFriends = friends.filter(friend => friend.status === 'PLAYING');

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
			console.log("RESPONSE")
			console.log(response)
			const data = await response.json();
			console.log("DATA")
			console.log(data)
			setFriends(data);		
		}
		fetchUsers();
	}, [])

	return (
		<div className="User">
		  <h2>Online Users :</h2>
		  <ul>
			{onlineFriends.map(friend => (
			  <li key={friend.id}>{friend.username}</li>
			))}
		  </ul>
		  <h2>Offline Users :</h2>
		  <ul>
			{offlineFriends.map(friend => (
			  <li key={friend.id}>{friend.username}</li>
			))}
		  </ul>
		  <h2>Playing Users :</h2>
		  <ul>
			{playingFriends.map(friend => (
			  <li key={friend.id}>{friend.username}</li>
			))}
		  </ul>
		</div>
	  );
	  
}

export default Friends;