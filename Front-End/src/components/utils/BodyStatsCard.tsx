import React, { useContext, useEffect, useState } from "react";
import '../../style/Profile.css'
import AuthContext from "../../store/AuthContext";
import { useParams } from "react-router-dom";

const BodyStatsCard = (props: any) => {
	const [icon, setIcon] = useState<string>("");
	const authCtx = useContext(AuthContext)
	const [xp, setXp] = useState<number>();
	const [level, setLevel] = useState<number>();
	const { id } = useParams();
	const [content, setContent] = useState<any>();

	useEffect(() => {
		const fetchData = async () => {
			if (props.icon === 'level') {
				const data = await fetchUserLevel();
				setXp(data.xp);
				setLevel(data.level);
				setContent(<><h3>Lvl -</h3><h2>{data.level}</h2></>)
			} else if (props.icon === 'rank' && id) {
				const rank = await fetchUserRank(parseInt(id));
				setContent(<><h2>#{rank.rank}</h2></>)
			}
		};
		fetchData();
	}, [id])

	const url = "http://" + window.location.hostname + ':3000'  + `/game/level/${id}`;
	const fetchUserLevel = async () => {
		const response = await fetch(url,{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authCtx.token}`
				}
			}
		)
		const data = await response.json();
		if (response.ok) {
			return data;
		}
	}

	const fetchUserRank = async (id: number) => {
		const response = await fetch("http://" + window.location.hostname + ':3000'  + `/game/rank/${id}`,{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authCtx.token}`
			}
		});
		const data = await response.json();
		if (response.ok) {
			return data;
		}
	};

	useEffect(() => {
		if (props.icon === 'rank') {
			setIcon("fa-solid fa-bolt");
		} else if (props.icon === 'level') {
			setIcon("fa-solid fa-trophy");
		}
	}, [props.icon])

	return (
		<>
		{level && <div  className="stats-progress">
			<progress value={xp} max="100" className="stats-progress"></progress>
			<span>{xp}%</span>
		</div>}
		<div className='flex'>
			<div className='background-icon'>
				<div className='font'>
					<i className={icon}></i>
				</div>
			</div>
			<div className="detail-score">
				{content}
			</div>
		</div>
		</>
	)
}

export default BodyStatsCard;
