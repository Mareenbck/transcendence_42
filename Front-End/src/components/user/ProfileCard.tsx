import React, { useContext, useEffect, useState } from "react";
import '../../style/Profile.css'
import { useParams } from "react-router-dom";
import { FriendContext } from "../../store/FriendshipContext";
import AuthContext from "../../store/AuthContext";

const ProfileCard = (props: any) => {
	const authCtx = useContext(AuthContext);
	const friendCtx = useContext(FriendContext);
	const { id } = useParams();
	const [avatar, setAvatar] = useState<any>();
	const [ftAvatar, setFtAvatar] = useState<any>();
	const [username, setUsername] = useState<any>();
	const [user, setUser] = useState(null);
	const [isMyProfile, setIsMyProfile] = React.useState<boolean>();


	useEffect(() => {
		if (id && parseInt(id) === parseInt(authCtx.userId)) {
			setIsMyProfile(true)
		} else {
			setIsMyProfile(false)
		}
	}, [id])

	useEffect(() => {
		getUser(id);
	}, [id]);

	const getUser = async (id: string | undefined) => {
		try {
			const response = await fetch("http://" + window.location.hostname + ':3000'  + `/users/friends/${id}`, {
				method: "GET",
			});
			if (response.ok) {
				const data = await response.json();
				setUser(data);
				setUsername(data.username);
				if (isMyProfile && authCtx.ftAvatar) {
					setFtAvatar(authCtx.ftAvatar);
				} else if (data.ftAvatar) {
					setFtAvatar(data.ftAvatar);
				} else {
					setFtAvatar('');
					fetchAvatar(id);
				}
			} else {
				console.log("POST error on /friendship/create");
				return "error";
			}
		} catch (error) {
			console.log("error", error);
		}
	};

	const fetchAvatar = async (id: string | undefined) => {
		if (id) {
			const newId = parseInt(id)
			const avat: any = await friendCtx.fetchAvatar(newId);
			if (avat) {
				setAvatar(avat);
			}
		}
	};

	return (
	  <>
		<div className="profile-card">
		  {ftAvatar ? (
			<img src={ftAvatar} alt="ftAvatar" />
		  ) : (
			<img src={avatar} alt="avatar" />
		  )}
		  {isMyProfile ? <h5>{authCtx.username}</h5> : <h5>{username}</h5>}
		</div>
	  </>
	);
  };

export default ProfileCard;
