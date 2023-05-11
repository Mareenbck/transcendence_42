import React from 'react';
import { Link } from "react-router-dom";
import '../../../style/ColorModal.css'
import { UserGame } from '../interface_game';


type props = {
	handelClose: any;
  player: string;
  cause: string;
  status: string;
}


const Modal = (props:any) => {
const status = props.status;

return (
  <div className='back' >
    <div className="modal-contain">
      <header className="header-modal">
          <h2> {props.player} can not play now, sorry! </h2>
      </header>
      <footer className='actions'>           
          <Link to="/chat/message">
                <button className="btnn" onClick={props.handelClose}>Close</button>
          </Link>              
      </footer>
    </div>
  </div>
);
};

export default Modal;