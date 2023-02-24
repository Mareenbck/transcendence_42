import React, {useRef, useEffect} from 'react'
import './Game.css'


interface game {
    width: number;
    height: number;
    ballx: number;
    bally: number;
    racket1y: number;
    racket2y: number;
}

    
const Canvas = ({width, height, ballx, bally, racket1y, racket2y}: game): JSX.Element => {
    
        const canvasRef = useRef<HTMLCanvasElement>(null);  
    
    //width = window.innerWidth;
    // height = window.innerHeight;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas){
            const context = canvas.getContext('2d');
            if (context ) {
                // Draw the table
                context.fillStyle = "black";
                context.fillRect(0, 0, width, height);

                // center dotted line
                context.setLineDash([5, 5]);
                context.beginPath();
                context.moveTo(width/2, 0);
                context.lineTo(width/2, height);
                context.strokeStyle = "white";
                context.stroke();

                // Draw the ball
                const ballRadius = 10;
                context.beginPath();
                context.arc(ballx, bally, ballRadius, 0, Math.PI * 2);
                context.fillStyle = "white";
                context.fill();
                context.closePath();

                // Draw the rackets
                const racketWidth = 10;
                const racketHeight = 100;
                const racket1x = 30;
                const racket2x = width - 40;
                context.fillStyle = "white";
                context.fillRect(racket1x, racket1y, racketWidth, racketHeight);
                context.fillRect(racket2x, racket2y, racketWidth, racketHeight);

                context.fillText(("Player 1: 0"), 100, 100);
                context.fillText(("Player 2: 0"), width -150, 100);
             }
        }
    
    }, [{width, height, ballx, bally, racket1y, racket2y}]);
    
    return (<canvas className='field' ref={canvasRef} width={width} height={height} />)
}

export default Canvas
