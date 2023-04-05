import React, { useEffect, useState, useContext, useRef } from 'react'
import AuthContext from '../../store/AuthContext';
//import io, { Socket } from "socket.io-client"
import Canvas from './Canvas'
import Winner from './Winner'
import './Game.css'
import type { gameInit, gameState, gameWinner, player} from './type'
import { socket } from '../../service/socket';


function Game() {
    const user = useContext(AuthContext);
    const [users, setOnlineSpectators] = useState<[player]> ();
    const [players, setOnlinePlayers] = useState<[player]> ();

    const [gameinit, setGameInit] = useState<gameInit>(
        {
            width: 600,
            height: 300,
            table_width: 300,
            table_height: 200,
            ballR: 10,
            racket_width: 5,
            racket_height: 80,
            scoreR: 0,
            scoreL: 0
        }
    );

//initialization of the initial parameters of the game (coordinates)
    const [gamestate, setGameState] = useState<gameState>(
        {
            ball: {x: 400, y: 200},
            racket1: {x: 10, y: 150},
            racket2: {x: 790 - gameinit.racket_width , y: 150},
            scoreR: 0,
            scoreL: 0
        }
    );

    const [gamewinner, setGameWinner] = useState<gameWinner>(
       {
            winner: '',
            leave: ''
       } 
    );
    
    const initListener = (data: gameInit)=>{
        setGameInit(data);
    }
    const updateListener = (data: gameState)=>{
        setGameState(data);
    }
    const initWinner = (data: gameWinner)=>{
        setGameWinner(data);
    }

//////////////////////////////////////////////////////////

    useEffect(() => {
console.log(user);
        socket.emit("addUser", user);
    },[user]);

    useEffect(() => {
        socket.on("getPlayers", (players: React.SetStateAction<[player] | undefined>) => {
            setOnlinePlayers(players);
        });
    })

    useEffect(() => {
        socket.on("getSpectators", (users: React.SetStateAction<[player] | undefined>) => {
            setOnlineSpectators(users);
        });
    })

// console.log('players front', players);
// console.log('users Front', users)
///////////////////////////////////////////////////////

//get data from the server and redraw canvas
    useEffect(() => {
        socket?.on('init-pong', initListener);
        socket?.on('pong', updateListener);
        socket?.on('winner', initWinner )
    console.log("winner = ", gamewinner.winner);        
        return () => {
            socket?.off('init-pong', initListener);
            socket?.off('pong', updateListener);
            socket?.off('pong', initWinner);

        }
    }, [initListener, updateListener, initWinner])
    
 //responsive: fnd the ratio between the min value of the picture (server) atd the actual  



// onKeyDown handler function
	const keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
console.log("event.code = ", event.code);
		if (event.code === "ArrowUp") {
			socket?.emit('move', "up")
		}
		if (event.code === "ArrowDown") {
			socket?.emit('move', "down")
		}
	};

    if (!gamewinner.winner){
        return (
            <div tabIndex={0} onKeyDown={keyDownHandler}>
                <h2> Game </h2>
                <div>
                    <Canvas gamestate={gamestate} gameinit={gameinit} gamewinner={gamewinner} />
                </div>
            </div>
        );
    }
    else {
        return (
            <div tabIndex={0} onKeyDown={keyDownHandler}>
                <h2> WINNER </h2>
                <div>
                    <Winner gameinit={gameinit} gamewinner={gamewinner} />
                </div>
            </div>
        );
    }
}

export default Game;