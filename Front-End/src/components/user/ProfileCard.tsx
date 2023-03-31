import React, { useEffect, useState } from "react";
import '../../style/Profile.css'
import { useParams } from "react-router-dom";

const ProfileCard = (props: any) => {
	const authCtx = props.context;
	const [avatar, setAvatar] = useState<string | null>(null);
	const { id } = useParams();

	useEffect(() => {
		if(props.user) {
			setAvatar(props.user.avatar)
		}
		else {

			setAvatar(authCtx.avatar);
		}
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
		<div className='profile-card'>
			{avatar ? <img src={avatar} alt={"avatar"} /> : <img src={authCtx.ftAvatar} alt={"ftAvatar"} />}
			{authCtx.isLoggedIn && <h5>{authCtx.username} </h5>}
		</div>
		</>
	)
}

export default ProfileCard;
