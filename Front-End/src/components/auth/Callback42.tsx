import React, { useContext, useEffect } from 'react';
import AuthContext from '../../store/AuthContext';

function Callback42() {
	const authCtx = useContext(AuthContext);

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');

		const fetchCall = async () => {
			try {
					const response = await fetch('http://localhost:3000/auth/42/callback', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ code })
				});

				const data = await response.json();

				if (response.ok) {
					const token = data.tokens.access_token;
					const userId = data.user.id;
					const userId42 = data.user.id42;
					const username = data.user.username;
					localStorage.setItem('token', token);
					localStorage.setItem('userId', userId);
					localStorage.setItem('userId42', userId42);
					localStorage.setItem('username', username);
					authCtx.login(token, userId);
					window.close();
				} else {
					console.log("Le code saisi est incorrect.");
				}
			} catch(error) {
				console.log(error);
			}
		};
		fetchCall();
	}, []);

	return (
		<>
			<div>Authorizing...</div>
		</>
	)
}

export default Callback42;
