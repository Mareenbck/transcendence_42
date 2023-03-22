import React, { useRef } from 'react';
import { Popup } from 'reactjs-popup';
import { useEffect, useContext, useState, FormEvent } from 'react'
import "../../style/PopUpChannel.css"

function PopUp(props: any) {
    const [isPublic, setIsPublic] = useState(true);
    // const [gotPassword, setPassword] = useState(true);
    return (
        <div className='popup-overlay'>
            <div className='global-popup'>
                <header className='header-popup'>
                    <h2>{props.title}</h2>
                </header>
                <div className='content-button'>
                    <p>{props.message}</p>
                    <label className='wrap-circle'>
                        <input
                            className='circle'
                            type='radio'
                            value='public'
                            checked={isPublic}
                            onChange={() => setIsPublic(true)}
                        />
                        Public
                    </label>
                    <label className='wrap-circle'>
                        <input
                            className='circle'
                            type='radio'
                            value='private'
                            checked={!isPublic}
                            onChange={() => setIsPublic(false)}
                        />
                        Private
                    </label>
                </div>
                <footer className='actions'>
                    <button onClick={props.onConfirm}>OK</button>
                </footer>
            </div>
        </div>
    );
}

export default PopUp;

