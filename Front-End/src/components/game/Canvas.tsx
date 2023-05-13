import React, {useRef, useEffect, useState} from 'react'
import './Game.css'
import type {GameInit, GameState} from './interface_game'

const Canvas = (props: {gamestate: GameState, gameinit: GameInit, backColorGame: string} ) => {
    const gamestate = props.gamestate;
    const gameinit = props.gameinit;
    const backColorGame = props.backColorGame;
    const canvasRef = useRef<HTMLCanvasElement>(null);  
    
    useEffect(() => {
        if (canvasRef.current){
            const context = canvasRef.current.getContext('2d');

            if (context ) {
                // Draw the table
                context.beginPath();
                //context.fillStyle = "black";
                context.fillStyle = backColorGame;
                context.fillRect(0, 0, gameinit.table_width, gameinit.table_height * gameinit.table_width);
                context.closePath();

                // center dotted line
                context.setLineDash([5, 5]);
                context.beginPath();
                context.moveTo(gameinit.table_width/2, 0);
                context.lineTo(gameinit.table_width/2, gameinit.table_height * gameinit.table_width);
                context.strokeStyle = "white";
                context.stroke();

                // Draw the ball
                context.beginPath();
                context.arc((gamestate.ball.x * gameinit.table_width), (gamestate.ball.y * gameinit.table_width), (gameinit.ballR * gameinit.table_width), 0, Math.PI * 2);
                context.fillStyle = "white";
                context.fill();
                context.closePath();

                // Draw the rackets
                context.fillStyle = "white";
                context.fillRect(gamestate.racket1.x * gameinit.table_width, gamestate.racket1.y * gameinit.table_width, gameinit.racket_width * gameinit.table_width, gameinit.racket_height * gameinit.table_width);
                context.fillRect(gamestate.racket2.x * gameinit.table_width, gamestate.racket2.y * gameinit.table_width, gameinit.racket_width * gameinit.table_width, gameinit.racket_height * gameinit.table_width);

                //Score
                context.font = "40px Verdana";
                context.lineWidth = 2;
                context.fillText(`${gamestate.scoreL}`, gameinit.table_width/2 - 80, 50);
                context.fillText(`${gamestate.scoreR }`, gameinit.table_width/2 + 50, 50);
            }
        }

    }, [gameinit, gamestate]);
     
    return (<canvas className='canvas' ref={canvasRef} width={gameinit.table_width} height={(gameinit.table_height * gameinit.table_width)} />)
}
export default Canvas
