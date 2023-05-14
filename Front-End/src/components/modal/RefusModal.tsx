import React from 'react';
import '../../style/ColorModal.css';
import { Link } from "react-router-dom";

type props = {
	handelClose: any;
}

const Modal = (props: any) => {
  return (
    <div className='modalgame' >
      <div className='global-popup-refus' >
        <h3>Sorry, you can't play right now</h3>
            <footer className='actions'>
              <Link to={`/chat/message`}>
                  <button className="btnn" onClick={props.handleClose}>Close</button>
              </Link>
            </footer>
      </div>
    </div>
  );
};

export default Modal;
