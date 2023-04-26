import React from 'react';
import { Link } from "react-router-dom";
import '../../../style/ColorModal.css'

type props = {
	handelClose: any;
}


const Modal = (props:any) => {
  return (
    <div className='back' >
      <div className="modal-contain">
        <header className="header-modal">
					<h2>Sorry, not right now</h2>
				</header>
          <footer className='actions'>  
            <Link to="/menu">
                  <button className="btn" onClick={props.handelClose}>Close</button>
            </Link>   
          </footer>
      </div>
    </div>
  );
};

export default Modal;