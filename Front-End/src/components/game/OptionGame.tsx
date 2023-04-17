import React, { useEffect, useState, useContext } from 'react'
// import io, { Socket } from "socket.io-client"
import Canvas from './Canvas'
import './Game.css'
import '../../style/OptionGame.css'
import type { gameInit, gameState, gameWinner , player} from './type'
import { Socket } from 'socket.io-client';
import { socket } from '../../service/socket';
import ColorModal from './modal.tsx/ColorModal';
import { Link, useLocation } from "react-router-dom";
import SideBar from '../SideBar';
import style from '../../style/Menu.module.css';
import AuthContext from '../../store/AuthContext';
import useSocket from '../../service/socket';
import MyAvatar from '../user/Avatar';
import { UserChat } from '../../interfaces/iChat'



function OptionGame () {
    const user = useContext(AuthContext);
    const id = user.userId;
    const [onlineUsers, setOnlineUsers] = useState<UserChat[]> ([]);

    const [activeLink, setActiveLink] = useState('');
    const location = useLocation();
    const [sendMessage, addListener] = useSocket()

    useEffect(() => {
        setActiveLink(location.pathname);
      }, [location.pathname]);

    // const handleLinkClick = (path: string) => {
    //     setActiveLink(path);
    //   };

//Game request: click on the button

// function GameButton({ user, playGame }) {
    const [clicked, setClicked] = useState(false);
  
    const handleClick = () => {
      sendMessage("playGame", user as any);
console.log('playGame sendMessage');
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
                    <div className="btn">
                          {/* <Link to="/game/play"
                           onClick={ () => handleLinkClick( setActiveLink("/game/play") )  } */}
                        <Link to={'/game/play'} onClick={handleClick}>Play Games
                     </Link>
                     </div>

                </div>
            </div>
        </>
    );
}
export default OptionGame;


//to={'/game/play'} onClick={() => inviteGame(o?.userId.userId)}>

// const inviteGame = (playerId :number ) => {
//     console.log(playerId);
//     sendMessage("InviteGame", {
//       author: +id,
//       player: +playerId,
//     } as Invite);
//   }