import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ListItemAvatar } from '@mui/material';
import { ListItem } from '@mui/material';
import '../../style/Profile.css'
import MyAvatar from "../user/Avatar";
import { useParams } from "react-router-dom";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const PlayerTwo = (props: any) => {
	const isWinner = props.player.id === props.winner.id;
	const [trophy, setTrophy] = useState<any>();

	useEffect(() => {
		if (isWinner) {
			setTrophy(<EmojiEventsIcon/>)
		}
	}, [props.winner, props.player])

	return (
		<>
			<ListItemAvatar>
				<MyAvatar style="s" alt={"avatar"} avatar={props.player.avatar} ftAvatar={props.player.ftAvatar} id={props.player.id} />
			</ListItemAvatar>
			<Link to={`/users/profile/${props.player.id}`} className="profile-link">{props.player.username}</Link>
			{props.score}
			{trophy}
		</>
	)
}

export default PlayerTwo;
