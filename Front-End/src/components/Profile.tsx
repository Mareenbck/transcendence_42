import './Profile.css'
import '../App.tsx'
import React, { useState, useEffect } from 'react'


const Profile = () =>  {
	const [message, setMessage] = useState('You are not logged in');
	const [username, setUsername] = useState('');

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			const fetchHandler = async () => {
				try {
					const response = await fetch('http://localhost:3000/users/profile', {
						headers: {
							Authorization: `Bearer ${token}`
						}
					});
					const data = await response.json();
					setMessage(data.username);
					setUsername(data.username);
				} catch (error) {
					console.log(error);
				}
			};
			fetchHandler();
		}
	}, [username]);

	return (
		<div>
			<h2>Profile</h2>
			<h4>{message}</h4>
			<p>Welcome, {username}!</p>
			{/* <Link to="/chat/message" className='btn-sign'>Chat</Link> */}

		</div>
	);
}

export default Profile
