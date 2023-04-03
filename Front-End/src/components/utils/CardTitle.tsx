import React, { useEffect, useState } from "react";
import '../../style/Profile.css'
import FriendsDemands from "../friends/FriendsDemands";

const TitleCard = (props: any) => {
	const [content, setContent] = useState<any>(null);

	useEffect(() => {
		if (props.type === 'showFriends') {
			setContent(<FriendsDemands token={props.authCtx.token} authCtx={props.authCtx}/>)
		}
	}, [props.type]);

	const styles = {
		background: props.color,
	  };

	return (
		<>
		<div className="title-card">
			<div className="status" style={styles}></div>
			<h5>{props.title}</h5>
			{content}
		</div>
		</>
	)
}

export default TitleCard;
