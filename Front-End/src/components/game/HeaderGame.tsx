import React, { useEffect, useState } from "react";
import './Game.css'
import MyAvatar from "../user/Avatar";
import type { UserGame, gameList, players } from './interface_game'
import PlayerOne from './PlayerOne';
import PlayerTwo from './PlayerTwo';


const HeaderGame = (props: {games: gameList[], room: number }) => {
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
            const index = games.findIndex((game:gameList) => +game.roomN == +roomN);
            if (index != -1){
                setPlayers( {playerL: games[index].playerL, playerR: games[index].playerR} );
            }
        }
	}, [games]);


    if(players.playerL && players.playerR){
        return (
            <div className="container-match" style={{backgroundColor: "white",
                                                    border: "solid" ,
                                                    borderBlockColor:"black" } } >
                <PlayerOne  style={{backgroundColor: "white"}} player={players.playerL} winner={{} as UserGame} sizeAvatar={"l"} />
                <p className='vs'> VS </p>
            
                <PlayerTwo  player={players.playerR} winner={{} as UserGame}  sizeAvatar={"l"} />
            </div>
        );
    }
}

export default HeaderGame;