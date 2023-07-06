import React, { SyntheticEvent, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import '../../style/Form.css'
import ErrorModal from "./ErrorModal";
interface ErrorMsg {
	title: string;
	message: string
}

function Signup() {
	const [redirect, setRedirect] = useState(false);
	const emailInputRef = useRef<HTMLInputElement>(null);
	const passwordInputRef = useRef<HTMLInputElement>(null);
	const usernameInputRef = useRef<HTMLInputElement>(null);

	const [error, setError] = useState<ErrorMsg | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(e: SyntheticEvent) {
		e.preventDefault();
		const email = emailInputRef.current!.value;
		const password = passwordInputRef.current!.value;
		const username = usernameInputRef.current!.value;
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

		const userData = {
			username: username,
			email: email,
			password: password,
		};
		const url = "http://" + window.location.hostname + ':3000' + '/auth/signup';
		const fetchHandler = async () => {
			try {
				const options = {
					method: 'POST',
					body: JSON.stringify(userData),
					headers: {'Content-Type': 'application/json',},
					mode: 'cors' as RequestMode,
				};
				const response = await fetch(url, options);
				const result = await response.json();
				setIsLoading(false);
				if (response.ok) {
					setRedirect(true);
					return result;
				} else {
					setError({
						title: "Echec Authentification",
						message: result.error,
					})
				}
			} catch (error) {
				console.error(error);
			}
		};
		setIsLoading(true);
		fetchHandler();
	};

	if (redirect) {
		return <Navigate to="/auth/signin"/>
	}

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
			<h1 className='title-form'>SIGN UP</h1>
			<div className="border-form-up">
				<form onSubmit={handleSubmit}>
					<div className="form-input">
						<label htmlFor="floatingInput">Username</label>
						<input ref={usernameInputRef} className="form-fields" placeholder="username" />
					</div>
					<div className="form-input">
						<label htmlFor="floatingInput">Email address</label>
						<input type="email" ref={emailInputRef} className="form-fields" placeholder="name@example.com" />
					</div>
					<div className="form-input">
						<label htmlFor="floatingPassword">Password</label>
						<input type="password" ref={passwordInputRef} className="form-fields" placeholder="Password" />
					</div>
					{/* <div className="form-floating">
						<input type="password" className="form-control" id="floatingPassword" placeholder="Password confirm"
						onChange={e => setPasswordConfirm(e.target.value)} />
						<label htmlFor="floatingPassword">Password Confirm</label>
					</div> */}
					<div className="position">
						{!isLoading && <button className="submit-form" type="submit"> <i className="fa-solid fa-arrow-right"></i> Sign up</button>}
						{isLoading && <p>Is Loading...</p>}
					</div>
				</form>
			</div>
		</div>
	</>
	);
}

export default Signup;
