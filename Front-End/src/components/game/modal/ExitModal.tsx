import React from 'react';
import '../../../style/ColorModal.css'


type props = {
    handelClose: any;
    player: string;
}


const ExitModal = (props:any) => {

  return (
    <div className='back' >
      <div className="modal-contain">
        <header className="header-modal">
            <h2> {props.player} left the game ... </h2>
		</header>
        <footer className='actions'>           
            <button className="btnn" onClick={props.handelClose}>Close</button>
        </footer>
      </div>
    </div>
  );

};

export default ExitModal;