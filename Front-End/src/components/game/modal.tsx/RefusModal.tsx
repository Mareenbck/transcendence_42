import React from 'react';
import { Link } from "react-router-dom";
import './../../style/Chat.css'

// interface ModalProps {
//   onClose: () => void;
//   message: string;
// }

const Modal = () => {
  return (
    <div className="popupChallenge">
      <div className="popupChallenge-inner">
        <p>Sorry, not right now</p>
		<Link to="/menu">
            <button className="close-btn" onClick={onClose}>Close</button>
        </Link>   
        </div>
    </div>
  );
};

export default Modal;