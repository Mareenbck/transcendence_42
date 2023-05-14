import React from 'react';
import'../../style/ColorModal.css';

type props = {
	changcolor : any;
	handelclose: any;
}

function ColorModal(props: any) {
	return (
		<div className='back'>
			<div className="modal-contain">
				<header className="header-modal">
					<h2>Select of color :</h2>
				</header>
				<div className='content'>	
					<div className='btm-contain'>
						<button  className = "btn" onClick={props.changColorToRed}   style={{backgroundColor: "red"}} ></button>
						<button  className = "btn" onClick={props.changColorToBlue} style={{backgroundColor: "blue"}}></button>
						<button  className = "btn" onClick={props.changColorToGreen} style={{backgroundColor: "green"}}></button>
						<button  className = "btn" onClick={props.changColorToBlack} style={{backgroundColor: "black"}}></button>
					</div>
				</div>
				<footer className='actions'>
					<button className = "btn" onClick={props.handelClose}>OK</button>
                    
				</footer>
			</div>
		</div>
	)
}

export default ColorModal;