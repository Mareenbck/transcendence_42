import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../store/AuthContext";
import BadgeIcon from "../utils/BadgeIcon";
import '../../style/Profile.css';
import { useParams } from "react-router-dom";


const ShowAchievements = (props: any) => {
	const authCtx = useContext(AuthContext);
	const { id } = useParams();
	const [achievements, setAchievements] = React.useState<any[]>([]);
	const [isMyProfile, setIsMyProfile] = React.useState<boolean>();
	const [style, setStyle] = useState<string>(isMyProfile ? "s" : "l");
	let nameIconClass = 'name-icon';

	useEffect(() => {
		if (id && parseInt(id) === parseInt(authCtx.userId)) {
			setIsMyProfile(true)
		} else {
			setIsMyProfile(false)
		}
	}, [id])

	useEffect(() => {
		fetchUserAchievements();
		if (isMyProfile) {
			setStyle("s");
		} else {
			setStyle("l")
		}
	}, [id])

	if (style === "l") {
		nameIconClass = "name-icon";
	} else if (style === "s") {
		nameIconClass = "name-icon-s";
	}

	const url = "http://" + window.location.hostname + ':3000'  + `/users/${id}/achievements`;
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
			const response = await fetch("http://" + window.location.hostname + ':3000' + `/users/${id}/icon`, {
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
					<div className={nameIconClass}>
						<h6>{achiev.achievement.name}</h6>
						<BadgeIcon style={style} src={achiev.achievement.icon} className="badge-icon" description={achiev.achievement.description}/>
					</div>
				</li>
			))}
			</div>
		<br />
		</>
	)
}

export default ShowAchievements;
