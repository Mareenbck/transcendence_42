import React, { useEffect, useState } from "react";
import './Game.css'
import type { UserGame, gamesList, players } from './interface_game'
import PlayerOne from './PlayerOne';
import PlayerTwo from './PlayerTwo';


const HeaderGame = (props: {games: gamesList[], room: number }) => {
    const games = props.games;
    const roomN = props.room;
    const [players, setPlayers] = useState<players>(
        {
            playerR: {} as UserGame,
            playerL: {} as UserGame
        }
    )  
 
	useEffect(() => {
        if (games){
            const index = games.findIndex((game:gamesList) => +game.roomN == +roomN);
            if (index != -1){
                setPlayers( {playerL: games[index].playerL, playerR: games[index].playerR} );
            }
        }
	}, [games]);


    // if(players.playerL && players.playerR){
        return (
            <div className="container-match" style={{backgroundColor: "white",
                                                    border: "solid" ,
                                                    borderBlockColor:"black" } } >
            { (players.playerL && players.playerR) && (
                <>
                    <PlayerOne  style={{backgroundColor: "white"}} player={players.playerL} winner={{} as UserGame} sizeAvatar={"l"} />
                    <p className='vs'>VS</p>

                    <PlayerTwo  player={players.playerR} winner={{} as UserGame}  sizeAvatar={"l"} />
                </>)}
            </div>
        );

        
}

export default HeaderGame;