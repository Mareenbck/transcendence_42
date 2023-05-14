import { useEffect, useContext, useState, useRef, FormEvent } from 'react'
import { Link } from "react-router-dom";
import MyAvatar from '../user/Avatar';
import { UserChat } from '../../interfaces/iChat';
import React from 'react';
import useSocket from '../../service/socket';
import AuthContext from '../../store/AuthContext';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import '../../style/Chat.css'
import '../../style/ColorModal.css'

function PopupChallenge() {
  const user = useContext(AuthContext);

  const [sendMessage, addListener] = useSocket();
  const [invited, setInvited] = useState<UserChat | null> (null);

  const acceptGame = () => {
    sendMessage("acceptGame", {
      author: +invited!.id,
      player: +user.userId,
    } as any);
    setInvited(null);
}

  const refuseGame = () => {
    sendMessage("refuseGame", {
      author: +invited!.id,
      player: +user.userId,
    } as any);
    setInvited(null);
  }

  useEffect(() => {
		addListener("wasInvited", (data : any) => {
		  setInvited(data);

		});
	});

  return (invited) ? (
		<div className="modalgame">
      <div className="global-popup">
        <div className="popupChallenge-inner">
          <MyAvatar  id={invited.id} style="m" avatar={invited.avatar} ftAvatar={invited.ftAvatar}/>
          <div> {invited.username} invites you to play! </div>
            <Link to={'/game'} >
            <button className='btnn' onClick={acceptGame}><SportsTennisIcon/>Play</button>
            </Link>
            <button className="close-btn" onClick={refuseGame}>Close</button>
        </div>
      </div>
    </div>
  ) : null;
}

export default PopupChallenge
