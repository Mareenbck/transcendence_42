import '../style/Profile.css'
import React, { useContext } from 'react'
import { Navigate } from "react-router-dom";
import AuthContext from '../store/AuthContext';

const Profile = () =>  {
	const authCtx = useContext(AuthContext);
	const isLoggedIn = authCtx.isLoggedIn;

	return (
		<>
		{!isLoggedIn && <Navigate to="/" replace={true} />}
		{isLoggedIn && <h2>PROFILE</h2>}
		{isLoggedIn && <p>Votre Token: {authCtx.token} </p>}
		{isLoggedIn && <p>Votre userid : {authCtx.userId} </p>}
		{isLoggedIn && <p>Votre username : {authCtx.username} </p>}
		{isLoggedIn && <button onClick={authCtx.logout}>LOGOUT </button>}
		</>
	)
}

export default Profile