import React, { FormEvent, useContext, useEffect, useRef, useState } from 'react';
import ErrorModal from './ErrorModal';
import '../../style/Form.css'
import AuthContext from '../../store/AuthContext';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import useSocket from "../../service/socket";

interface ErrorMsg {
	title: string;
	message: string
}

function AuthForm() {
	const emailInputRef = useRef<HTMLInputElement>(null);
	const passwordInputRef = useRef<HTMLInputElement>(null);
	const usernameLocalStorage = localStorage.getItem("username");

	let navigate = useNavigate();

	const authCtx = useContext(AuthContext);
	const [error, setError] = useState<ErrorMsg | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [is2FA, setIs2FA] = useState(false);
	const [sendMessage, addListener] = useSocket();

	useEffect(() => {
		if (isAuthenticated && is2FA) {
			navigate('/auth/2fa');
		}
		if (isAuthenticated && !is2FA) {
			navigate('/menu');
		}
	}, [isAuthenticated, is2FA, navigate]);

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		handleLogin();
	};
	function handleLogin() {
		const email = emailInputRef.current!.value;
		const password = passwordInputRef.current!.value;
		const usernameLocalStorage = localStorage.getItem("username");
		if (email.trim().length === 0 || password.trim().length === 0) {
			setError({
					title: "Info are missging",
					message: "Please enter email and/or password",
				})
			return;
		}
		const regExEmail = (value: string) => {
			return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
		}
		if (!regExEmail(email)) {
			setError({
				title: "Invalid email",
				message: "Please enter a valid email",
			})
			return;
		}
		const url = "http://" + window.location.hostname + ':3000'  + '/auth/signin';
			const fetchHandleLogin = async () => {
				try {
				const response = await fetch(url, {
					method: "POST",
					body: JSON.stringify({
						email: email,
						password: password
					}),
					headers: {
						"Content-Type": "application/json"
					},
				});
				const dataResponse = await response.json();
				setIsLoading(false);
				if (response.ok) {
					const token = dataResponse.access_token;
					const decodedToken: any = jwtDecode(token);
					const userId = decodedToken.sub;
					localStorage.setItem('token', token);
					localStorage.setItem('userId', userId);
					const twoFA: any = await authCtx.login(dataResponse.access_token, userId, dataResponse.refresh_token);
					if (twoFA) {
						setIs2FA(true);
					} else {
						authCtx.setUserIsLoggedIn(true);
						localStorage.setItem('userIsLoggedIn', JSON.stringify(true));
						setIs2FA(false);
					}
					setIsAuthenticated(true);
					sendMessage("login", authCtx.userId as any)
				} else {
					setError({
						title: "Echec Authentification",
						message: dataResponse.error,
					})
				}
			} catch (error) {
				console.log(error);
			}
		};
		fetchHandleLogin();
		setIsLoading(true);
		emailInputRef.current!.value = ""
		passwordInputRef.current!.value = ""
	};

	function handleError() {
		setError(null);
	};

	return (
		<>
		{error && <ErrorModal
			title={error.title}
			message={error.message}
			onConfirm={handleError} />}
		<div className="container-form">
			<h1 className='title-form'>SIGN IN</h1>
			<div className="border-form">
				<form onSubmit={handleSubmit}>
					<div className="form-input">
						<label htmlFor="floatingInput">Email address</label>
						<input type="email" ref={emailInputRef} className="form-fields" placeholder="name@example.com"/>
					</div>
					<div className="form-input">
						<label htmlFor="floatingPassword">Password</label>
						<input type="password" ref={passwordInputRef} className="form-fields" placeholder="Password" />
					</div>
					<div className="position">
						{!isLoading && <button className="submit-form" type="submit"> <i className="fa-solid fa-arrow-right"></i> Sign in</button>}
						{isLoading && <p>Is Loading...</p>}
					</div>
				</form>
			</div>
		</div>
	</>
	);
}

export default AuthForm;
