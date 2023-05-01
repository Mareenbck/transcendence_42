import React, { useContext, useEffect, useState } from "react";
import { ListItem } from '@mui/material';
import '../../style/Profile.css'
import { useParams } from "react-router-dom";
import PlayerOne from "./PlayerOne";
import PlayerTwo from "./PlayerTwo";
import ScoresMatch from "./ScoresMatch";
import AuthContext from "../../store/AuthContext";
import useSocket from '../../service/socket';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import type { gameInit, gameState, gameStatus, gamesList } from './interface_game';
// const [gamestatus, setGameStatus] = useState<gameStatus>(
// 	{   winner: null,
// 		status: "null"} 
// );  

const ViewGame = (props: any) => {
	const [games, setGames] = useState<any[] | null>();
	const { id } = useParams();
	const authCtx = useContext(AuthContext);
	const [sendMessage, addListener] = useSocket()

	// function GameButton({ user, playGame }) {
		const [clicked_play, setClicked] = useState(false);

		const handleClick = (roomN: number) => {
		//console.log('playGame sendMessage', user);
			sendMessage("playGame", {user: user, roomN: roomN});
			gamestatus.winner = null;
			setClicked(true);
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
						Authorization: `Bearer ${authCtx.token}`
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
		return (<div>Loading...</div>);
	  }

	return (
        <>
			{/* /LIST OF CURRENT GAME with button "Watch*/}
			<div>
                    {games.map((game: gamesList) => (
                        <div className='wrapList'>

                      
                            <div  onClick={() => handleClick(game.roomN)}>
                                <div className="container-match">
                                    <button  style={{backgroundColor: "#F3F0FF"}} onClick={() => handleClick(game.roomN)}><RemoveRedEyeIcon/> </button>
                                    <PlayerOne player={game.playerR} winner={""} score={game.scoreR} />
                                    <ScoresMatch score1={game.scoreR} score2={game.scoreL}/>
                                    <PlayerTwo player={game.playerL} winner={""} score={game.playerL} />
                                </div>
                                
                            </div>
                         </div>

                    ))}
                </div>



	</>	
	)
}

export default ViewGame;