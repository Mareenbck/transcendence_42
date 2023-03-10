import React, { FormEvent, useEffect, useRef, useState } from 'react';
import '../style/Settings.css'
import { Link } from "react-router-dom";
import AuthContext from '../store/AuthContext';
import { useContext } from "react";
import SideBar from '../components/auth/SideBar'
import style from '../style/Menu.module.css'


const Setting = () => {
	const authCtx = useContext(AuthContext);
	const id = authCtx.userId;
	const isLoggedIn = authCtx.isLoggedIn;
	const usernameInputRef = useRef<HTMLInputElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [username, setUsername] = useState<string | null>(authCtx.username);
	const [isTwoFAEnabled, setIsTwoFAEnabled] = useState(false);
	const [selectedFile, setSelectedFile] = useState('');

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		// Vous pouvez envoyer le fichier sélectionné au serveur ici
		const formData = new FormData();
		formData.append("file", selectedFile);
		try {
			const response = await fetch(`http://localhost:3000/users/upload`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${authCtx.token}`,
				},
				body: formData,
			})
			const data = await response.json();
			if (!response.ok) {
				console.log("POST error on ${userId}/username ");
				return "error";
			}
			authCtx.fetchAvatar(data.id);
			localStorage.setItem("avatar", data.avatar);
			return "success";
		} catch (error) {
			return console.log("error", error);
		}
	};

	const handleFileChange = (event: FormEvent<HTMLInputElement>) => {
		setSelectedFile(event.target.files[0]);
	};

	const handleRestore = async (event: FormEvent) => {
		event.preventDefault();
		try {
			const response = await fetch(`http://localhost:3000/users/restore`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${authCtx.token}`,
				},
			})
			const data = await response.json();
			if (!response.ok) {
				console.log("POST error on /restore ");
				return "error";
			}
			authCtx.updateAvatar('');
			localStorage.setItem("avatar", "");
			return "success";
		} catch (error) {
			return console.log("error", error);
		}


	}

	const handleUsername = async (event: FormEvent) => {
		event.preventDefault();
		const newUsername = usernameInputRef.current!.value;
		const userId = authCtx.userId;
		try {
			const response = await fetch(`http://localhost:3000/users/${userId}/username`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${authCtx.token}`,
				},
				body: JSON.stringify({username: newUsername}),
			})
			await response.json();
			if (!response.ok) {
				console.log("POST error on ${userId}/username ");
				return "error";
			}
			localStorage.setItem("username", newUsername);
			return "success";
		} catch (error) {
			return console.log("error", error);
		}
	}

	const handle2FA = async (event: FormEvent) => {
		event.preventDefault();
		try {
			const response = await fetch(`http://localhost:3000/auth/2fa/turn-on`,{
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

	const handle2FAOff = async (event: FormEvent) => {
		event.preventDefault();
		try {
			const response = await fetch(`http://localhost:3000/auth/2fa/turn-off`,{
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

	useEffect(() => {
		if (isTwoFAEnabled) {
		  alert('Two-factor authentication has been enabled');
		}
	  }, [isTwoFAEnabled]);

	return(
		<>
			<div className={style.mainPos}>
				<SideBar title="Settings" />
			<div className="contain-set">
				<div className="section">
					<h3>USERNAME</h3>
					<p>Your username has to be unique and at most 20 characters long</p>
					<form onSubmit={handleUsername} className="form-set">
						<input id="username" ref={usernameInputRef} placeholder="Change your name..."/>
						<button type="submit">Submit</button>
					</form>
				</div>
				<div className="section">
					<h3>AVATAR</h3>
					<p>The image needs to be a .jpg file and can have a maximum size of 5MB</p>
					<div className="form-set">
						<form onSubmit={handleSubmit}>
							<input type="file" onChange={handleFileChange} />
							<button type="submit">Upload</button>
						</form>
						<form onSubmit={handleRestore}>
							<button type="submit">Restore</button>
						</form>
					</div>
				</div>
				<div className="section">
					<h3>2FA</h3>
					<p>With 2 factor of authentification, an extra layer of security is added to your account to prevent someone from logging in, event if they have your passowrd. This extra security measure requires you to verify your identity using a randomized 6-digit code generated by the Google authentificator App to log in</p>
					<div className="form-set">
						<form onSubmit={handle2FA} >
							<button type="submit">Enable</button>
						</form>
						<form onSubmit={handle2FAOff}>
							<button type="submit">Disable</button>
						</form>
					</div>
				</div>
			</div>
			</div>
		</>
	)

}
export default Setting;
