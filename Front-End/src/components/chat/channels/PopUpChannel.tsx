import React, { useRef } from 'react';
import { Popup } from 'reactjs-popup';
import { useEffect, useContext, useState, FormEvent } from 'react'
import "../../../style/PopUpChannel.css"
import AuthContext from '../../../store/AuthContext';
import Chat from '../../Chat';
import { socket } from '../../../../service/socket';
import ConversationReq from "./ConversationRequest"
import ChannelsSettings from './ChannelsSettings';



function PopUp(props: any) {

    const authCtx = useContext(AuthContext);    
    const [isPublic, setIsPublic] = useState(true);
    const [isPrivate, setIsPrivate] = useState(false);
    const [isProtected, setIsProtected] = useState(false);
    const [selectedFile, setSelectedFile] = useState('');
    const [conversations, setConversations] = useState([]);
    const [showPopUp, setShowPopUp] = useState(true);
    const user = useContext(AuthContext);
    const id = user.userId;
    const [isDisabled, setIsDisabled] = useState(true);
    const [channelName, setchannelName] = useState('');
    const [openModal, setOpenModal] = useState(false);


    const handleChannelNameChange = (e: FormEvent) => {
        const value = e.target.value;
        setchannelName(value);
        setIsDisabled(value === "");
    };


    const createNewChannel = async (e: FormEvent) => {
        e.preventDefault();
        if (channelName === "") {
          return;
        }
        const newConv = {
            name: channelName,
            isPublic: isPublic,
            isPrivate: isPrivate,
            isProtected: isProtected,
        };
        try {
            const res = await ConversationReq.postRoom(user, newConv);
            // console.log("RES = ")
            // console.log(res)
        } catch (err) { 
            console.log(err);
        }
    };
    
    const createAndClose = async (e:FormEvent) => {
        try {
            // const res = await getRolesUser(props.status, props.role);
            await createNewChannel(e);
            setShowPopUp(false);
            props.onClick();
            // console.log("RESPONSE DE GET ROLE USER")
            // console.log(res);
            // return res;
        } catch (err) {
            console.log(err);
        }

    }
    
    const handleFormSubmit = (e:FormEvent) => {
        e.preventDefault();
        setShowPopUp(false);
      };
      


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