import { useContext, useEffect, useState } from 'react';
import { Switch } from '@mui/material';
import React from 'react';
import AuthContext from '../../store/AuthContext';
import '../../style/Switch2FA.css';

const Switch2FA = (props: any) => {
	const authCtx = useContext(AuthContext);
	const [isTwoFAEnabled, setIsTwoFAEnabled] = useState(false);

	useEffect(() => {
		fetchIs2FA(authCtx.token);
	}, [isTwoFAEnabled]);

	const fetchIs2FA = async (token: string) => {
		try {
			const response = await fetch(`http://localhost:3000/auth/2fa`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (!response.ok) {
				return "error"
			}
			const data = await response.json()
			setIsTwoFAEnabled(data);
			return "success";
		} catch (error) {
			return console.log("error", error);
		}
	}

	const handle2FA = () => {
		setIsTwoFAEnabled((prevIsTwoFAEnabled) => !prevIsTwoFAEnabled);
		if (!isTwoFAEnabled) {
			activate2FA();
		} else {
			desactivate2FA();
		}
	};


	const activate2FA = async () => {
		// event.preventDefault();
		try {
			const response = await fetch(`http://localhost:3000/auth/2fa/turn-on`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${authCtx.token}`,
				},
				body: JSON.stringify({}),
			})
			if (!response.ok) {
				console.log("POST error on /auth/2fa/turn-on");
				return "error";
			}
			setIsTwoFAEnabled(true);
		} catch (error) {
			console.log("error", error);
		}
	}

	const desactivate2FA = async () => {
		// event.preventDefault();
		try {
			const response = await fetch(`http://localhost:3000/auth/2fa/turn-off`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${authCtx.token}`,
				},
				body: JSON.stringify({}),
			})
			if (!response.ok) {
				console.log("POST error on /auth/2fa/turn-off");
				return "error";
			}
			setIsTwoFAEnabled(false);
		} catch (error) {
			console.log("error", error);
		}
	}

	return (
		<Switch
			checked={isTwoFAEnabled}
			onChange={handle2FA}
			name="toggle-switch"
			className="custom-switch"
		/>
	)
}

export default Switch2FA;
