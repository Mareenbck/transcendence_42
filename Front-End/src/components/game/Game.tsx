import React, { useEffect, useState, useContext, useRef } from 'react'
import AuthContext from '../../store/AuthContext';
import Canvas from './Canvas'
import Winner from './Winner'
import type { gameInit, gameState, gameWinner, player, gamesList } from './interface'
import ColorModal from './modal.tsx/ColorModal';
import useSocket from '../../service/socket';
import MyAvatar from '../user/Avatar';
import '../../style/OptionGame.css';
import { Link, useLocation } from "react-router-dom";
import SideBar from '../SideBar';
import style from '../../style/Menu.module.css';
import { UserChat } from '../../interfaces/iChat';

import SelectColor from './SelectColor';
import Card from "../../components/utils/Card";

function Game() {
    const user = useContext(AuthContext);
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
    const id = user.userId;
    const [activeLink, setActiveLink] = useState('');

    const location = useLocation();
   
   
    const [games, setOnlinePlayers] = useState<gamesList[]> ([]);

    useEffect(() => {
        setActiveLink(location.pathname);
    });
    //initialization of the initial parameters of the game
    /*const [gameinit, setGameInit] = useState<gameInit>(
        {
            table_width: 800,
            table_height: 400,
            ballR: 15,
            racket_width: 10,
            racket_height: 100,
            scoreR: 0,
            scoreL: 0
        }
    );*/
    useEffect(() => {
        addListener("gameRooms", (games: gamesList[]) => {
    //console.log('gameRooms ', games[0].playerR.user.username);
    //console.log('gameRooms ', games[0].playerL.user.username);
            setOnlinePlayers(games);
        });
    });
    // function GameButton({ user, playGame }) {
        const [clicked, setClicked] = useState(false);
  
        const handleClick = (roomN: number) => {
    //console.log('playGame sendMessage', user);
            sendMessage("playGame", {user: any, roomN: roomN});
          setClicked(true);
        }
        
    
     //initialization of the initial parameters of the game
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


    // game parameters update (coordinates ball and racket)
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

//get data from the server and redraw canvas
    useEffect(() => {
        addListener('init-pong', initListener);
        addListener('pong', updateListener);
        addListener('winner', initWinner )
    console.log("pong", gameinit);        
        // return () => {
        //     socket?.off('init-pong', initListener);
        //     socket?.off('pong', updateListener);
        //     socket?.off('pong', initWinner);
        // }
    }, [initListener, updateListener, initWinner])

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
            <>
        <div tabIndex={0} onKeyDown={keyDownHandler}>
                    
            <div className={style.mainPos}>
            <SideBar title="Option Game" />
                <div className='container-optionPage'>
                    <h1 className='titre_option'></h1>
                
                    {/* <SelectColor /> */}
                    <button onClick={handleColorModal}>Change Color</button>
                    <div>
                    

                { ShowCamva && <Canvas gamestate={gamestate} gameinit={gameinit} gamewinner={gamewinner} backColorGame={backColorGame}  />}
                {ShowColorModal && <ColorModal handelClose={handleClose}  changColorToRed={changColorToRed} 
                                                                            changColorToBlue={changColorToBlue}
                                                                            changColorToGreen={changColorToGreen}
                                                                            changColorToBlack={changColorToBlack}
                                                                            />}
                {!ShowCamva && <Canvas gamestate={gamestate} gameinit={gameinit} gamewinner={gamewinner} backColorGame={backColorGame}  />}

            </div> 
{/* /LIST OF CURRENT GAME with button "Watch*/}
                <div className='card-wrapper'>
						<Card color='yellow' title="List of online Games" type="match" width="90%"></Card>
                </div>
                    

                <div>
                    {games.map((game: gamesList) => (
                        <Link to={'/game/play'} onClick={() => handleClick(game.roomN)}>Room {game.roomN} ({game.playerR.user.username} vs {game.playerL.user.username})</Link>
                    ))}
                </div>
{/* /LIST OF CURRENT GAME */}

                <div className="btn">

                <Link to={'/game/play'} onClick={() => handleClick(-1)}>Play Game</Link>
                </div>

                </div>
            </div>
        </div>

    </> 
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