import React, { FormEvent, useState } from "react";
import { Navigate } from "react-router-dom";
import './Form.css'

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
	<div className="container-form">
		<h1 className='title-form'>SIGN IN</h1>
		<div className="border-form">

		{/* <main className="form-signin w-100 m-auto text-center"> */}
			<form onSubmit={handleLogin}>
				<div className="form-input">
				<label htmlFor="floatingInput">Email address</label>
					<input type="email" className="form-fields" placeholder="name@example.com"
						onChange={e => setEmail(e.target.value)} />
				</div>
				<div className="form-input">
					<label htmlFor="floatingPassword">Password</label>
					<input type="password" className="form-fields" placeholder="Password"
						onChange={e => setPassword(e.target.value)}/>
				</div>
				<div className="position">
					<button className="submit-form" type="submit"> <i class="fa-solid fa-arrow-right"></i> Sign in</button>
				</div>
			</form>
		{/* </main> */}
	</div>
</div>
	);
}

export default Login;
