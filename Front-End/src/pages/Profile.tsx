import '../style/Profile.css'
import React, { useContext, useEffect, useState } from 'react'
import { Navigate, useParams } from "react-router-dom";
import AuthContext from '../store/AuthContext';
import SideBar from '../components/auth/SideBar';
import style from '../style/Menu.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
			<div className={style.mainPos}>
				<SideBar title="Settings" />
			<div className="contain-set">

		{/* <img src={avatarUrl} alt={avatar ? "avatar" : "ftAvatar"} /> */}
		<div className='head'>
			<div className='profile-card'>
				{avatar ? <img src={avatar} alt={"avatar"} /> : <img src={ftAvatar} alt={"ftAvatar"} />}
				{isLoggedIn && <h5>{username} </h5>}
			</div>
			<div className='friends-card'>
			<div className="status-friends"></div>
				<h5>My Friends</h5>
			</div>
			<div className='friends-card'>
			<div className="status-rank"></div>
				<h5>My Rank</h5>
				<div className='flex'>
					<div className='rank'>
						<div className='font'>
							<i className="fa-solid fa-bolt"></i>
						</div>
					</div>
					<h2>#12</h2>
				</div>
			</div>
		</div>

		{!isLoggedIn && <Navigate to="/" replace={true} />}
		{/* {isLoggedIn && <h2>PROFILE</h2>} */}
		{isLoggedIn && <p>Votre Token: {authCtx.token} </p>}
		{isLoggedIn && <p>Votre userid : {authCtx.userId} </p>}
		{isLoggedIn && <button onClick={authCtx.logout}>LOGOUT </button>}
		{/* {isLoggedIn && <Link to="/" onClick={authCtx.logout}>LOGOUT</Link>} */}
			</div>
		</div>
		</>
	)
}

export default Profile;
