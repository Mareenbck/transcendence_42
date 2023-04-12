import React, { useContext, useEffect, useState } from "react";
import '../../style/Profile.css'
import { useParams } from "react-router-dom";
import { FriendContext } from "../../store/FriendshipContext";
import AuthContext from "../../store/AuthContext";

const ProfileCard = (props: any) => {
	const authCtx = useContext(AuthContext);
	const friendCtx = useContext(FriendContext);
	// const user = props.user;

	const [avatar, setAvatar] = useState<any>();
	const [ftAvatar, setftAvatar] = useState<any>();
	const [username, setUsername] = useState<any>();
	const { id } = useParams();
	const isMyProfile = parseInt(authCtx.userId) === parseInt(id);
	const [user, setUser] = useState(null);

	useEffect(() => {
		getUser(id)
		// if(!isMyProfile) {
			const fetchData = async () => {
				const avat: any = await friendCtx.fetchAvatar(id);
				if (avat) {
					setAvatar(avat);
				}
			};
			fetchData();
		// }
	}, [id])

	const getUser = async (id: string) => {
		try {
			const response = await fetch(
			`http://localhost:3000/users/friends/${id}`, {
				method: "GET",
			})
			if (response.ok) {
				const data = await response.json();
				setUser(data);
				setUsername(data.username)
				setftAvatar((isMyProfile && authCtx.ftAvatar) ? authCtx.ftAvatar : data.ftAvatar)
				const avat: any = await friendCtx.fetchAvatar(parseInt(id));
				if (avat) {
					setAvatar(avat);
				}
			} else {
				console.log("POST error on /friendship/create");
				return "error";
			}
		} catch (error) {
			console.log("error", error);
	 	}
	}

	return (
		<>
		<div className='profile-card'>
			{avatar ? <img src={avatar} alt="avatar" /> : <img src={ftAvatar} alt="ftAvatar"/>}
			{/* {avatar ? <img src={avatar} alt={"avatar"} /> : <img src={authCtx.ftAvatar} alt={"ftAvatar"} />} */}
			{isMyProfile ? <h5>{authCtx.username}</h5> : <h5>{username}</h5> }
		</div>
		</>
	)
}

export default ProfileCard;
