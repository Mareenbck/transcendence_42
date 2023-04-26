import React, { useEffect, useState, useContext } from 'react'
import './Game.css'
import '../../style/OptionGame.css'
import ColorModal from './modal.tsx/ColorModal';
import { Link, useLocation } from "react-router-dom";
import SideBar from '../SideBar';
import style from '../../style/Menu.module.css';
import AuthContext from '../../store/AuthContext';
import useSocket from '../../service/socket';
import MyAvatar from '../user/Avatar';
import { UserChat } from '../../interfaces/iChat'
import { UserGame, gamesList } from './interface';

function OptionGame () {
    const user = useContext(AuthContext);
    const id = user.userId;
    const [activeLink, setActiveLink] = useState('');

    const location = useLocation();
    const [sendMessage, addListener] = useSocket();
    const [games, setOnlinePlayers] = useState<gamesList[]> ([]);


    // useEffect(() => {
    //     setActiveLink(location.pathname);
    //   }, [location.pathname]);

    // const handleLinkClick = (path: string) => {
    //     setActiveLink(path);
    //   };

//Game request: click on the button
    useEffect(() => {
        addListener("gameRooms", (games: gamesList[]) => {
    // console.log('gameRooms ', games);
            setOnlinePlayers(games);
        });
    })

// function GameButton({ user, playGame }) {
    const [clicked, setClicked] = useState(false);

    const handleClick = (roomN: number) => {
//console.log('playGame sendMessage', user);
        sendMessage("playGame", {user: user, roomN: roomN});
        setClicked(true);
    };

    return (
        <>
            <div className={style.mainPos}>
				<SideBar title="Settings" />


                <div>
                    <div className="card-option">
                         <p >Select your favorite color</p>
                    </div>
                    <div className="posColor">
                    <button  className = "circlebtn" /*onClick={props.changColorToRed} */  style={{backgroundColor: "red"}} ></button>
						<button  className = "circlebtn" /*onClick={props.changColorToBlue}*/ style={{backgroundColor: "blue"}}></button>
						<button  className = "circlebtn" /*onClick={props.changColorToGreen}*/ style={{backgroundColor: "green"}}></button>
						<button  className = "circlebtn" /*onClick={props.changColorToBlack}*/ style={{backgroundColor: "black"}}></button>
                    </div>
                    <br />
                    <br />
{/* /LIST OF CURRENT GAME with button "Watch*/}
                        <div>
                            {games.map((game: gamesList) => (
                                <Link to={'/game/play'} onClick={() => handleClick(game.roomN)}>Room {game.roomN} ({game.playerR.username} vs {game.playerL.username})</Link>
                            ))}
                        </div>
{/* /LIST OF CURRENT GAME */}
                        <div className="btn">
                          {/* <Link to="/game/play"
                           onClick={ () => handleLinkClick( setActiveLink("/game/play") )  } */}
                        <Link to={'/game/play'} onClick={() => handleClick(-1)}>Play Game</Link>
                     </div>

                </div>
            </div>
        </>
    );
}
export default OptionGame;
