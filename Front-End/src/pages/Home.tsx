import React, { useContext, useEffect, useRef, useState } from 'react';
import '../style/Home.css'
import { Link, useNavigate } from "react-router-dom";
import AuthContext from '../store/AuthContext';
import { back_url } from '../config.json';

function Home() {
	let navigate = useNavigate();
	const authCtx = useContext(AuthContext);
	const authenticating = localStorage.getItem('authenticating');
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	// console.log(process.env)
	const BACK = process.env.VITE_BACKEND_URL
	console.log("BACKK   ", BACK)
	const BACK2 = `http://${window.location.hostname}:3000`
	console.log("BACKK22   ", BACK2)
	const BACK3 = import.meta.env.VITE_BACKEND_URL
	console.log("BACKK33   ", BACK3)

	useEffect(() => {
		if (authCtx.isLoggedIn && !authCtx.is2FA) {
			navigate('/menu');
		}
		else if (!authenticating) {
			setIsAuthenticated(false);
		}
	}, [authCtx.isLoggedIn, navigate, isAuthenticated]);

	const login42 = async () => {
		console.log("window.location.hostname   ", window.location.hostname)
		const response = await fetch(`http://${window.location.hostname}:3000` + "/auth/42", {method: 'GET'});
		console.log("response    ", response)
		const url = await response.json();
		const options = 'toolbar=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=800';
		setIsAuthenticated(true);
		const loginWindow: any = window.open(url.url, '42 Login', options);
		const intervalId = setInterval(() => {
			if (loginWindow.closed) {
				clearInterval(intervalId);
				window.location.href = "/menu";
			}
		}, 500);
	};

	return (
		<main className='App'>
			<div className="container">
				<div className="content">
					<h1>Transcendence</h1>
				</div>
				<div className="buttons">
					<Link to="/auth/signup" className='btn-sign'>Sign <span>UP</span></Link>
					<Link to="/auth/signin" className='btn-sign'>Sign <span>IN</span></Link>
					<button onClick={login42} className='btn-sign'>Log <span>42</span></button>
				</div>
			</div>
		</main>
	)
}

export default Home;
