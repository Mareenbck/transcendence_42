import '../style/Profile.css'
import React, { FormEvent, useContext, useEffect, useState } from 'react'
import { Navigate, useParams } from "react-router-dom";
import AuthContext from '../store/AuthContext';
import SideBar from '../components/SideBar';
import style from '../style/Menu.module.css'
import { FriendContext } from '../store/FriendshipContext';
import FriendsDemands from '../components/friends/FriendsDemands';
import ShowFriends from '../components/friends/ShowFriends';
import ProfileCard from '../components/user/ProfileCard';
import Card from '../components/utils/Card';
import MyProfile from '../components/user/MyProfile';
import UserProfile from '../components/user/UserProfile';

const Profile = (props: any) =>  {
	const { id } = useParams();
	// const [user, setUser] = useState(null);

	const authCtx = useContext(AuthContext);
	const isMyProfile = authCtx.userId === id;
	// const friendCtx = useContext(FriendContext);
	const isLoggedIn = authCtx.isLoggedIn;

	// useEffect(() => {
	// 	// Charge les données utilisateur à partir de l'API
	// 	fetch(`/api/users/${id}`)
	// 		.then(response => response.json())
	// 		.then(data => setUser(data))
	// 		.catch(error => console.error(error));
	// }, [id]);

	return (
		<>
		<div className={style.mainPos}>
				<div>
					{isMyProfile ? (
						<MyProfile></MyProfile>
					): (
						<UserProfile></UserProfile>
						)}
				</div>
			{!isLoggedIn && <Navigate to="/" replace={true} />}
		</div>
		</>
	)
}

export default Profile;
