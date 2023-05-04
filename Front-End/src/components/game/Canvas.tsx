import React, {useRef, useEffect, useState} from 'react'
import './Game.css'
import type {gameInit, gameState} from './interface_game'

const Canvas = (props: {gamestate: gameState, gameinit: gameInit, backColorGame: backColorGame} ): JSX => {
    const gamestate = props.gamestate;
    const gameinit = props.gameinit;
    // const gamewinner = props.gamewinner;
    const backColorGame = props.backColorGame;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    const [canvasWidth, setCanvasWidth] = useState<number>(null);
    const [canvasHeight, setCanvasHeight] = useState<number>(700);
    const [racketwidth, setRacketwidth] = useState<number>(10);
    const [racketheight, setRacketheight] = useState<number>(100);
    const [ballRadius, setBallRadius] = useState<number>(15);

    useEffect(() => {
        if (canvasRef.current){
            const context = canvasRef.current.getContext('2d');
//            setCanvasWidth(canvasRef.current.width);

            if (context ) {
                setCanvasWidth(gameinit.table_width);
//                setCanvasHeight(canvasWidth * gameinit.table_height/gameinit.table_width);
                setCanvasHeight(Math.floor(gameinit.table_height*canvasWidth));
                setRacketwidth(gameinit.racket_width * canvasWidth);
                setRacketheight(gameinit.racket_height * canvasWidth);
                setBallRadius(gameinit.ballR * canvasWidth);

                // Draw the table
                context.beginPath();
                //context.fillStyle = "black";
                context.fillStyle = backColorGame;
                // context.fillRect(0, 0, gameinit.table_width, gameinit.table_height);
                context.fillRect(0, 0, canvasWidth, canvasHeight);
                context.closePath();

                // center dotted line
                context.setLineDash([5, 5]);
                context.beginPath();
                // context.moveTo(gameinit.table_width/2, 0);
                // context.lineTo(gameinit.table_width/2, gameinit.table_height);
                context.moveTo(canvasWidth/2, 0);
                context.lineTo(canvasWidth/2, canvasHeight);
                context.strokeStyle = "white";
                context.stroke();

                // Draw the ball
                context.beginPath();
//                context.arc(gamestate.ball.x, gamestate.ball.y, gameinit.ballR, 0, Math.PI * 2);
                context.arc(
                    gamestate.ball.x * canvasWidth,
                    gamestate.ball.y * canvasWidth,
                    ballRadius, 0, Math.PI * 2);
                context.fillStyle = "white";
                context.fill();
                context.closePath();

                // Draw the rackets
                context.fillStyle = "white";
                // context.fillRect(gamestate.racket1.x, gamestate.racket1.y, gameinit.racket_width, gameinit.racket_height);
                // context.fillRect(gamestate.racket2.x, gamestate.racket2.y, gameinit.racket_width, gameinit.racket_height);
                context.fillRect(
                    gamestate.racket1.x * canvasWidth,
                    gamestate.racket1.y * canvasWidth,
                    racketwidth, racketheight);
                context.fillRect(
                    gamestate.racket2.x * canvasWidth,
                    gamestate.racket2.y * canvasWidth,
                    racketwidth, racketheight);
                
                //Score
                context.font = "40px Verdana";
                context.lineWidth = 2;
                // context.fillText(`${gamestate.scoreL}`, gameinit.table_width/2 - 80, 50);
                // context.fillText(`${gamestate.scoreR }`, gameinit.table_width/2 + 50, 50);
                context.fillText(`${gamestate.scoreL}`, canvasWidth/2 - 80, 50);
                context.fillText(`${gamestate.scoreR }`, canvasWidth/2 + 50, 50);

                // if (gamewinner.leave){
                //     // context.fillStyle = "#FDD9";
                //     // context.fillRect(0, 0, gameinit.table_width, gameinit.table_height);
                //     // context.closePath();

                //     context.font = "40px Verdana";
                //     context.lineWidth = 2;
                //     context.fillText(`${gamewinner.leave}`, 100, gameinit.table_height/2);
                //     context.fillText("scoreL the game" , gameinit.table_width/2 + 100, gameinit.table_height/2);
                // }
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

    }, [gameinit, gamestate]);
     
    // return (<canvas className='canvas' ref={canvasRef} width={gameinit.table_width} height={gameinit.table_height} />)
    return (<canvas className='canvas' ref={canvasRef} width={canvasWidth} height={canvasHeight} />)
}
export default Canvas


// interface game {
//     width: number;
//     height: number;
//     ballx: number;
//     bally: number;
//     racket1y: number;
//     racket2y: number;
// }

    
// const Canvas = (props: {gamestate: gameState, gameinit: gameInit} ) => {
//     const gamestate = props.gamestate;
//     const gameinit = props.gameinit;

//     const canvasRef = useRef<HTMLCanvasElement>(null);  

//     const [width, setWidth] = useState<number>(400);
//     const [height, setHeight] = useState<number>(300);
//     const [ballRadius, setBallradius] = useState<number>(15);
//     const [racketWidth, setRacketwidth] = useState<number>(10);
//     const [racketHeight, setRacketheight] = useState<number>(100);

//     useEffect(() => {
// console.log('gameinit');
//         setWidth(gameinit.table_width);
//         setHeight(gameinit.table_height);
//         setBallradius(gameinit.ballR);
//         setRacketwidth(gameinit.racket_width);
//         setRacketheight(gameinit.racket_height);
//     }, [gameinit]);

//     const update = (context: CanvasRenderingContext2D): void =>{
// //console.log('update');
//         // Draw the table
//         context.fillStyle = "black";
//         context.fillRect(0, 0, width, height);

//         // center dotted line
//         context.setLineDash([5, 5]);
//         context.beginPath();
//         context.moveTo(width/2, 0);
//         context.lineTo(width/2, height);
//         context.strokeStyle = "white";
//         context.stroke();

//         // Draw the ball
//         context.beginPath();
//         context.arc(gamestate.ball.x, gamestate.ball.y, ballRadius, 0, Math.PI * 2);
//         context.fillStyle = "white";
//         context.fill();
//         context.closePath();

//         // Draw the rackets
//         context.fillStyle = "white";
//         context.fillRect(gamestate.racket1.x, gamestate.racket1.y, racketWidth, racketHeight);
//         context.fillRect(gamestate.racket2.x, gamestate.racket2.y, racketWidth, racketHeight);

//         context.fillText(("Player 1: 0"), 100, 100);
//         context.fillText(("Player 2: 0"), width - 150, 100);
//     };
    
//     useEffect(() => {
//         if (canvasRef.current) {
//             const context = canvasRef.current.getContext('2d');
//             if(context)
//                 update(context);
//         }
//     }, [gamestate]);
    
//     return (<canvas className='field' ref={canvasRef} width={width} height={height} />)
// }