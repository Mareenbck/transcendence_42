import React from 'react';
import'../../../style/ColorModal.css';

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
						<button  className = "btn" onClick={props.changColor/*("red")*/}   style={{backgroundColor: "red"}} >Red</button>
						<button  className = "btn" onClick={props.changColor} style={{backgroundColor: "blue"}}>Blue</button>
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