import React, { useContext, useEffect, useState } from "react";
import { ListItem } from '@mui/material';
import '../../style/Profile.css'
import { useParams } from "react-router-dom";
import PlayerOne from "./PlayerOne";
import PlayerTwo from "./PlayerTwo";
import ScoresMatch from "./ScoresMatch";
import AuthContext from "../../store/AuthContext";

const MatchHistory = (props: any) => {
	const [games, setGames] = useState<any[] | null>();
	const { id } = useParams();
	const authCtx = useContext(AuthContext)

	useEffect(() => {
		const url = "http://" + window.location.hostname + ':3000' + `/game/allGames/${id}`;
		const fetchUserGames = async () => {
			const response = await fetch(url,{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authCtx.token}`
				}
			})
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
	const lastFiveGames = games.slice(0, 5);

	return (
		<>
		  {lastFiveGames.map((game: any) => (
			<ListItem key={game.id}>
				<div className="container-match">
					<PlayerOne player={game.playerOne} winner={game.winner} score={game.score1} />
					<ScoresMatch score1={game.score1} score2={game.score2} date={game.createdAt}/>
					<PlayerTwo player={game.playerTwo} winner={game.winner} score={game.score2} />
				</div>
			</ListItem>
		  ))}
		</>
	)
}

export default MatchHistory;
