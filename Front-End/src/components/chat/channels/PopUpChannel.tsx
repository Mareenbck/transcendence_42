import React, { useRef } from 'react';
import { Popup } from 'reactjs-popup';
import { useEffect, useContext, useState, FormEvent } from 'react'
import "../../../style/PopUpChannel.css"
import AuthContext from '../../../store/AuthContext';
import ConversationReq from "./ConversationRequest"
import ChannelsSettings from './ChannelsSettings';
import { TextField } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

function PopUp(props: any) {

    const authCtx = useContext(AuthContext);
    const [isPublic, setIsPublic] = useState(true);
    const [isPrivate, setIsPrivate] = useState(false);
    const [isProtected, setIsProtected] = useState(false);
    const [showPopUp, setShowPopUp] = useState(true);
    const user = useContext(AuthContext);
    const id = user.userId;
    const [isDisabled, setIsDisabled] = useState(true);
    const [channelName, setchannelName] = useState('');
    const [openModal, setOpenModal] = useState(true);
    const passwordInputRef = useRef<HTMLInputElement>(null);


    const handleChannelNameChange = (e: FormEvent) => {
        const value = e.target.value;
        setchannelName(value);
        setIsDisabled(value === "");
    };


    const createNewChannel = async (e: FormEvent) => {
        e.preventDefault();
        console.log("passwordInputRef--->")
        console.log(passwordInputRef.current!.value)
        // const password = passwordInputRef.current!.value;
        // console.log("password--->")
        // console.log(password)
        if (channelName === "") {
          return;
        }
        const newConv = {
            name: channelName,
            isPublic: isPublic,
            isPrivate: isPrivate,
            isProtected: isProtected,
            password:  passwordInputRef.current!.value,
        };
        try {
            const res = await ConversationReq.postRoom(user, newConv);
        } catch (err) {
            console.log(err);
        }
    };

    const createAndClose = async (e:FormEvent) => {
        try {
            await createNewChannel(e);
            setShowPopUp(false);
            props.onClick();
        } catch (err) {
            console.log(err);
        }

    }

    const handleFormSubmit = (e:FormEvent) => {
        e.preventDefault();
        setShowPopUp(false);
    };

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = (e: FormEvent) => setShowPassword(!showPassword);

    // console.log("PASSWORD DANS POP UP")
    // console.log(passwordInputRef)


// aller voir le inputRef={usernameInputRef} pour apres IN TEXT FIELDS
return (
    <div className='popup-overlay'>
        <div className='global-popup'>
            <header className='header-popup'>
                <h2>{props.title}</h2>
            </header>
            <label>
                New channel name:
                <input type="text" value={channelName} onChange={handleChannelNameChange} />
            </label>
            <div className='content-button'>
                <p>{props.message}</p>

                <label className='wrap-circle'>
                    <input
                        className='circle'
                        type='radio'
                        checked={!isPublic && !isPrivate}
                        onChange={() => {
                            setIsPublic(false);
                            setIsPrivate(false);
                            setIsProtected(true);
                        }}
                    />
                    Protected
                </label>
                <div>Choose a password for your new channel</div>
                <TextField
                    id="password"
                    className="custom-field"
                    label="password"
                    type={showPassword ? 'text' : 'password'}
                    variant="filled"
                    placeholder="Type a password..."
                    inputRef={passwordInputRef}
                />
                <VisibilityIcon className="pwd-icon" onClick={(e:FormEvent) => handleClickShowPassword(e)} />
               <label className='wrap-circle'>
                    <input
                        className='circle'
                        type='radio'
                        checked={!isPublic && isPrivate}
                        onChange={() => {
                            setIsPublic(false);
                            setIsPrivate(true);
                            setIsProtected(false)
                        }}
                    />
                    Private
                </label>
                <label className='wrap-circle'>
                    <input
                        className='circle'
                        type='radio'
                        checked={isPublic}
                        onChange={() => {
                            setIsPublic(true);
                            setIsPrivate(false);
                            setIsProtected(false);
                        }}
                    />
                    Public
                </label>

            </div>
            <footer className='actions'>
                <button type='submit' onSubmit={handleFormSubmit} onClick={createAndClose}>OK</button>
                <button onSubmit={handleFormSubmit} onClick={props.onCancel}>Cancel</button>
            </footer>
            <ChannelsSettings openModal={openModal} setOpenModal={setOpenModal} role={props.role} />

        </div>
    </div>
);
}

export default PopUp;
