import React, { useEffect, useState } from "react";
import '../../style/Profile.css'
import { useParams } from "react-router-dom";
import ShowFriends from "../friends/ShowFriends";
import TitleCard from "./CardTitle";
import BodyStatsCard from "./BodyStatsCard";

const Card = (props: any) => {
	const [color, setColor] = useState<string>('');
	const [content, setContent] = useState<any>(null);

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
		}
	}, [props.type])


	return (
		<>
			<div className='card' style={styles}>
				<TitleCard color={color} title={props.title}></TitleCard>
				{content}
			</div>
		</>
	)
}

export default Card;
