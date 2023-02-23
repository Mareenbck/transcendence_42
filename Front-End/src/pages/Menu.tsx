import React from "react";
import { useContext } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthContext from "../store/AuthContext";

const Menu = () => {
	const authCtx = useContext(AuthContext);

	const isLoggedIn = authCtx.isLoggedIn;
	const id = authCtx.userId;

	return (
		<>
		{!isLoggedIn && <Navigate to="/" replace={true} />}
		{isLoggedIn && <h2>WELCOME</h2>}
		{isLoggedIn && <p>Votre username : {authCtx.username} </p>}

		{isLoggedIn && <button onClick={authCtx.logout}>LOGOUT </button>}
		<Link to={`/users/profile/${id}`} className='btn'>Profile page</Link>

		<Link to="/chat/message">Chat</Link>
		</>
	)
}

export default Menu
