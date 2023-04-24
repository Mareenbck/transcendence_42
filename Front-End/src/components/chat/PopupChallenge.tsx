import { useEffect, useContext, useState, useRef, FormEvent } from 'react'
import { Link } from "react-router-dom";
import './../../style/Chat.css'
import MyAvatar from '../user/Avatar';
import { Invite, UserChat } from '../../interfaces/iChat';
import React from 'react';

interface PopupChallengeProps {
  trigger: UserChat | null;
  player: UserChat | null;
  sendMessage: (signal: string, message: any) => void;
  setTrigger: (value: UserChat | null) => void;
  children: React.ReactNode;
}

function PopupChallenge(props: PopupChallengeProps) {

  const acceptGame = () => {
    props.sendMessage("acceptGame", {
      author: props.trigger,
      player: props.player,
    } as Invite);
  }
  
  const refuseGame = () => {
    props.sendMessage("refuseGame", {
      author: (props.trigger),
      player: (props.player),
    } as Invite);
  }

  return (props.trigger) ? (
    <div className="popupChallenge">
      <div className="popupChallenge-inner">
        <MyAvatar  id={props.trigger.id} style="m" avatar={props.trigger.avatar} ftAvatar={props.trigger.ftAvatar}/>
        <div>  You have been challenged by {props.trigger.username} ! </div>
          <Link to={'/game'} onClick={acceptGame} > <i className="fa fa-gamepad" aria-hidden="true"  ></i></Link>
          <button className="close-btn" onClick={() => { refuseGame(); props.setTrigger(null); }}>Close</button>
        {props.children}
      </div>
    </div>
  ) : null;
}

export default PopupChallenge