import React, { useEffect, useState } from 'react'
// import io, { Socket } from "socket.io-client"
import Canvas from './Canvas'
import './Game.css'
import type { gameInit, gameState, gameWinner } from './type'
import { Socket } from 'socket.io-client';
import { socket } from '../../service/socket';


function Game() {

    const [gameinit, setGameInit] = useState<gameInit>(
        {
            table_width: 800,
            table_height: 400,
            ballR: 15,
            racket_width: 10,
            racket_height: 100,
            right: 0,
            left: 0
        }
    );

    //initialization of the initial parameters of the game (coordinates)
    const [gamestate, setGameState] = useState<gameState>(
        {
            ball: {x: 400, y: 200},
            racket1: {x: 10, y: 150},
            racket2: {x: 790, y: 150},
            right: 0,
            left: 0
        }
    );

    const [gamewinner, setGameWinner] = useState<gameWinner>(
       {
            winner: '',
            leave: ''
       } 
    )


    const initListener = (data: gameInit)=>{
        setGameInit(data);
    }

    const updateListener = (data: gameState)=>{
        setGameState(data);
    }

    const initWinner = (data: gameWinner)=>{
        setGameWinner(data);
    }

    //get data from the server and redraw canvas
    useEffect(() => {
        socket?.on('init-pong', initListener);
        socket?.on('pong', updateListener);
        socket?.on('winner', initWinner )
          
        return () => {
            socket?.off('init-pong', initListener);
            socket?.off('pong', updateListener);
            socket?.off('pong', initWinner);

        }
    }, [initListener, updateListener, initWinner])

	// onKeyDown handler function
	const keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
//console.log("event.code = ", event.code);
		if (event.code === "ArrowUp") {
			socket?.emit('move', "up")
		}
		if (event.code === "ArrowDown") {
			socket?.emit('move', "down")
		}
		if (event.code === "Space") {
			socket?.emit('move', "start")
		}
	};

    return (
        <div tabIndex={0} onKeyDown={keyDownHandler}>
            <h2> Game </h2>
            <div>
                <Canvas gamestate={gamestate} gameinit={gameinit} gamewinner={gamewinner} />
            </div>
        </div>
    );
}

export default Game;