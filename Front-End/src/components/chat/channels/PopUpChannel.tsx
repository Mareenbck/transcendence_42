import React, { useRef } from 'react';
import { useContext, useState, FormEvent } from 'react'
import "../../../style/PopUpChannel.css"
import AuthContext from '../../../store/AuthContext';
import ConversationReq from "./ConversationRequest"
import ChannelsSettings from './ChannelsSettings';
import { TextField } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import useSocket from '../../../service/socket';

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
    const [sendMessage, addListener] = useSocket()
    const [stringError, setStringError] = React.useState(true);
    const [passwordError, setPasswordError] = React.useState(true);

    const handleChannelNameChange = (e: FormEvent) => {
        const value = (e.target as HTMLInputElement).value;
        setchannelName(value);
        setIsDisabled(value === "");
        setStringError(value === '');
    };

    const handlePasswordChange = (e: FormEvent) => {
        const value = (e.target as HTMLInputElement).value;
        setPasswordError(value.trim() === '');
      };


    const createNewChannel = async (e: FormEvent) => {
        e.preventDefault();

        let idConv: number | undefined = undefined;
        if (channelName === "") {
            setStringError(true)
            return;
        }
        if (isProtected && !passwordInputRef.current?.value) {
            return;
        }
        const newConv = {
            name: channelName,
            isPublic: isPublic,
            isPrivate: isPrivate,
            isProtected: isProtected,
            password:  passwordInputRef.current?.value,
        };
        try {
            idConv = await ConversationReq.postRoom(user, newConv);
        } catch (err) {  console.log(err)}
        if (idConv !== undefined)
        {
            sendMessage("sendConv", {
                channelId: idConv,
                name: channelName,
                isPublic: isPublic,
                isPrivate: isPrivate,
                isProtected: isProtected,
            } as any)
        }
    };

    const createAndClose = async (e:FormEvent) => {
        if (!stringError) {
            setShowPopUp(true)
        }
        try {
            await createNewChannel(e);
            setShowPopUp(false);
            props.onClick();
        } catch (err) { console.log(err);}
    }

    const handleFormSubmit = (e:FormEvent) => {
        if (stringError) {
            return;
        }
        e.preventDefault();
        setShowPopUp(false);
    };

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = (e: FormEvent) => setShowPassword(!showPassword);

return (
    <div className='popup-overlay'>
        <div className='global-popup'>
            <header className='header-popup'>
                <h2>{props.title}</h2>
            </header>
                <h5>New channel name:</h5>
            <TextField
                id="outlined-basic"
                label="Name"
                variant="outlined"
                value={channelName}
                onChange={handleChannelNameChange}
            />
            <div className='content-button'>
                <h5>{props.message}</h5>
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
                {isProtected && (
                    <div>
                        <p>Choose a password for your new channel</p>
                        <TextField
                            id="password"
                            className="custom-field"
                            label="password"
                            type={showPassword ? 'text' : 'password'}
                            variant="filled"
                            placeholder="Type a password..."
                            inputRef={passwordInputRef}
                            onChange={handlePasswordChange}
                            error={isProtected && passwordError}
                        />
                        <VisibilityIcon className="pwd-icon" onClick={(e:FormEvent) => handleClickShowPassword(e)} />
                    </div>
                )
                }
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

            <button
                className='btnn'
                type='submit'
                onSubmit={handleFormSubmit}
                onClick={createAndClose}
                disabled={stringError || (isProtected && passwordError)}
                >
                OK
            </button>


            <button className="btnn" onSubmit={handleFormSubmit} onClick={props.onCancel}>Cancel</button>
            <ChannelsSettings openModal={openModal} setOpenModal={setOpenModal} role={props.role} />

        </div>
    </div>
);
}

export default PopUp;
