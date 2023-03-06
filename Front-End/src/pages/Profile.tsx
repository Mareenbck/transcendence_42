import '../style/Profile.css'
import React, { useContext, useEffect } from 'react'
import { Navigate } from "react-router-dom";
import AuthContext from '../store/AuthContext';
import { Link } from 'react-router-dom';

const Profile = () =>  {
	const authCtx = useContext(AuthContext);

	const isLoggedIn = authCtx.isLoggedIn;
	const avatar = authCtx.avatar;
	const username = localStorage.getItem('username');

	// useEffect(() => {
	// 	const authCtx = useContext(AuthContext);
	// }, []);
	return (
		<>
		<img src={avatar} alt="" />
		{!isLoggedIn && <Navigate to="/" replace={true} />}
		{isLoggedIn && <h2>PROFILE</h2>}
		{isLoggedIn && <p>Votre Token: {authCtx.token} </p>}
		{isLoggedIn && <p>Votre userid : {authCtx.userId} </p>}
		{isLoggedIn && <p>Votre username : {username} </p>}
		{isLoggedIn && <button onClick={authCtx.logout}>LOGOUT </button>}
		{/* {isLoggedIn && <Link to="/" onClick={authCtx.logout}>LOGOUT</Link>} */}

		</>
	)
}

export default Profile
