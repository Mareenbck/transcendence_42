import '../../style/Profile.css'
import React, { FormEvent, useContext, useEffect, useState } from 'react'
import { Navigate, useParams } from "react-router-dom";
import AuthContext from '../../store/AuthContext';
import SideBar from '../SideBar';
import style from '../../style/Menu.module.css'
import { FriendContext } from '../../store/FriendshipContext';
import ProfileCard from './ProfileCard';
import Card from '../utils/Card';

const UserProfile = (props: any) => {
	const authCtx = useContext(AuthContext);
	const friendCtx = useContext(FriendContext);
	const isLoggedIn = authCtx.isLoggedIn;
	const [user, setUser] = useState(null);

	const getUser = async (token: string, currentId: string) => {
		const response = await fetch(
			`http://localhost:3000/users/profile/${props.id}`, {
			method: "GET",
		}
		)
		const data = await response.json();

		// For each friend in the data array, fetch their avatar
		// const updatedFriends = await Promise.all(data.map(async (friend: Friend) => {
		// 	const avatar = await fetchAvatar(friend.id);
		// 	return { ...friend, avatar };
		// }));
		setUser(data);
	}


	return (
		<>
			<div className={style.mainPos}>
				<SideBar title="Profile" />
				<div className='container-profile'>
					<ProfileCard context={authCtx} user={user}></ProfileCard>
					<Card color='blue' title="My Level" icon="level" type="stats" height="270px" width="355px"></Card>
					<Card color='red' title="My Rank" icon="rank" type="stats" height="270px" width="355px"></Card>
					{/* <Card color='green' title="My Friends" type="showFriends" width="355px" friendCtx={friendCtx} authCtx={authCtx} height="auto"></Card> */}
					<div className='card-wrapper'>
						<Card color='yellow' title="Match History" type="match" width="100%"></Card>
					</div>
				</div>
				{!isLoggedIn && <Navigate to="/" replace={true} />}
			</div>
		</>
	)
}

export default UserProfile;
