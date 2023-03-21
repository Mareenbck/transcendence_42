import React, {useRef, useEffect, useState} from 'react'
import './Game.css'
import type {gameInit, gameState, gameWinner} from './type'


const Winner = (props: {gameinit: gameInit, gamewinner: gameWinner} ): JSX => {
    const gamewinner = props.gamewinner;
	const gameinit = props.gameinit;


    const canvasRef = useRef<HTMLCanvasElement>(null);  
    
    useEffect(() => {
        if (canvasRef.current){
            const context = canvasRef.current.getContext('2d');

			// Draw the table
			context.fillStyle = "#FDD9";
			context.fillRect(0, 0, gameinit.table_width, gameinit.table_height);
				
			if (context) {
						
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
				context.font = "40px Verdana";

				context.fillStyle = "black";
				context.lineWidth = 4;
				context.fillText("WINNER:", 100, gameinit.table_height / 2);
				context.fillText(`${gamewinner.winner}`, gameinit.table_width/2 + 100, gameinit.table_height / 2);
			}
        }
		
    }, []);
     
    return (<canvas ref={canvasRef} width={gameinit.table_width} height={gameinit.table_height} />)
}

export default Winner

//https://imapo.ru/%d1%84%d0%b5%d0%b9%d0%b5%d1%80%d0%b2%d0%b5%d1%80%d0%ba%d0%b8-%d0%bd%d0%b0-html5-canvas-%d0%b8-jquery/

			// // init
			// canvas.fillStyle = '#000';
			// canvas.fillRect(0, 0, props.width, props.height);
			// // objects
			// var listFire: any = [];
			// var listFirework: any = [];
			// var fireNumber = 10;

			// var center = { x: props.width / 2, y: props.height / 2 };
			// var range = 100;
			// for (var i = 0; i < fireNumber; i++) {
			// 	var fire = {
			// 		x: Math.random() * range / 2 - range / 4 + center.x,
			// 		y: Math.random() * range * 2 + props.height,
			// 		size: Math.random() + 0.5,
			// 		fill: '#fd1',
			// 		vx: Math.random() - 0.5,
			// 		vy: -(Math.random() + 4),
			// 		ax: Math.random() * 0.02 - 0.01,
			// 		far: Math.random() * range + (center.y - range)
			// 	};
			// 	var fire_base: any = {
			// 		x: fire.x,
			// 		y: fire.y,
			// 		vx: fire.vx
			// 	};
			// 	//
			// 	listFire.push(fire);
			// }
			 
			// function randColor() {
			// 	var r: any = Math.floor(Math.random() * 256);
			// 	var g: any = Math.floor(Math.random() * 256);
			// 	var b: any = Math.floor(Math.random() * 256);
			// 	var color = 'rgb($r, $g, $b)';
			// 	color = color.replace('$r', r);
			// 	color = color.replace('$g', g);
			// 	color = color.replace('$b', b);
			// 	return color;
			// }
			 
			// function loop() {
			// 	requestAnimationFrame(loop);
			// 	update();
			// 	draw();
			// };
			 
			// function update() {
			// 	for (var i = 0; i < listFire.length; i++) {
			// 	var fire = listFire[i];
			// 	//
			// 	if (fire.y <= fire.far) {
			// 	// case add firework
			// 	var color = randColor();
			// 		for (var i = 0; i < fireNumber * 5; i++) {
			// 			var firework: any = {
			// 				x: fire.x,
			// 				y: fire.y,
			// 				size: Math.random() + 1.5,
			// 				fill: color,
			// 				vx: Math.random() * 5 - 2.5,
			// 				vy: Math.random() * -5 + 1.5,
			// 				ay: 0.05,
			// 				alpha: 1,
			// 				life: Math.round(Math.random() * range / 2) + range / 2
			// 			};
			// 			// var firework_base = {
			// 			// 	life: firework.life,
			// 			// 	size: firework.size
			// 			// };
			// 			listFirework.push(firework);
			// 		}
			// 		// reset
			// 		fire.y = fire_base.y;
			// 		fire.x = fire_base.x;
			// 		fire.vx = fire_base.vx;
			// 		fire.ax = Math.random() * 0.02 - 0.01;
			// 	}
			// 	//
			// 	fire.x += fire.vx;
			// 	fire.y += fire.vy;
			// 	fire.vx += fire.ax;
			// 	}
			// 	var firework_base = {
			// 		life: firework.life,
			// 		size: firework.size
			// 	};
			// 	for (var i = listFirework.length - 1; i >= 0; i--) {
			// 		var firework = listFirework[i];
			// 		if (firework) {
			// 			firework.x += firework.vx;
			// 			firework.y += firework.vy;
			// 			firework.vy += firework.ay;
			// 			firework.alpha = firework.life / firework_base.life;
			// 			firework.size = firework.alpha * firework_base.size;
			// 			firework.alpha = firework.alpha > 0.6 ? 1 : firework.alpha;
			// 			//
			// 			firework.life--;
			// 			if (firework.life <= 0) {
			// 				listFirework.splice(i, 1);
			// 			}
			// 		}
			// 	}
			// }
			 
			// function draw() {
			// 	// clear
			// 	canvas.globalCompositeOperation = 'source-over';
			// 	canvas.globalAlpha = 0.18;
			// 	canvas.fillStyle = '#000';
			// 	canvas.fillRect(0, 0, props.width, props.height);
				
			// 	// re-draw
			// 	canvas.globalCompositeOperation = 'screen';
			// 	canvas.globalAlpha = 1;
			// 	for (var i = 0; i < listFire.length; i++) {
			// 		var fire = listFire[i];
			// 		canvas.beginPath();
			// 		canvas.arc(fire.x, fire.y, fire.size, 0, Math.PI * 2);
			// 		canvas.closePath();
			// 		canvas.fillStyle = fire.fill;
			// 		canvas.fill();
			// 	}
				
			// 	for (var i = 0; i < listFirework.length; i++) {
			// 		var firework = listFirework[i];
			// 		canvas.globalAlpha = firework.alpha;
			// 		canvas.beginPath();
			// 		canvas.arc(firework.x, firework.y, firework.size, 0, Math.PI * 2);
			// 		canvas.closePath();
			// 		canvas.fillStyle = firework.fill;
			// 		canvas.fill();
			// 	}
			// }