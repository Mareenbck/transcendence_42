import React, { FormEvent, useContext, useRef, useState } from "react";
import AuthContext from "../../store/AuthContext";
import { Navigate } from 'react-router-dom';


export function TwoFaForm (){
	const digitCodeInputRef = useRef<HTMLInputElement>(null);

	const [qrCodeUrl, setQrCodeUrl] = useState(null);
	const [redirectToHome, setRedirectToHome] = useState(false);

	const authCtx = useContext(AuthContext);

	const handleSubmit = async (event: any) => {
		event.preventDefault();
		const response = await fetch('http://localhost:3000/auth/2fa/authenticate', {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authCtx.token}`,
			},
			body: JSON.stringify({twoFAcode: digitCodeInputRef.current!.value}),
		});
		const data = await response.json();
		if (data.access_token) {
			setRedirectToHome(true);
		} else {
			alert("Le code saisi est incorrect.");
		}
	}

	// const handleSubmit = async (event: any) => {
	// 	event.preventDefault();
	// 	const response = await fetch('http://localhost:3000/auth/2fa/turn-on', {
	// 		method: "POST",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 			Authorization: `Bearer ${authCtx.token}`,
	// 		},
	// 		body: JSON.stringify({twoFAcode: digitCodeInputRef.current!.value}),
	// 	});
	// 	const data = await response.json();
	// 	if (data.access_token) {
	// 		setRedirectToHome(true);
	// 	} else {
	// 		alert("Le code saisi est incorrect.");
	// 	}
	// }

	async function generateQRCode() {
		const response = await fetch('http://localhost:3000/auth/2fa/generate', {
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
					<button className="submit-form" type="submit"> <i className="fa-solid fa-arrow-right"></i> Submit</button>
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
