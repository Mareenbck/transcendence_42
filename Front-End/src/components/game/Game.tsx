import React, { useEffect, useState, useContext, useRef } from 'react'
import AuthContext from '../../store/AuthContext';
import Canvas from './Canvas'
// import Winner from './Winner'
import type { gameInit, gameState, gameStatus, gamesList } from './interface_game'
import ColorModal from './modal/ColorModal';
import RefusModal from './modal/RefusModal';
import useSocket from '../../service/socket';
import MyAvatar from '../user/Avatar';
import '../../style/OptionGame.css';
import { Link, useLocation, useBeforeUnload } from "react-router-dom";
import SideBar from '../SideBar';
import style from '../../style/Menu.module.css';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import SelectColor from './SelectColor';
import Card from "../utils/Card";
//import { start } from 'repl';
import PlayerOne from './PlayerOne';
import ScoresMatch from './ScoresMatch';
import PlayerTwo from './PlayerTwo';

function Game() {
    const user = useContext(AuthContext);
    const id = user.userId;
    const [sendMessage, addListener] = useSocket();
    const [activeLink, setActiveLink] = useState('');
    const location = useLocation();
    const [gamestatus, setGameStatus] = useState<gameStatus>(
        {   winner: null,
            status: "null"} 
    );  
    const [games, setOnlinePlayers] = useState<gamesList[]> ([]);
    const [curroom, setCurRoom] = useState<number>(-1);
    
//getting data about all games: roomN, playerR, playerL, scoreR, scoreL
    useEffect(() => {
        const handleGameRooms = (games: gamesList[]) => {
        //console.log('gameRooms ', games);
            if(curroom == -1){
                const index = games.findIndex(room => room.playerL.username == user.username || room.playerR.username == user.username);
                if (index != -1) {   
                    setCurRoom(games[index].roomN);
                }
            }
            setOnlinePlayers(games);
        }

        addListener("gameRooms", handleGameRooms);
        sendMessage('listRooms');
    }, []);

//event when user leaves the page   
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
          // Do something before the page is unloaded
          alert("you leave page");
        }
    
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
      }, []);
    
//     useBeforeUnload(() => {
//     // Execute code before the user navigates away from the page
// alert('Leaving the page...');
//     });    
   
