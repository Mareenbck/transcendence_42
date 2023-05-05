import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ListItemAvatar } from '@mui/material';
import '../../style/Profile.css'
import MyAvatar from "../user/Avatar";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const PlayerR = (props: any) => {

	return (
		<>
			<Link to={`/users/profile/${props.player.id}`} className="profile-link">{props.player.username}</Link>
			<ListItemAvatar>
				{/* <MyAvatar style="s" alt={"avatar"} avatar={props.player.avatar} ftAvatar={props.player.ftAvatar} id={props.player.id} /> */}
				<MyAvatar style={props.sizeAvatar} alt={"avatar"} avatar={props.player.avatar} ftAvatar={props.player.ftAvatar} id={props.player.id} />
			</ListItemAvatar>
			{/* {props.score} */}
		</>
	)
}

export default PlayerR;
