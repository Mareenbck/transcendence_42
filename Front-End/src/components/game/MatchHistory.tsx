import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ListItemAvatar } from '@mui/material';
import { ListItem } from '@mui/material';
import '../../style/Profile.css'
import MyAvatar from "../user/Avatar";
import { useParams } from "react-router-dom";

const MatchHistory = (props: any) => {
	const [games, setGames] = useState<any[] | null>();
	// const [gamesData, setGamesData] = useState<any[] | null>();
	const { id } = useParams();

	const authCtx = props.authCtx;

	useEffect(() => {
		const url = `http://localhost:3000/game/allGames/${id}`;
		const fetchUserGames = async () => {
			const response = await fetch(
				url,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						// Authorization: `Bearer ${props.authCtx.token}`
					}
				}
			)
			if (response.ok) {
				const data = await response.json();
				setGames(data);
			}
		}
		fetchUserGames();
	}, [id])

	if (!games) {
		return <div>Loading...</div>;
	  }

	return (
		<>
		{games.map(game => (

			<ListItem key={game.id}>
				<ListItemAvatar>
					<MyAvatar style="s" authCtx={authCtx} alt={"avatar"} avatar={game.playerOne.avatar} ftAvatar={game.playerOne.ftAvatar} id={game.playerOne.id} />
				</ListItemAvatar>
				<Link to={`/users/profile/${game.playerOne.id}`} className="profile-link">{game.playerOne.username}</Link>
				<ListItemAvatar>
					<MyAvatar style="s" authCtx={authCtx} alt={"avatar"} avatar={game.playerTwo.avatar} ftAvatar={game.playerTwo.ftAvatar} id={game.playerTwo.id} />
				</ListItemAvatar>
				<Link to={`/users/profile/${game.playerTwo.id}`} className="profile-link">{game.playerTwo.username}</Link>
				<br />
			</ListItem>
				))}
		</>
	)
}

export default MatchHistory;
