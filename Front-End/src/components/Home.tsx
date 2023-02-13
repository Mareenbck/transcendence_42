import React, { useState, useEffect } from 'react';
import './Home.css'
import { Link } from "react-router-dom";

function Home() {
	const [username, setUsername] = useState('');

	useEffect(() => {
		const cookies = document.cookie.split(';');
		console.log(cookies);
		const cookie = cookies.find(c => c.trim().startsWith('username='));
		if (cookie) {
			setUsername(cookie.split('=')[1]);
		}
	}, []);


	return (
		<div className="App">
			<h1>Transcendence</h1>
			<Link to="/auth/signin" className='btn'>Login</Link>
			<Link to="/auth/signup" className='btn'>Sign-up</Link>
			<Link to="/chat/message" className="btn">Chat</Link>
			<div className='btn'>User42</div>
		</div>
	)
}

export default Home;
