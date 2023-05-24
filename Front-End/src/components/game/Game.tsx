import React, { useEffect, useState, useContext, useRef } from 'react'
import AuthContext from '../../store/AuthContext';
import Canvas from './Canvas'
import type { GameInit, GameState, GameWinner, GamesList, UserGame } from './interface_game'
import { GameStatus } from './interface_game'
import useSocket from '../../service/socket';
import MyAvatar from '../user/Avatar';
import { Link } from "react-router-dom";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BrightnessLowIcon from '@mui/icons-material/BrightnessLow';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import SelectColor from './SelectColor';
import PlayerOne from './PlayerOne';
import ScoresMatch from './ScoresMatch';
import PlayerTwo from './PlayerTwo';
import ColorModal from '../modal/ColorModal';
import RefusModal from '../modal/RefusModal';
import '../../style/OptionGame.css';
import "./Game.css"


function Game() {
    const user = useContext(AuthContext);
    const id = user.userId;
    const [sendMessage, addListener] = useSocket();
    const [gamesWinner, setGameWinner] = useState<GameWinner>(
        {   winner: null,
            playerR: {} as UserGame,
            playerL: {} as UserGame,
        }
    );
    const [status, setGameStatus] = useState<GameStatus> (GameStatus.NULL);
    const [games, setOnlinePlayers] = useState<GamesList[]> ([]);
    const [curroom, setCurRoom] = useState<number>(-1);

//getting data about all games: roomN, playerR, playerL, scoreR, scoreL
    useEffect(() => {
        const handleGameRooms = (games: GamesList[]) => {
            if(curroom == -1){
                const index = games.findIndex(room => room.playerL.username == user.username || room.playerR.username == user.username);
                if (index != -1) {
                    const roomN = games[index].roomN;
                    setCurRoom(roomN);
                }
            }
            setOnlinePlayers(games);
        }
        addListener("gameRooms", handleGameRooms);
        sendMessage('listRooms', {} as any);
    }, []);

//event: entre to game's page
    useEffect(() => {
        sendMessage("enterGame", {} as any);
        return () => {
            if( status == GameStatus.GAME || status == GameStatus.WAIT) {
                sendMessage("exitGame", { user: user.userId, status: status } as any);
            }
        }
    }, []);


    const getCurrentGame = (roomN: number) => {
        if (games){
            const index = games.findIndex((game:GamesList) => game.roomN == roomN);
            if (index != -1){
                const game:GamesList = games[index];
                const playerL = game.playerL;
                const playerR = game.playerR;

                return (
                    <>
                    <div className="container-match" style={{backgroundColor: "white",
                                                            border: "solid" ,
                                                            borderBlockColor:"black" } } >
                        <PlayerOne  style={{backgroundColor: "white"}} player={playerL} winner={""} sizeAvatar={"l"} />
                        <p className='vs'> VS</p>
                        <PlayerTwo  player={playerR} winner={""}  sizeAvatar={"l"} />
                    </div>
                    </>
                );
            }
        }
    };


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


// Pour partis de Modal select Color,
    const [ShowColorModal, setShowColorModal] = useState(false);
    // const handleColorModal = () => {
    //     setShowColorModal(true)
    // }
    const handleClose = () => {
       setShowColorModal(false)
    }
    const handleGameRefuse = () => {
        setGameStatus(GameStatus.NULL);
    }

    const [ShowCamva, setShowCamva] = useState(true);
    const [backColorGame, setbackColorGame] = useState<string>("black");
    const changColorToRed= () => {
        setbackColorGame("#699BF7");
        setShowColorModal(false);
        ShowCamva? setShowCamva(false): setShowCamva(true);
    }

    const changColorToBlue= () => {
        setbackColorGame("#C7B9FF");
        setShowColorModal(false);
        ShowCamva? setShowCamva(false): setShowCamva(true);
    }

    const changColorToGreen= () => {
        setbackColorGame("#FF5166");
        setShowColorModal(false);
        ShowCamva? setShowCamva(false): setShowCamva(true);
    }

    const changColorToBlack= () => {
        setbackColorGame("black");
        setShowColorModal(false);
        ShowCamva? setShowCamva(false): setShowCamva(true);
    }

    // useEffect(() => {

    // }, [backColorGame])


//initialization of the initial parameters of the game
    const [gameinit, setGameInit] = useState<GameInit>(
        {
            table_width: Math.floor(0.6 * window.innerWidth),
            table_height: 0.5,
            ballR: 0.015,
            racket_width: 0.010,
            racket_height: 0.100,
            scoreR: 0,
            scoreL: 0,
        }
    );

// game parameters update (coordinates ball and racket)
    const [gamestate, setGameState] = useState<GameState>(
        {
            ball: {x: 0.500, y: 0.250},
            racket1: {x: 0.010, y: 0.150},
            racket2: {x: 0.990 - gameinit.racket_width , y: 0.150},
            scoreR: 0,
            scoreL: 0,
        }
    );

// the responsive game
    useEffect(() => {
        const updateWidth = () => {
            // window.screen.width
            const width = Math.floor(0.6 * window.innerWidth);
            if(width){
                setGameInit({
                    table_width: width,
                    table_height: gameinit.table_height,
                    ballR: gameinit.ballR,
                    racket_width: gameinit.racket_width,
                    racket_height: gameinit.racket_height,
                    scoreR: gameinit.scoreR,
                    scoreL: gameinit.scoreL})
            }
        };
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    });

    const initListener = (data: GameInit)=>{
        const width = Math.floor(0.6 * window.innerWidth);
        if(width){
            data.table_width = width;
        }
        setGameInit(data);
    }

    const updateListener = (data: GameState)=>{
        setGameState(data);
    }

    const updateWinner = (data: GameWinner)=>{
        setGameWinner(data);
    }

    const updateStatus = (data: GameStatus)=>{
        setGameStatus(data);
    }

//get data from the server and redraw canvas
    useEffect(() => {
        addListener('init-pong', initListener);
        addListener('pong', updateListener);
        addListener('winner', updateWinner);
        addListener('status', updateStatus);

    }, [initListener, updateListener, updateWinner, updateStatus]);

    const isInPlay = (): boolean => {
        return games.some((room:GamesList)  => room.playerL.username == user.username || room.playerR.username == user.username);
    };

// action when clicking on "PlayGame"
    const handleClick = (roomN: number) => {
        gamesWinner.winner = null;
        sendMessage("playGame", {roomN: roomN} as any);
        setCurRoom(roomN);
    };

//////////////////////////////////////////////////////////////////////////////

    return (
        <React.Fragment key={user.userId}>

        {" "}
        <div className="containerGame">
            <div className="gameSideL">

                <div className="title">
                    <MyAvatar  id={user.userId} style="l" avatar={user.avatar} ftAvatar={user.ftAvatar}/>
                    <h4>{user.username}</h4>
                </div>

                <SelectColor changColorToRed={changColorToRed}
                            changColorToBlue={changColorToBlue}
                            changColorToGreen={changColorToGreen}
                            changColorToBlack={changColorToBlack}>
                </SelectColor>

                <div className='posBtnn' >
                    {/* /BUTTON FOR GAME START */}
                    {!isInPlay() && (
                        <div >
                            <button className="btnn" onClick={() => handleClick(-1)}><SportsTennisIcon/>Play</button>
                        </div>
                    )}

                    {/* /EXIT FROM THE GAME. IF GAME FINISHED*/}
                    <Link to="/menu">
                        <button className="btnn" onClick={() => sendMessage("exitGame", {status: status} as any)} style={{ alignSelf: "flex-end" }}>
                            <ExitToAppIcon /> Exit
                        </button>
                    </Link>

                </div>

            </div>

            <div className="gameBox">
                <div className="gameBoxW">

                    {(!gamesWinner.winner) ? (
                    <>
                            {(status == GameStatus.CLOSE) &&  <RefusModal handleClose={handleGameRefuse}/>}

                            { (status == GameStatus.WATCH || status == GameStatus.GAME) ?
                                (getCurrentGame(curroom))
                                :
                                ( <h2 className='gametitle'>Pong</h2>)
                            }

                            {(status == GameStatus.WAIT) ?
                        (
                            <div className='wrapWaiting'>
                                <div className="center">
                                    <h1 className="blink"> Waiting your opponent</h1>
                                    <div className="circle"></div>
                                </div>
                            </div>
                        ):(
                            <div>
                                {ShowCamva && <Canvas gamestate={gamestate} gameinit={gameinit} backColorGame={backColorGame}  />}
                                {ShowColorModal && <ColorModal handelClose={handleClose}  changColorToRed={changColorToRed}
                                                                                            changColorToBlue={changColorToBlue}
                                                                                            changColorToGreen={changColorToGreen}
                                                                                            changColorToBlack={changColorToBlack}
                                                                                            />}
                                { !ShowCamva && <Canvas gamestate={gamestate} gameinit={gameinit} backColorGame={backColorGame}  />}

                            </div>
                        )}
                    </>
                    ):(
                    <>
                        <div className="container-match" style={{backgroundColor: "white",
                                                                    border: "solid" ,
                                                                    borderBlockColor:"black" } } >
                                <PlayerOne  style={{backgroundColor: "white"}} player={gamesWinner.playerL} winner={gamesWinner.winner} sizeAvatar={"l"} />
                                <p className='vs'> VS</p>

                                <PlayerTwo  player={gamesWinner.playerR} winner={gamesWinner.winner}  sizeAvatar={"l"} />
                            </div>

                        <section className='sctWin'>
                            <h1> WINNER </h1>
                            <div className='CapWinner'>
                                <MyAvatar  id={gamesWinner.winner.id} style="l" avatar={gamesWinner.winner.avatar} ftAvatar={gamesWinner.winner.ftAvatar}/>
                                <BrightnessLowIcon id = "win" className='star' />
                            </div>
                        </section>
                    </>
                    )}
			</div>
		</div>

        <div className='gameSideR'>
            <h2 className='posH'>Live games</h2>
                <div>
                    {games.map((game: GamesList) => (
                    <div key={game.roomN} className='wrapList'>
                        <div onClick={() => handleClick(game.roomN)}>
                            <div className="container-match">
                            {!isInPlay() &&
                                ( <button  style={{backgroundColor: "with", marginRight:"0", padding:"0"}} onClick={() => handleClick(game.roomN)}><RemoveRedEyeIcon/> </button>)}
                                <PlayerOne player={game.playerL} winner={0} score={game.scoreL} />
                                <ScoresMatch score1={game.scoreL} score2={game.scoreR}/>
                                <PlayerTwo player={game.playerR} winner={0} score={game.scoreR} />
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </div>

    </React.Fragment>
    )
}

export default Game;
