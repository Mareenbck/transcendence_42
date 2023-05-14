import { useEffect, useContext, useState, useRef, FormEvent } from 'react'
import MyAvatar from '../user/Avatar';
import React from 'react';
import '../../style/Chat.css'
import '../../style/ColorModal.css'

const ExitGame = (props: any): React.JSX.Element  => {
    return (
            <div className='global-popup-exit' >
                <MyAvatar  id={props.exitplayer.id} style="m" avatar={props.exitplayer.avatar} ftAvatar={props.exitplayer.ftAvatar}/>
                <div> {props.exitplayer.username} left the game! </div>
            </div>
          
    );
}

export default ExitGame;