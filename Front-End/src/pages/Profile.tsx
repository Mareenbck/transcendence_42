import '../style/Profile.css'
import React, { useContext, useEffect, useState } from 'react'
import { Navigate, useParams } from "react-router-dom";
import AuthContext from '../store/AuthContext';

const Profile = () =>  {
	const authCtx = useContext(AuthContext);

	const isLoggedIn = authCtx.isLoggedIn;
	const { id } = useParams();
	const ftAvatar = authCtx.ftAvatar;
	const username = localStorage.getItem('username');
	const [avatar, setAvatar] = useState<string | null>(null);

	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		setAvatar(authCtx.avatar);
	}, [authCtx.avatar]);

	useEffect(() => {
		if (!avatar) {
			authCtx.fetchAvatar(id);
		} else {
			authCtx.updateAvatar(avatar);
		}
	}, [id]);

	return (
		<>
		{/* <img src={avatarUrl} alt={avatar ? "avatar" : "ftAvatar"} /> */}
		{avatar ? <img src={avatar} alt={"avatar"} /> : <img src={ftAvatar} alt={"ftAvatar"} />}
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

export default Profile;
