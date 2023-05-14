import React, { useEffect, useState } from "react";
import '../../style/Profile.css'
import ShowFriends from "../friends/ShowFriends";
import TitleCard from "./CardTitle";
import BodyStatsCard from "./BodyStatsCard";
import MenuCard from "./MenuCard";
import MatchHistory from "../game/MatchHistory";
import ShowAchievements from "../game/ShowAchievements";
import Table from "../scores/Table"
import Podium from "../scores/Podium"

const Card = (props: any) => {
	const [color, setColor] = useState<string>('');
	const [content, setContent] = useState<any>(null);
	const [titleStyle, setTitleStyle] = useState<string>('m');

	const styles = {
		width: props.width,
		height: props.height,
	  };

	useEffect(() => {
		if (props.color === 'red') {
			setColor("#FF5166");
		} else if (props.color === 'blue') {
			setColor("#5551FF");
		} else if (props.color === 'green') {
			setColor("#04A777");
		} else if (props.color === 'yellow') {
			setColor("#F9C80E");
		}
	}, [props.color])

	useEffect(() => {
		if (props.type === 'stats') {
			setContent(<BodyStatsCard icon={props.icon}/>);
		} else if (props.type === 'showFriends') {
			setContent(<ShowFriends friendCtx={props.friendCtx} authCtx={props.authCtx}/>);
		} else if (props.type === 'menu') {
			setTitleStyle("s");
			setContent(<MenuCard body={props.body}/>);
		} else if (props.type === 'match') {
			setContent(<MatchHistory id={props.id} authCtx={props.authCtx}/>);
		} else if (props.type === 'achiev') {
			setContent(<ShowAchievements id={props.id}/>)
		}else if (props.type === 'table') {
			setContent(<Table id={props.id}/>)
		}else if (props.type === 'viewGame') {
			setContent(<MatchHistory id={props.id} authCtx={props.authCtx}/>)
		}else if (props.type === 'podium') {
			setContent(<Podium id={props.id}/>)
		}
	}, [props.type])

	const menuCardClass = props.type === 'menu' ? 'menu-card' : '';

	return (
		<>
			<div className={`card ${menuCardClass}`} style={styles}>
			{props.style !== "none" ? (
				<TitleCard style={titleStyle} color={color} title={props.title} type={props.type} friendCtx={props.friendCtx} authCtx={props.authCtx}></TitleCard>)
				 : null}
				{content}
			</div>
		</>
	)
}

export default Card;
