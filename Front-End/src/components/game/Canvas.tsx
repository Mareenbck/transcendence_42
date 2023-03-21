import React, {useRef, useEffect, useState} from 'react'
import './Game.css'
import type {gameInit, gameState, gameWinner} from './type'

const Canvas = (props: {gamestate: gameState, gameinit: gameInit, gamewinner: gameWinner} ): JSX => {
    const gamestate = props.gamestate;
    const gameinit = props.gameinit;
    const gamewinner = props.gamewinner;
 
    const canvasRef = useRef<HTMLCanvasElement>(null);  
    
    useEffect(() => {
        if (canvasRef.current){
            const context = canvasRef.current.getContext('2d');

            if (context ) {
                // Draw the table
                context.beginPath();
                context.fillStyle = "black";
                context.fillRect(0, 0, gameinit.table_width, gameinit.table_height);
                context.closePath();

                // center dotted line
                context.setLineDash([5, 5]);
                context.beginPath();
                context.moveTo(gameinit.table_width/2, 0);
                context.lineTo(gameinit.table_width/2, gameinit.table_height);
                context.strokeStyle = "white";
                context.stroke();

                // Draw the ball
                context.beginPath();
                context.arc(gamestate.ball.x, gamestate.ball.y, gameinit.ballR, 0, Math.PI * 2);
                context.fillStyle = "white";
                context.fill();
                context.closePath();

                // Draw the rackets
                context.fillStyle = "white";
                context.fillRect(gamestate.racket1.x, gamestate.racket1.y, gameinit.racket_width, gameinit.racket_height);
                context.fillRect(gamestate.racket2.x, gamestate.racket2.y, gameinit.racket_width, gameinit.racket_height);

                //Score
                context.font = "40px Verdana";
                context.lineWidth = 2;
                context.fillText(`${gamestate.left}`, gameinit.table_width/2 - 80, 50);
                context.fillText(`${gamestate.right }`, gameinit.table_width/2 + 50, 50);
            

                if (gamewinner.leave){
                    // context.fillStyle = "#FDD9";
                    // context.fillRect(0, 0, gameinit.table_width, gameinit.table_height);
                    // context.closePath();

                    context.font = "40px Verdana";
                    context.lineWidth = 2;
                    context.fillText(`${gamewinner.leave}`, 100, gameinit.table_height/2);
                    context.fillText("left the game" , gameinit.table_width/2 + 100, gameinit.table_height/2);
                }
                //if winner
                // if (gamewinner.winner){
                //     // context.fillStyle = "#FDD9";
                //     // context.fillRect(0, 0, gameinit.table_width, gameinit.table_height);
                //     // context.closePath();

                //     context.font = "40px Verdana";
                //     context.lineWidth = 2;
                //     context.fillText("WINNER:", 100, gameinit.table_height - 100);
                //     context.fillText(`${gamewinner.winner}`, gameinit.table_width/2 + 100, gameinit.table_height - 100);
                // }
            }
        }

    }, [gamestate, gamewinner]);
     
    return (<canvas className='field' ref={canvasRef} width={gameinit.table_width} height={gameinit.table_height} />)
}
export default Canvas
//