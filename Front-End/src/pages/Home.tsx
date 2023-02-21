import React, { useState, useEffect } from 'react';
import '../style/Home.css'
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
	<main className='App'>
		<div className="container">
			<div className="content">
				<h1>Transcendence</h1>
			</div>
			<div className="buttons">
				<Link to="/auth/signup" className='btn-sign'>Sign <span>UP</span></Link>
				<Link to="/auth/signin" className='btn-sign'>Sign <span>IN</span></Link>
				{/* <Link to="/chat/message" className='btn-sign'>Chat</Link> */}
				<Link to="/" className='btn-sign'>Log <span>42</span></Link>
			</div>
		</div>
	</main>
	)
}

export default Home;
