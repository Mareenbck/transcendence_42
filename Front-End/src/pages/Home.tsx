import React, { useContext, useEffect, useRef, useState } from 'react';
import '../style/Home.css'
import { Link, useNavigate } from "react-router-dom";
import AuthContext from '../store/AuthContext';

const CLIENT_ID = "u-s4t2ud-fd5944983ac687edbbb9813ebef0865bfc99c4cc464bfa4a7c974c8d94d253bf"
const REDIRECT_URI = "http://localhost:8080/auth/42/callback";

function Home() {
	let navigate = useNavigate();
	const authCtx = useContext(AuthContext);
	const authenticating = localStorage.getItem('authenticating');
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

	useEffect(() => {
		if (authCtx.isLoggedIn) {
			navigate('/menu');
		}
		else if (!authenticating) {
			setIsAuthenticated(false);
		}
	}, [authCtx.isLoggedIn, navigate, isAuthenticated]);

	const login42 = () => {
		const url = `https://api.intra.42.fr/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code`;
		const options = 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=800';
		setIsAuthenticated(true);
		const loginWindow: any = window.open(url, '42 Login', options);
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




{/* <Link to="/auth/42" className='btn-sign'>Log <span>42</span></Link> */}
