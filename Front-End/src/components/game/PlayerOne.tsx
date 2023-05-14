import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ListItemAvatar } from '@mui/material';
import '../../style/Profile.css'
import MyAvatar from "../user/Avatar";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const PlayerOne = (props: any) => {
	const isWinner = props.player.id === props.winner.id;
	const [trophy, setTrophy] = useState<any>();

	useEffect(() => {
		if (isWinner) {
			setTrophy(<EmojiEventsIcon style={{ fontSize: 35, color: '#f7c738' }}/>);
		} else {
			setTrophy(<EmojiEventsIcon style={{ fontSize: 35, opacity: 0 }} />);
		}
		}, [props.winner, props.player, isWinner]);

	return (
		<>
		{trophy}
		<Link to={`/users/profile/${props.player.id}`} className="profile-link">{props.player.username}</Link>
		<ListItemAvatar>
			<MyAvatar style={props.sizeAvatar} alt={"avatar"} avatar={props.player.avatar} ftAvatar={props.player.ftAvatar} id={props.player.id} />
		</ListItemAvatar>
		</>
	)
}

export default PlayerOne;
