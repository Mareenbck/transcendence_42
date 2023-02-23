import React, { FormEvent, useContext, useEffect, useRef, useState } from 'react';
import ErrorModal from './ErrorModal';
import '../../style/Form.css'
import AuthContext from '../../store/AuthContext';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

interface ErrorMsg {
	title: string;
	message: string
}

function AuthForm() {
	const emailInputRef = useRef<HTMLInputElement>(null);
	const passwordInputRef = useRef<HTMLInputElement>(null);

	let navigate = useNavigate();

	const authCtx = useContext(AuthContext);

	const [error, setError] = useState<ErrorMsg | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		if (isAuthenticated) {
			navigate('/auth/2fa');
		}
	}, [isAuthenticated, navigate]);

	function handleLogin(event: FormEvent) {
		event.preventDefault();
		const email = emailInputRef.current!.value;
		const password = passwordInputRef.current!.value;
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
		const url = 'http://localhost:3000/auth/signin';
			const fetchHandler = async () => {
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
					authCtx.login(token, userId);
					setIsAuthenticated(true);
				} else {
					//CHANGER LES MSG DANS BACK -> A DATE FORBIDDEN
					setError({
						title: "Echec Authentification",
						message: dataResponse.error,
					})
				}
			} catch (error) {
				console.log(error);
			}
		};
		fetchHandler();
		setIsLoading(true);

		//pour vider les champs du formulaire
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
				<form onSubmit={handleLogin}>
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
