import { useEffect, useContext, useState, useRef, FormEvent } from 'react'
import { Link } from "react-router-dom";
import './Chat.css'

function PopupChallenge(props) {

  return (props.triger) ? (
    <div className="popupChallenge">
      <div className="popupChallenge-inner">
          You have been challenged !
        <Link to={'/game/play'} > <i className="fa fa-gamepad" aria-hidden="true"  ></i></Link>
        <button className="close-btn" onClick={() => props.setTriger("")}> Close </button>
        {props.children}
      </div>
    </div>
  ) : "";
}

export default PopupChallenge
