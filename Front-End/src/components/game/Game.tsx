import React, {useEffect, useState } from 'react';
// import io, { Socket } from "socket.io-client"
import Canvas from './Canvas';
import './Game.css';
import SideBar from '../auth/SideBar';
import style from '../../style/Menu.module.css';


const Game = () => {
    // const [] = useState();
    // const [] = useState({20});
       
    
    return (
        
				
            /*<div className={style.mainPos}>
                <SideBar title="Game" />*/
            <div>    
                <h2> Game </h2>
                
                <Canvas width={1200} height={600} ballx={600} bally={300} racket1y={500} racket2y={500} />
            </div>
        
    ); 
}

export default Game