import React, { FormEvent, useState } from "react";
import { Navigate } from "react-router-dom";

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [redirect, setRedirect] = useState(false);

	const url = 'http://localhost:3000/auth/signin';

	async function handleLogin(event: FormEvent) {
		event.preventDefault();
		const fetchHandler = async() => {
			try {
				const response = await fetch(url, {
					method: "POST",
					body: JSON.stringify({
						email: email,
						password: password
					}),
					headers: {
						"Content-Type" : "application/json"
					},
				});
				const dataResponse = await response.json();

				const token = dataResponse.access_token;
				localStorage.setItem('token', token);
				setRedirect(true);
			} catch(error) {
				console.log(error);
			}
		};
		fetchHandler();
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
