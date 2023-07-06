import { useContext, useEffect, useState } from 'react';
import { Switch } from '@mui/material';
import React from 'react';
import AuthContext from '../../store/AuthContext';
import '../../style/Switch2FA.css';

const Switch2FA = (props: any) => {
	const authCtx = useContext(AuthContext);
	const [isTwoFAEnabled, setIsTwoFAEnabled] = useState(props.is2FAEnabled);

	useEffect(() => {
		setIsTwoFAEnabled(props.is2FAEnabled);
	}, [props.is2FAEnabled]);

	const handle2FA = (event: React.ChangeEvent<HTMLInputElement>) => {
		setIsTwoFAEnabled((prevIsTwoFAEnabled: any) => !prevIsTwoFAEnabled);
		if (!isTwoFAEnabled) {
			activate2FA();
			props.onTwoFAChange(event.target.checked);
		} else {
			desactivate2FA();
			props.onTwoFAChange(event.target.checked);
		}
	};

	const activate2FA = async () => {
		try {
			const response = await fetch("http://" + window.location.hostname + ':3000'  + `/auth/2fa/turn-on`, {
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
		try {
			const response = await fetch("http://" + window.location.hostname + ':3000'  + `/auth/2fa/turn-off`, {
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
