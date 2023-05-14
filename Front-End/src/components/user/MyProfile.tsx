import '../../style/Profile.css'
import React, { useContext } from 'react'
import { Navigate } from "react-router-dom";
import AuthContext from '../../store/AuthContext';
import SideBar from '../SideBar';
import { FriendContext } from '../../store/FriendshipContext';
import ProfileCard from './ProfileCard';
import Card from '../utils/Card';

const MyProfile = (props: any) => {
	const authCtx = useContext(AuthContext);
	const friendCtx = useContext(FriendContext);
	const isLoggedIn = authCtx.isLoggedIn;

	return (
		<>
		<div className="contain-page">
			<SideBar title="Profile" />
			<div className='container-profile'>
				<div className='achievement-card'>
					<ProfileCard authCtx={authCtx} ></ProfileCard>
					<Card color='green' title="Achievements" type="achiev" width="140px" height="270px" id={props.id} style="none"></Card>
				</div>
				<Card color='blue' title="My Level" icon="level" type="stats" height="270px" width="355px"></Card>
				<Card color='red' title="My Rank" icon="rank" type="stats" height="270px" width="355px"></Card>
				<Card color='green' title="My Friends" type="showFriends" width="400px" friendCtx={friendCtx} authCtx={authCtx} height="auto"></Card>
				<div className='card-wrapper'>
					<Card color='yellow' title="Match History" type="match" width="100%"></Card>
				</div>
			</div>
			{!isLoggedIn && <Navigate to="/" replace={true} />}
		</div>
		</>
	)
}

export default MyProfile;
