import React, { useEffect, useState } from "react";
import '../../style/Profile.css'
import FriendsDemands from "../friends/FriendsDemands";

const TitleCard = (props: any) => {
	const [content, setContent] = useState<any>(null);
	const [statusClass, setStatusClass] = useState<string>('');
	const [titleClass, setTitleClass] = useState<string>('m');

	useEffect(() => {
		if (props.type === 'showFriends') {
			setContent(<FriendsDemands token={props.authCtx.token} authCtx={props.authCtx} friendCtx={props.friendCtx}/>)
		}
	}, [props.type]);

	const color = {
		background: props.color,
	  };

	  useEffect(() => {
		setStatusClass(`custom-status-${props.style}`);
		setTitleClass(`title-card-${props.style}`);
	}, [props.style]);

	return (
		<>
		<div className={titleClass}>
			<div className={statusClass} style={color}></div>
			<h5>{props.title}</h5>
			{content}
		</div>
		</>
	)
}

export default TitleCard;
