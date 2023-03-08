import '../style/Profile.css'
import React, { useContext, useEffect, useState } from 'react'
import { Navigate } from "react-router-dom";
import AuthContext from '../store/AuthContext';
import { Link } from 'react-router-dom';

const Profile = () =>  {
	const authCtx = useContext(AuthContext);

	const isLoggedIn = authCtx.isLoggedIn;
	const userId = authCtx.userId;

	// const avatar = authCtx.avatar;
	const defaultAvatar = authCtx.defaultAvatar;
	const username = localStorage.getItem('username');
	const [avatar, setAvatar] = useState<string | null>(authCtx.avatar);

	useEffect(() => {

	const fetchAvatar = async () => {
		try {
			const response = await fetch(`http://localhost:3000/users/${userId}/avatar`, {
				method: 'POST',
				headers: {
					// 'Content-Type': 'application/json',
					Authorization: `Bearer ${authCtx.token}`,
				},
			});
			const blob = await response.blob();
			setAvatar(URL.createObjectURL(blob));
			return "success";
		} catch (error) {
			return console.log("error", error);
		}
	}
	fetchAvatar();
	}, [])

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
