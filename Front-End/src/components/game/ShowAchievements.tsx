import React, { FormEvent, useContext, useEffect, useState } from "react";
import { FriendContext } from "../../store/FriendshipContext";
import Friend from '../../interfaces/IFriendship'
import { AvatarGroup } from '@mui/material';
import MyAvatar from "../user/Avatar";
import { Button } from '@mui/material';
import { Link } from "react-router-dom";
import AuthContext from "../../store/AuthContext";
import Achievement from "../../interfaces/IAchievements";
import Avatar from "../user/Avatar";
import BadgeIcon from "../utils/BadgeIcon";
import '../../style/Profile.css';
import { useParams } from "react-router-dom";


const ShowAchievements = (props: any) => {
	const authCtx = useContext(AuthContext);
	const { id } = useParams();
	const [achievements, setAchievements] = useState<any[]>([]);

	useEffect(() => {
		fetchUserAchievements();
	}, [id])

	const url = `http://localhost:3000/users/${id}/achievements`;
	const fetchUserAchievements = async () => {
		const response = await fetch(
			url,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authCtx.token}`
				}
			}
		)
		if (response.ok) {
			const data = await response.json();
			// Convert image URLs to blobs
			const achievementsWithBlobs = await Promise.all(data.map(async (achiev: any) => {
			  const icon = await fetchIcon(achiev.achievement.id);
			  return { ...achiev, achievement: {...achiev.achievement, icon}};
			}));
			setAchievements(achievementsWithBlobs);
		  }
	}

	const fetchIcon = async (id: number) => {
		try {
			const response = await fetch(`http://localhost:3000/users/${id}/icon`, {
				method: 'GET',
			});
			if (response.ok) {
				const blob = await response.blob();
				return URL.createObjectURL(blob);
			}
		} catch (error) {
			return console.log("error", error);
		}
	}

	return (
		<>
		<div className="container-achiev">
			{achievements.map((achiev) => (
				<li key={achiev.id}>
					<div className="name-icon">
						<h6>{achiev.achievement.name}</h6>
							<BadgeIcon style="l" src={achiev.achievement.icon} className="badge-icon" description={achiev.achievement.description}/>
					</div>
				</li>
			))}
			</div>
		<br />
		</>
	)
}

export default ShowAchievements;
