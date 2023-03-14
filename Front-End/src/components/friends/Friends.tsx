import React, { FormEvent, useContext, useEffect, useRef, useState } from 'react';
import AuthContext from '../../store/AuthContext';


const Friends = () => {
	const [friends, setFriends] = useState<any[]>([]);
	const authCtx = useContext(AuthContext);
	const friendsList = localStorage.getItem('userlist');
	const isLoggedIn = authCtx.isLoggedIn;

	useEffect(() => {
		const url = "http://localhost:3000/users/test";
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
		<div className="User"> 
			User list : 
			<ul>
				{friends.map((friend) => (
					<li key={friend.id}>friends ={friend.name}</li>
				))}
			</ul>

		</div>
	);
}

export default Friends;