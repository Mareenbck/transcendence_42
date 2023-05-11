import React from 'react';
import { Link } from "react-router-dom";
import '../../../style/ColorModal.css'

type props = {
	handelClose: any;
}


const Modal = (props:any) => {
  return (
    <div className='global-popup-refus' >
			<h3>Sorry, you can't play right now</h3>
          <footer className='actions'>  
            <Link to="/chat/message">
                  <button className="btnn" onClick={props.handelClose}>Close</button>
            </Link>   
          </footer>
    </div>
  );
};

export default Modal;