import React, { useEffect, useState, useContext, useRef } from 'react'
import AuthContext from '../../store/AuthContext';
//import io, { Socket } from "socket.io-client"
import Canvas from './Canvas'
import Winner from './Winner'
import './Game.css'
import type { gameInit, gameState, gameWinner, player } from './type'
//import { socket } from '../../service/socket';
import ColorModal from './modal.tsx/ColorModal';
import useSocket from '../../service/socket';




function Game() {
    const user = useContext(AuthContext);
    const [users, setOnlineSpectators] = useState<[player]> ();
    const [players, setOnlinePlayers] = useState<[player]> ();
    const [sendMessage, addListener] = useSocket()


    // Pour partis de Modal select Color,
    
    const [ShowColorModal, setShowColorModal] = useState(false); 
    const handleColorModal = () => {
        setShowColorModal(true)
    }
    const handleClose = () => {
        setShowColorModal(false)
    }


    const [ShowCamva, setShowCamva] = useState(true); 
    const [backColorGame, setbackColorGame] = useState<string>("black");
    const changColorToRed= () => {    
        setbackColorGame("red");
        setShowColorModal(false);
        ShowCamva? setShowCamva(false): setShowCamva(true);
    }
    
    const changColorToBlue= () => {    
        setbackColorGame("blue");
        setShowColorModal(false);
        ShowCamva? setShowCamva(false): setShowCamva(true);
    }

    const changColorToGreen= () => {    
        setbackColorGame("green");
        setShowColorModal(false);
        ShowCamva? setShowCamva(false): setShowCamva(true);
    }

    const changColorToBlack= () => {    
        setbackColorGame("black");
        setShowColorModal(false);
        ShowCamva? setShowCamva(false): setShowCamva(true);
    }

    useEffect(() => {

    }, [backColorGame])

    
    //**** *******************************************************************/

    const [gameinit, setGameInit] = useState<gameInit>(
        {
            table_width: 800,
            table_height: 400,
            ballR: 15,
            racket_width: 10,
            racket_height: 100,
            scoreR: 0,
            scoreL: 0
        }
    );
    // const [gameinit, setGameInit] = useState<gameInit>(
    //     {
    //         table_width: window.innerWidth,
    //         table_height: window.innerHeight,
    //         ballR: 15,
    //         racket_width: 10,
    //         racket_height: 100,
    //         scoreR: 0,
    //         scoreL: 0
    //     }
    // );


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

//     useEffect(() => {
// //console.log(user);
//         socket.emit("addUser", user);
//     },[user]);

    useEffect(() => {
        addListener("getPlayers", (players: React.SetStateAction<[player] | undefined>) => {
            setOnlinePlayers(players);
        });
    })

   // console.log('players front', players);
// console.log('users Front', users)
///////////////////////////////////////////////////////

    //get data from the server and redraw canvas
//     useEffect(() => {
//         socket?.on('init-pong', initListener);
//         socket?.on('pong', updateListener);
//         socket?.on('winner', initWinner )
//    // console.log("winner = ", gamewinner.winner);        
//         return () => {
//             socket?.off('init-pong', initListener);
//             socket?.off('pong', updateListener);
//             socket?.off('pong', initWinner);

//         }
//     }, [initListener, updateListener, initWinner])

//get data from the server and redraw canvas
    useEffect(() => {
        addListener('init-pong', initListener);
        addListener('pong', updateListener);
        addListener('winner', initWinner )
   // console.log("winner = ", gamewinner.winner);        
        // return () => {
        //     socket?.off('init-pong', initListener);
        //     socket?.off('pong', updateListener);
        //     socket?.off('pong', initWinner);

        // }
    }, [initListener, updateListener, initWinner])


	// onKeyDown handler function
	// const keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
//console.log("event.code = ", event.code);
	// 	if (event.code === "ArrowUp") {
	// 		socket?.emit('move', "up")
	// 	}
	// 	if (event.code === "ArrowDown") {
	// 		socket?.emit('move', "down")
	// 	}
	// };

    // onKeyDown handler function
	const keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
console.log("event.code = ", event.code);
		if (event.code === "ArrowUp") {
			sendMessage('move', "up" as any)
		}
		if (event.code === "ArrowDown") {
			sendMessage('move', "down" as any)
		}
	};

    if (!gamewinner.winner){
        return (
            <div tabIndex={0} onKeyDown={keyDownHandler}>
                <h2> Game </h2>
                <div>
                     <button onClick={handleColorModal}>Change Color</button>

                    { ShowCamva && <Canvas gamestate={gamestate} gameinit={gameinit} gamewinner={gamewinner} backColorGame={backColorGame}  />}
                    {ShowColorModal && <ColorModal handelClose={handleClose}  changColorToRed={changColorToRed} 
                                                                              changColorToBlue={changColorToBlue}
                                                                              changColorToGreen={changColorToGreen}
                                                                              changColorToBlack={changColorToBlack}
                                                                              />}
                    {!ShowCamva && <Canvas gamestate={gamestate} gameinit={gameinit} gamewinner={gamewinner} backColorGame={backColorGame}  />}

                    
                {/* <Canvas gamestate={gamestate} gameinit={gameinit} gamewinner={gamewinner}   //>*/}
                    
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
    /*return (
        <div tabIndex={0} onKeyDown={keyDownHandler}>
            
                <h2 > Game </h2>
                <div>
                     <button onClick={handleColorModal}>Change Color</button>
                   
                    {ShowCamva && <Canvas gamestate={gamestate} gameinit={gameinit} gamewinner={gamewinner} backColorGame={backColorGame}  />}
                    {ShowColorModal && <ColorModal handelClose={handleClose}  changColor={changColor} />}
                    {!ShowCamva && <Canvas gamestate={gamestate} gameinit={gameinit} gamewinner={gamewinner} backColorGame={backColorGame}  />}
                </div>
              
        </div>
    );*/
}

export default Game;