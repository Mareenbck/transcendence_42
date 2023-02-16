import React, { SyntheticEvent, useState } from "react";
import { Navigate } from "react-router-dom";
import './Form.css'

function Signup() {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [redirect, setRedirect] = useState(false);
	// const [passwordConfirm, setPasswordConfirm] = useState('');

	async function submit(e: SyntheticEvent) {
		//pour ne pas que la page s'actualise
		e.preventDefault();
		// if (passwordConfirm !== password) {
		// 	throw new BadRequestException("Passwords do not match!");
		// }
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
			if (result.access_token)
				setRedirect(true);
			return result;
		} catch (error) {
			console.error(error);
		}
	}
	if (redirect) {
		return <Navigate to="/auth/signin"/>
	}

	return (
	<div className="container-form">
		<h1 className='title-form'>SIGN UP</h1>
		<div className="border-form-up">
			<form onSubmit={submit}>
				<div className="form-input">
					<label htmlFor="floatingInput">Username</label>
					<input className="form-fields" placeholder="username"
							onChange={e => setUsername(e.target.value)} />
				</div>
				<div className="form-input">
					<label htmlFor="floatingInput">Email address</label>
					<input type="email" className="form-fields" placeholder="name@example.com"
						onChange={e => setEmail(e.target.value)} />
				</div>
				<div className="form-input">
					<label htmlFor="floatingPassword">Password</label>
					<input type="password" className="form-fields" placeholder="Password"
						onChange={e => setPassword(e.target.value)} />
				</div>
				{/* <div className="form-floating">
					<input type="password" className="form-control" id="floatingPassword" placeholder="Password confirm"
						onChange={e => setPasswordConfirm(e.target.value)} />
					<label htmlFor="floatingPassword">Password Confirm</label>
				</div> */}
				<div className="position">
					<button className="submit-form" type="submit"> <i class="fa-solid fa-arrow-right"></i> Sign up</button>
				</div>
			</form>
		</div>
	</div>
	);
}

export default Signup;
