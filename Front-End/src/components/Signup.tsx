import React, { SyntheticEvent, useState } from "react";

function Signup() {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');

	async function submit(e: SyntheticEvent) {
		//pour ne pas que la page s'actualise
		e.preventDefault();
		const userData = {
			username: username,
			email: email,
			password: password,
		};
		try {
			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(userData),
			};
			const response = await fetch(`http://localhost:3000/auth/signup`, options);
			const result = await response.json();
			return result;
		} catch (error) {
			console.error(error);
		}

	}

	return (
		<main className="form-signin w-100 m-auto text-center">
			<form onSubmit={submit}>
				<h1 className="h3 mb-3 fw-normal">Please sign up</h1>
				<div className="form-floating">
					<input className="form-control" id="floatingInput" placeholder="username"
							onChange={e => setUsername(e.target.value)} />
					<label htmlFor="floatingInput">Username</label>
				</div>
				<div className="form-floating">
					<input type="email" className="form-control" id="floatingInput" placeholder="name@example.com"
						onChange={e => setEmail(e.target.value)} />
					<label htmlFor="floatingInput">Email address</label>
				</div>
				<div className="form-floating">
					<input type="password" className="form-control" id="floatingPassword" placeholder="Password"
						onChange={e => setPassword(e.target.value)} />
					<label htmlFor="floatingPassword">Password</label>
				</div>
				<button className="w-100 btn btn-lg btn-primary" type="submit">Submit</button>
			</form>
		</main>
	);
}

export default Signup;
