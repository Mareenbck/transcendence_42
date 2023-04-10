import React, { useContext, useEffect, useState } from "react";
import '../../style/Profile.css'
import AuthContext from "../../store/AuthContext";
import { useParams } from "react-router-dom";

const BodyStatsCard = (props: any) => {

	const [icon, setIcon] = useState<string>("");
	const authCtx = useContext(AuthContext)
	const [user, setUser] = useState<any>({});
	const [xp, setXp] = useState<number>();
	const [level, setLevel] = useState<number>();
	const { id } = useParams();

	useEffect(() => {
		fetchUserLevel();
	}, [id])

	const url = `http://localhost:3000/game/level/${id}`;
	const fetchUserLevel = async () => {
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
			setXp(data.xp);
			setLevel(data.level);
		}
	}

	useEffect(() => {
		if (props.icon === 'rank') {
			setIcon("fa-solid fa-bolt");
			// setData("12")
		} else if (props.icon === 'level') {
			setIcon("fa-solid fa-trophy");
		}
	}, [props.icon])

	return (
		<>
		<div  className="stats-progress">
			<progress value={xp} max="100" className="stats-progress"></progress>
			<span>{xp}%</span>
		</div>
		<div className='flex'>
			<div className='background-icon'>
				<div className='font'>
					<i className={icon}></i>
				</div>
			</div>
			<h2>#{level}</h2>
		</div>
		</>
	)
}


export default BodyStatsCard;
