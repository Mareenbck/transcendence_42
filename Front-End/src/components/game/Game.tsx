import React, { useEffect, useState, useContext, useRef } from 'react'
import AuthContext from '../../store/AuthContext';
import Canvas from './Canvas'
import Winner from './Winner'
import type { gameInit, gameState, gameWinner, player, gamesList } from './interface_game'
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
    /////////////////////////////////////////Page Game/////////////////////////////////////
        const user = useContext(AuthContext);
        const id = user.userId;
        const [sendMessage, addListener] = useSocket()
        const [activeLink, setActiveLink] = useState('');
        const location = useLocation();
        const [games, setOnlinePlayers] = useState<gamesList[]> ([]);
        const [isruning, setIsRuning] = useState<boolean>(false);



        useEffect(() => {
    // onKeyDown handler function
            const keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    //console.log("event.code = ", event.code);
                if (event.code === "ArrowUp") {
                    sendMessage('move', "up" as any)
                }
                if (event.code === "ArrowDown") {
                    sendMessage('move', "down" as any)
                }
            };

            // Attach the event listener to the window object
            window.addEventListener('keydown', keyDownHandler);

            // Remove the event listener when the component unmounts
            return () => {
              window.removeEventListener('keydown', keyDownHandler);
            };
          }, []);

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
     //initialization of the initial parameters of the game
        const [gameinit, setGameInit] = useState<gameInit>(
            {
                table_width: 800,
                table_height: 400,
                ballR: 15,
                racket_width: 10,
                racket_height: 100,
                scoreR: 0,
                scoreL: 0,
                winner: null,
            }
        );

    // game parameters update (coordinates ball and racket)
        const [gamestate, setGameState] = useState<gameState>(
            {
                ball: {x: 400, y: 200},
                racket1: {x: 10, y: 150},
                racket2: {x: 790 - gameinit.racket_width , y: 150},
                scoreR: 0,
                scoreL: 0,
            }
        );

        const [gamewinner, setGameWinner] = useState<gameWinner>(
           {
                winner: null,
           }
        );

        const initListener = (data: gameInit)=>{
            setIsRuning(true);
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
        // console.log("pong", gameinit);
            // return () => {
            //     socket?.off('init-pong', initListener);
            //     socket?.off('pong', updateListener);
            //     socket?.off('pong', initWinner);
            // }
    //        sendMessage('doIplay');
        }, [initListener, updateListener, initWinner])

    /////////////////////////////////////////Page OptionGame/////////////////////////////////////

    // useEffect(() => {
    //     setActiveLink(location.pathname);
    //   }, [location.pathname]);

    // const handleLinkClick = (path: string) => {
    //     setActiveLink(path);
    //   };

    //Game request: click on the button
    useEffect(() => {
        addListener("gameRooms", (games: gamesList[]) => {
    //console.log('gameRooms ', games);
            setOnlinePlayers(games);
        });
        sendMessage('listRooms');
    }, [])

    const isInPlay = (): boolean => {
        return games.some(room => room.playerL.username == user.username || room.playerR.username == user.username);
    };

    // function GameButton({ user, playGame }) {
    const [clicked, setClicked] = useState(false);

    const handleClick = (roomN: number) => {
    //console.log('playGame sendMessage', user);
        sendMessage("playGame", {user: user, roomN: roomN});
        setClicked(true);
    };
    //////////////////////////////////////////////////////////////////////////

    if (!gamewinner.winner){
        return (
            <>
            <div className={style.mainPos}>
            <SideBar title="Option Game" />
                <div className='container-optionPage'>
                    <h1 className='titre_option'></h1>

                    {/* <SelectColor /> */}
                    <button onClick={handleColorModal}>Change Color</button>
                    <div>


                <Canvas gamestate={gamestate} gameinit={gameinit} gamewinner={gamewinner} backColorGame={backColorGame}  />
                {/* { ShowCamva && <Canvas gamestate={gamestate} gameinit={gameinit} gamewinner={gamewinner} backColorGame={backColorGame}  />} */}
                {ShowColorModal && <ColorModal handelClose={handleClose}  changColorToRed={changColorToRed}
                                                                            changColorToBlue={changColorToBlue}
                                                                            changColorToGreen={changColorToGreen}
                                                                            changColorToBlack={changColorToBlack}
                                                                            />}
                {/* {!ShowCamva && <Canvas gamestate={gamestate} gameinit={gameinit} gamewinner={gamewinner} backColorGame={backColorGame}  />} */}

            </div>
{/* /LIST OF CURRENT GAME with button "Watch*/}
                <div className='card-wrapper'>
						<Card color='yellow' title="List of online Games" type="match" width="90%"></Card>
                </div>


                <div>
                    {games.map((game: gamesList) => (
                        <button  onClick={() => handleClick(game.roomN)}>Room {game.roomN} ({game.playerR.username} vs {game.playerL.username})</button>
                    ))}
                </div>
{/* /LIST OF CURRENT GAME */}
                {!isInPlay() && (
                <>
                <div className="btn">

                <button  onClick={() => handleClick(-1)}>Play Game</button>
                </div>
                </>)}

            </div>
        </div>
    </>
        );
    }
    else {
        return (
        <>
            <h2> WINNER </h2>
                <div>
                    <Winner gameinit={gameinit} gamewinner={gamewinner} />
                </div>
        </>
        );
    }

}

export default Game;
