import React, { useEffect, useState } from 'react'
// import io, { Socket } from "socket.io-client"
import Canvas from './Canvas'
import './Game.css'
import '../../style/OptionGame.css'
import type { gameInit, gameState, gameWinner } from './type'
//import { Socket } from 'socket.io-client';
import { socket } from '../../service/socket';
import ColorModal from './modal.tsx/ColorModal';
import { Link, useLocation } from "react-router-dom";
import SideBar from '../SideBar';
import style from '../../style/Menu.module.css';
// import { useHistory } from 'react-router-dom';

// const history = useHistory();


function OptionGame () {
    const [activeLink, setActiveLink] = useState('');
    const location = useLocation();

    useEffect(() => {
        setActiveLink(location.pathname);
      }, [location.pathname]);

    // const handleLinkClick = (path: string) => {
    //     setActiveLink(path);
    //     // socket?.emit('play', 'play');
    //   };

//     const handleClick = () => {
//         socket?.emit('play', 'play');
// console.log('33 emit play');
//       };

      function handleClick () {
console.log('37 emit play game');
        socket?.current.emit('play', 'play');
      }

    return (
        <>
            <div className={style.mainPos}>
				<SideBar title="Settings" />
            
                
                <div>
                    <div className="card">
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
                    <Link to="/game/play" onClick={handleClick}> Play Games  </Link> 
                         {/* <button onClick={handleClick}>Play Games</button> */}
                         {/* <Link to="/game/play" 
                           onClick={ () => handleLinkClick( setActiveLink("/game/play") )  }
                            >Play Games
                     </Link> */}

                     </div>
                    
                </div>
            </div>  
        </>
    );
}
export default OptionGame;