// onKeyDown handler function

    const onkeyPress = (event: KeyboardEvent) => {
        event.preventDefault();
        if (event.code === "ArrowUp") {
            sendMessage('move', "up" as any)
        }
        if (event.code === "ArrowDown") {
            sendMessage('move', "down" as any)
        }
    };

    useEffect(() => {
// Attach the event listener to the window object
        window.addEventListener('keydown', onkeyPress);
        
        return () => {
        // Remove the event listener when the component unmounts
            window.removeEventListener('keydown', onkeyPress);
        }
    }, []);

    // useEffect(() => {
    //     const keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    //         event.preventDefault();
    //         if (event.code === "ArrowUp") {
    //             sendMessage('move', "up" as any)
    //         }
    //         if (event.code === "ArrowDown") {
    //             sendMessage('move', "down" as any)
    //         }
    //     };

    //     if (gamestatus.status == "game") {
    //         // Attach the event listener to the window object
    //     window.addEventListener('keydown', keyDownHandler);
    //     }
    //     else{
    //     // Remove the event listener when the component unmounts
    //         window.removeEventListener('keydown', keyDownHandler);
    //     }
    // }, [gamestatus]);


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
        setbackColorGame("rgb(158, 28, 28)");
        setShowColorModal(false);
        ShowCamva? setShowCamva(false): setShowCamva(true);
    }

    const changColorToBlue= () => {
        setbackColorGame("rgb(37, 37, 167)");
        setShowColorModal(false);
        ShowCamva? setShowCamva(false): setShowCamva(true);
    }

    const changColorToGreen= () => {
        setbackColorGame("rgb(40, 128, 40)");
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
     
    const initListener = (data: gameInit)=>{
          setGameInit(data);
    }
    const updateListener = (data: gameState)=>{
        setGameState(data);
    }
    const updateStatus = (data: gameStatus)=>{
        setGameStatus(data);
    }

//get data from the server and redraw canvas
    useEffect(() => {
        addListener('init-pong', initListener);
        addListener('pong', updateListener);
        addListener('status', updateStatus);
        // return () => {
        //     socket?.off('init-pong', initListener);
        //     socket?.off('pong', updateListener);
        //     socket?.off('pong', initWinner);
        // }
//        sendMessage('doIplay');
    }, [initListener, updateListener, updateStatus]);

    const isInPlay = (): boolean => {
        return games.some(room => room.playerL.username == user.username || room.playerR.username == user.username);
    };

// action when clicking on "PlayGame"
    const [clicked_play, setClicked] = useState(false);

    const handleClick = (roomN: number) => {
        sendMessage("playGame", {user: user, roomN: roomN});
        gamestatus.winner = null;
        setClicked(true);
    };
//////////////////////////////////////////////////////////////////////////////  

    return (
        <>
        <div className={style.mainPos} >
            <SideBar title="Game" />
                {/* <div className='container-optionPage'> */}
                {/* <div className='wrapWaiting'> */}
                <div className='wrapGaming'>
                    <h1 className='titre_option'></h1>
            {/* /GAME or WINNER*/}
                {(!gamestatus.winner) ? (
                    <>
                        <div className='wrapWaiting'>
                            {(gamestatus.status == 'false') && (<RefusModal handelClose={handleClose}/>)}
                        
                            { (gamestatus.status == 'watch' || gamestatus.status == 'game') ? 
                            
                            // head Game***********
                               (<div >
                                {games.map((game: gamesList) => (
                                    
                                    
                                    <div className="container-matchh">
                                        
                                        <PlayerOne  style={{backgroundColor: "white"}} player={game.playerL} winner={0} score={game.scoreL} sizeAvatar={"l"} />
                                           <p> VS </p>
                                           {/* {game.playerR.username}
                                            <MyAvatar  id={game.playerR.id} style="l" avatar={game.playerR.avatar} ftAvatar={game.playerR.ftAvatar}/>
                                            {game.scoreR }  VS    { game.scoreL}

                                             
                                           <MyAvatar  id={game.playerL.id} style="l" avatar={game.playerL.avatar} ftAvatar={game.playerL.ftAvatar}/>
                                           {game.playerL.username} */}
                                        {/* <ScoresMatch score1={game.scoreR} score2={game.scoreL} sizeAvatar={"l"}/> */}
                                        <PlayerTwo player={game.playerR} winner={0} score={game.scoreR} sizeAvatar={"l"} />
                                    </div>

                                    
                                ))}
                                </div>    
                               )
                            //head Game************
                            :
                                
                            (
                                <SelectColor changColorToRed={changColorToRed}
                                            changColorToBlue={changColorToBlue}
                                            changColorToGreen={changColorToGreen}
                                            changColorToBlack={changColorToBlack}>
                                </SelectColor> ) }    

                            {(gamestatus.status == 'waiting') ? (
                                <div className='.wrapWaiting'>
                                <div className="center">
                                    <h1 className="blink"> Waiting your opponent</h1>
                                    <div className="circle"></div>
                                </div>
                                </div>
                            ):(   

                             <div >                   
                                {ShowCamva && <Canvas gamestate={gamestate} gameinit={gameinit} backColorGame={backColorGame}  />}
                                {ShowColorModal && <ColorModal handelClose={handleClose}  changColorToRed={changColorToRed}
                                                                                            changColorToBlue={changColorToBlue}
                                                                                            changColorToGreen={changColorToGreen}
                                                                                            changColorToBlack={changColorToBlack}
                                                                                            />}
                                { !ShowCamva &&<Canvas gamestate={gamestate} gameinit={gameinit} backColorGame={backColorGame}  />}
                                <div className='posBtn' >
                                    {/* /BUTTON FOR GAME START */}
                                    {!isInPlay() && (
                                        <div >
                                            <button className="btn" onClick={() => handleClick(-1)}>Play Game</button>
                                        </div>
                                    )}
                                    {/* /EXIT FROM THE GAME. IF GAME FINISHED*/}
                                    {!isInPlay() && (
                                        <Link to="/menu">
                                            <button className="btn"  style={{ alignSelf: "flex-end"}}>Menu</button>
                                        </Link>
                                    )}
                                </div>

                            </div>)}
                              {/* <div className='posWating'>
                                    <div className='posBtnWating'> */}
                                        {/* /LIST OF CURRENT GAME */}
                                        {/* {!isInPlay() && (
                                            <div >
                                                <button className="btn" onClick={() => handleClick(-1)}>Play Game</button>
                                            </div>
                                        )} */}
                                        {/* /EXIT FROM THE GAME. IF GAME - THE LOSS*/}
                                        {/* {!isInPlay() && (
                                            <Link to="/menu">
                                                <button className="btn"  style={{ alignSelf: "flex-end"}}>Menu</button>
                                            </Link>
                                        )}
                                    </div>
                              </div> */}
                        </div>
                
                    </>
                        ):(
                    <>
                        <div className='wrapWinner'>
                            <h2> WINNER </h2>
                            
                            {/* <Winner gameinit={gameinit} gamewinner={gamewinner} /> */}
                             <MyAvatar  id={gamestatus.winner.id} style="s" avatar={gamestatus.winner.avatar} ftAvatar={gamestatus.winner.ftAvatar}/>
                             < EmojiEventsIcon id = "win" />

                                <div className='posBtn' >
                                    {/* /BUTTON FOR GAME START */}
                                    {!isInPlay() && (
                                        <div >
                                            <button className="btn" onClick={() => handleClick(-1)}>Play Game</button>
                                        </div>
                                    )}
                                    {/* /EXIT FROM THE GAME. IF GAME FINISHED*/}
                                    {!isInPlay() && (
                                        <Link to="/menu">
                                            <button className="btn"  style={{ alignSelf: "flex-end"}}>Menu</button>
                                        </Link>
                                    )}
                                </div>
                        </div>
                    </>
                )}
                {/* /LIST OF CURRENT GAME with button "Watch*/}
                {/* <div className='card-wrapper'>
					<Card color='yellow' title="List of online Games" type="viweGame" width="90%"></Card>
                </div> */}

                <div>
                    {games.map((game: gamesList) => (
                        <div className='wrapList'>

                        {/* <button  onClick={() => handleClick(game.roomN)}><RemoveRedEyeIcon/> </button> */}
                            <div  onClick={() => handleClick(game.roomN)}>
                                <div className="container-match">
                                    <button  style={{backgroundColor: "#F3F0FF"}} onClick={() => handleClick(game.roomN)}><RemoveRedEyeIcon/> </button>
                                    <PlayerOne player={game.playerL} winner={0} score={game.scoreL} />
                                    <ScoresMatch score1={game.scoreL} score2={game.scoreR}/>
                                    <PlayerTwo player={game.playerR} winner={0} score={game.scoreR} />
                                </div>
                                {/* ({game.playerR.username}
                                <MyAvatar  id={game.playerR.id} style="s" avatar={game.playerR.avatar} ftAvatar={game.playerR.ftAvatar}/>

                                {game.scoreR } vs { game.scoreL}

                                {game.playerL.username})
                                <MyAvatar  id={game.playerL.id} style="s" avatar={game.playerL.avatar} ftAvatar={game.playerL.ftAvatar}/> */}
                            </div>
                         </div>

                    ))}
                </div>
                {/* / */}
               
            </div>
        </div>
     </>
    );
}


