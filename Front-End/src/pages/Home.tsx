import React from 'react';
import '../style/Home.css'
import { Link } from "react-router-dom";

function Home() {

		const login42 = async () => {
			const response = await fetch("http://" + window.location.hostname + ':3000'  + "/auth/42", {method: 'GET'});
			const url = await response.json();
			const options = 'toolbar=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=800';
			const loginWindow: any = window.open(url.url, '42 Login', options);
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
