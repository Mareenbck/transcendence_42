import React, { useState, useEffect } from 'react';

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
		<div>
			<h1>HELLO {username} </h1>
			{username && <p>Welcome, {username}!</p>}
		</div>
	)
}

export default Home;
