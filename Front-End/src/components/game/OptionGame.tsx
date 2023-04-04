import React, { useEffect, useState } from 'react'
// import io, { Socket } from "socket.io-client"
import Canvas from './Canvas'
import './Game.css'
import type { gameInit, gameState, gameWinner } from './type'
import { Socket } from 'socket.io-client';
import { socket } from '../../service/socket';
import ColorModal from './modal.tsx/ColorModal';



function OptionGame() {
    return (
        <div tabIndex={0} onKeyDown={keyDownHandler}>
            
                <h2 > Options Game </h2>
                <div>
                     <button /*onClick={handleColorModal}*/>Change Color</button>
                   
                     <button >Play</button>
                   
                    
                </div>
              
        </div>
    );
}
export default OptionGameGame;
