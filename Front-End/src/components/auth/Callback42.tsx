import React, { useContext, useEffect } from 'react';
import AuthContext from '../../store/AuthContext';

function Callback42() {
	const authCtx = useContext(AuthContext);

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');

		const fetchCall = async () => {
			try {
					const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/auth/42/callback', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ code })
				});

				const data = await response.json();
				if (response.ok) {
					const username = data.user.username;
					const avatar = data.user.avatar;
					const ftAvatar = data.user.ftAvatar;
					localStorage.setItem('userId', data.user.id);
					localStorage.setItem('username', username);
					localStorage.setItem('avatar', avatar);
					localStorage.setItem('ftAvatar', ftAvatar);
					localStorage.setItem('is2FA', data.user.twoFA);
					const twofa: any = await authCtx.login(data.newtokens.access_token, data.user.id, data.newtokens.refresh_token);
					if (data.user.twoFA) {
						window.close();
						window.opener.location.href = "/auth/2fa";
					} else {
						window.close();
					}
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
