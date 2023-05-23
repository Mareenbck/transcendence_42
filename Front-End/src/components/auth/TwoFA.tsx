import React, { FormEvent, useContext, useRef, useState } from "react";
import AuthContext from "../../store/AuthContext";
import { Navigate } from 'react-router-dom';
import useSocket from '../../service/socket';

export function TwoFaForm (){
	const digitCodeInputRef = useRef<HTMLInputElement>(null);

	const [qrCodeUrl, setQrCodeUrl] = useState(null);
	const [redirectToHome, setRedirectToHome] = useState(false);

	const authCtx = useContext(AuthContext);
	const [sendMessage, addListener] = useSocket();


	const handleSubmit = async (event: any) => {
		event.preventDefault();
		const digitCode = digitCodeInputRef.current!.value;
		if (digitCode === '') {
			alert("Le code saisi est vide");
			return;
		}
		const response = await fetch("http://" + window.location.hostname + ':3000' + '/auth/2fa/authenticate', {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authCtx.token}`,
			},
			body: JSON.stringify({twoFAcode: digitCodeInputRef.current!.value}),
		});
		const data = await response.json();
		if (data.access_token) {
			authCtx.setUserIsLoggedIn(true);
			localStorage.setItem('userIsLoggedIn', JSON.stringify(true));
			setRedirectToHome(true);
		} else {
			alert("Le code saisi est incorrect.");
		}
	}

	const handleLogin = (e: FormEvent) => {
		sendMessage("login", authCtx.userId as any)
		handleSubmit(e)
	}

	async function generateQRCode() {
		const response = await fetch("http://" + window.location.hostname + ':3000' + '/auth/2fa/generate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${authCtx.token}`,
			},
			body: JSON.stringify(authCtx),
		});
		if (!response.ok) {
			throw new Error(`Failed to generate QR code: ${response.statusText}`);
		}
		const data = await response.json();
		setQrCodeUrl(data);
	}

	return (
		<>

		{redirectToHome && <Navigate to="/menu" />}
		<div className="container-form">
			<h1 className='title-form'>Insert your code</h1>
			<div className="border-form">
				<form onSubmit={handleSubmit}>
				<div className="form-input">
					<label htmlFor="floatingInput">6 digits code</label>
					<input type="digit-code" ref={digitCodeInputRef} className="form-fields" placeholder="6 digits code" />
				</div>
				<div className="position">
					<button className="submit-form" type="submit" onClick={handleLogin}> <i className="fa-solid fa-arrow-right"></i> Submit</button>
				</div>
				</form>
				<div>
					<button onClick={generateQRCode}>Generate QR Code</button>
					{qrCodeUrl && (<img src={qrCodeUrl} alt="QR Code" />)}
					</div>
			</div>
		</div>
		</>
		)
}

export default TwoFaForm;
