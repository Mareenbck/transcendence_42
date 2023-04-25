import React, {useRef, useEffect, useState} from 'react'
import './Game.css'
import type {gameInit, gameState, gameWinner} from './interface'
import MyAvatar from '../user/Avatar';



const Winner = (props: {gameinit: gameInit, gamewinner: gameWinner} ) => {
    const gamewinner = props.gamewinner;
	const gameinit = props.gameinit;


    const canvasRef = useRef<HTMLCanvasElement>(null);  
    
    useEffect(() => {
        if (canvasRef.current){
            const context = canvasRef.current.getContext('2d');
			if (context) {
				// Draw the table
				context.fillStyle = "#ffffff";//"#8c66ff";
				context.strokeStyle = "#230047";
				context.fillRect(0, 0, gameinit.table_width, gameinit.table_height);
				
				// Draw the star
				drawStar(gameinit.table_width/2, gameinit.table_height/2, 20, 200, 100, 'gold','coral', 0);		
				
				function drawStar(centerX: number, centerY: number, points: number, outer: number, inner: number, fill: string, stroke: string, line: number) {
					// define the star
					context.beginPath();
					context.moveTo(centerX, centerY+outer);
					for (var i=0; i < 2*points+1; i++) {
						var r = (i%2 == 0)? outer : inner;
						var a = Math.PI * i/points;
						context.lineTo(centerX + r*Math.sin(a), centerY + r*Math.cos(a));
					};
					context.closePath();
					// draw
					context.fillStyle=fill;
					context.fill();
					context.strokeStyle=stroke;
					context.lineWidth=line;
					context.stroke()
				}
				
				// // Add the avatar
				// const img = new Image();
				// img.src = gamewinner.winner.profile.userId.avatar;
				// img.onload = () => {
				// 	context.drawImage(img, gameinit.table_width/2 + 100, gameinit.table_height / 2);
				// }
				// context.font = "40px Verdana";
				// context.fillStyle = "#8c66ff";
				// context.lineWidth = 4;
				// context.fillText("WINNER:", gameinit.table_width/3, gameinit.table_height/3);
				//context.fillText(`${gamewinner.winner}`, gameinit.table_width/2 + 100, gameinit.table_height / 2);
			}
        }
		
    }, []);
     
    return (<canvas className='winner' ref={canvasRef} width={gameinit.table_width} height={gameinit.table_height} />)
}

export default Winner;