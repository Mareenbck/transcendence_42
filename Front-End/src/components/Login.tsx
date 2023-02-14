import React, { FormEvent, useState } from "react";
import { Navigate } from "react-router-dom";

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [redirect, setRedirect] = useState(false);


	async function handleLogin(event: FormEvent) {
		event.preventDefault();

		const loginData = {
			email: email,
			password: password,
		};
		try {
			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(loginData),
			};
			const response = await fetch(`http://localhost:3000/auth/signin`, options);
			const result = await response.json();
			setRedirect(true);
			return result;
		} catch (error) {
			console.error(error);
		}
	}
	if (redirect) {
		return <Navigate to="/users/profile" />
	}
	return (
		<main className="form-signin w-100 m-auto text-center">
			<form onSubmit={handleLogin}>
				<h1 className="h3 mb-3 fw-normal">Please sign in</h1>

				<div className="form-floating">
					<input type="email" className="form-control" id="floatingInput" placeholder="name@example.com"
						onChange={e => setEmail(e.target.value)} />
					<label htmlFor="floatingInput">Email address</label>
				</div>
				<div className="form-floating">
					<input type="password" className="form-control" id="floatingPassword" placeholder="Password"
						onChange={e => setPassword(e.target.value)}/>
					<label htmlFor="floatingPassword">Password</label>
				</div>
				<button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
			</form>
		</main>
	);
}

export default Login;
