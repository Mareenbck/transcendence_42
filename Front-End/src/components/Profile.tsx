import './Profile.css'
import '../App.tsx'
import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";


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
		<div className="mne">
			<h2>Profile</h2>
			<h4>{message}</h4>
			<p>Welcome, {username}!</p>
			<Link to="/chat/message">Chat</Link>
			<br /><br />
			<div className="buttons">
				<Link to="/auth/signin" className='btn-sign' onClock={window.localStorage.clear()}>Log<span>Out</span></Link>	
			</div>
		</div>
	);
}

export default Profile
