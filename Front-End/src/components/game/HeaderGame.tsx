import React from "react";
import './Game.css'
import type { UserGame } from './interface_game'
import PlayerOne from './PlayerOne';
import PlayerTwo from './PlayerTwo';


const HeaderGame = (props: any): React.JSX.Element => {

	// useEffect(() => {
    //     if (games){
    //         const index = games.findIndex((game:gameList) => +game.roomN == +roomN);
    //         if (index != -1){
    //             setPlayers( {playerL: games[index].playerL, playerR: games[index].playerR} );
    //         }
    //     }
	// }, [games]);
    const playerL: UserGame = props.playerL;
    const playerR: UserGame = props.playerR;

    return (
        <div className="container-match" style={{backgroundColor: "white",
                                            border: "solid" ,
                                            borderBlockColor:"black" } } >
            { (playerL && playerR) && (
            <>
            <PlayerOne  style={{backgroundColor: "white"}} player={playerL} winner={{} as UserGame} sizeAvatar={"l"} />
            <p className='vs'> VS </p>
        
            <PlayerTwo  player={playerR} winner={{} as UserGame}  sizeAvatar={"l"} />
            </>)}
        </div>
    )
}

export default HeaderGame;