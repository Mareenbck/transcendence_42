import '../../style/Profile.css'
import React, { useContext, useEffect, useState } from 'react'
import { Navigate } from "react-router-dom";
import AuthContext from '../../store/AuthContext';
import SideBar from '../SideBar';
import ProfileCard from './ProfileCard';
import Card from '../utils/Card';

const UserProfile = (props: any) => {
	const authCtx = useContext(AuthContext);
	const isLoggedIn = authCtx.isLoggedIn;
	const [user, setUser] = useState(null);

	useEffect(() => {
		getUser(props.id)
	}, [props.id])


	const getUser = async (id: string) => {
		try {
			const response = await fetch("http://" + window.location.hostname + ':3000'  + `/users/friends/${id}`, {
				method: "GET",
			})
			if (response.ok) {
				const data = await response.json();
				setUser(data);
			} else {
				console.log("POST error on /friendship/id");
				return "error";
			}
		} catch (error) {
			console.log("error", error);
	 	}
	}

	return (
		<>
		<div className="contain-page">
			<SideBar title="Profile" />
			<div className='container-profile'>
				<ProfileCard authCtx={authCtx} user={user} id={props.id}></ProfileCard>
				<Card color='blue' title="My Level" icon="level" type="stats" height="270px" width="355px"></Card>
				<Card color='red' title="My Rank" icon="rank" type="stats" height="270px" width="355px"></Card>
				<div className='card-wrapper'>
					<Card color='yellow' title="Match History" type="match" width="100%" id={props.id} authCtx={authCtx}></Card>
				</div>
				<Card color='green' title="Achievements" type="achiev" width="355px" id={props.id} authCtx={authCtx}></Card>
			</div>
			{!isLoggedIn && <Navigate to="/" replace={true} />}
		</div>
		</>
	)
}

export default UserProfile;