export default Game;

//import SportsVolleyballRoundedIcon from '@mui/icons-material/SportsVolleyballRounded';
// {(status == 'false') && (<RefusModal/>)};


// {((!isInPlay() && clicked_play && isagree == 'waiting')) ? (
//     <div class="center">
//         <h1 class="blink"> Waiting your opponent</h1>
//         <div class="circle"></div>
//     </div>
// ) : (
// <>
//     { !isInPlay() ? (<SelectColor changColorToRed={changColorToRed}
//                  changColorToBlue={changColorToBlue}
//                  changColorToGreen={changColorToGreen}
//                 changColorToBlack={changColorToBlack}>
//     </SelectColor> ): (<h1>GAME</h1>)}                   
//     <div>                   
//        { ShowCamva && <Canvas gamestate={gamestate} gameinit={gameinit} gamewinner={gamewinner} backColorGame={backColorGame}  />}
//        {ShowColorModal && <ColorModal handelClose={handleClose}  changColorToRed={changColorToRed}
//                                                                     changColorToBlue={changColorToBlue}
//                                                                     changColorToGreen={changColorToGreen}
//                                                                     changColorToBlack={changColorToBlack}
//                                                                     />}
//         { !ShowCamva &&<Canvas gamestate={gamestate} gameinit={gameinit} gamewinner={gamewinner} backColorGame={backColorGame}  />}
//     </div>
// </>)}