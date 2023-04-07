import React, { useEffect, useState } from "react";
import { ListItem } from '@mui/material';
import '../../style/Profile.css'
import { useParams } from "react-router-dom";
import PlayerOne from "./PlayerOne";
import PlayerTwo from "./PlayerTwo";
import { Grid } from '@mui/material';

const MatchHistory = (props: any) => {
	const [games, setGames] = useState<any[] | null>();
	const { id } = useParams();

	const formattedDate = (dateString :string) => {
		const date = new Date(dateString);
		const dateStr = date.toLocaleString('en-US',  { day: 'numeric', month: 'long' });
		const day = date.getDate();
		const suffix = day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th';
		return `${day}${suffix} ${dateStr.split(' ')[0]} `;
	  };

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

	console.log("games  ->")
	console.log(games)
	return (
		<>
		  {games.map((game) => (
			<ListItem key={game.id}>
				<div className="container-match">


				  <PlayerOne player={game.playerOne} winner={game.winner} score={game.score1} />

				  {formattedDate(game.createdAt)}

				  <PlayerTwo player={game.playerTwo} winner={game.winner} score={game.score2} />

				</div>
			</ListItem>
		  ))}
		</>
	)
}

export default MatchHistory;
