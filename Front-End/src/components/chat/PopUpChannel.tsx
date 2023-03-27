import React, { useRef } from 'react';
import { Popup } from 'reactjs-popup';
import { useEffect, useContext, useState, FormEvent } from 'react'
import "../../style/PopUpChannel.css"
import "../../pages/Setting.tsx"
import AuthContext from '../../store/AuthContext';
import Chat from './Chat';
import { socket } from '../../service/socket';
import ConversationReq from "./conversation/conversation.req"
import { Modal } from '@mui/material';



function PopUp(props: any) {
    
    const authCtx = useContext(AuthContext);    
    const [isPublic, setIsPublic] = useState(true);
    const [isPrivate, setIsPrivate] = useState(true);
    const [isProtected, setIsProtected] = useState(true);
    const [selectedFile, setSelectedFile] = useState('');
    const [conversations, setConversations] = useState<ConversationDto[]> ([]);
    const [showPopUp, setShowPopUp] = useState(false);
    const user = useContext(AuthContext);
    const id = user.userId;


    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("file", selectedFile);
        try {
            const response = await fetch(`http://localhost:3000/users/upload`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authCtx.token}`,
                },
                body: formData,
            })
            const data = await response.json();
            if (!response.ok) {
                console.log("POST error on ${userId}/username ");
                return "error";
            }
            authCtx.fetchAvatar(data.id);
            localStorage.setItem("avatar", data.avatar);
            return "success";
        } catch (error) {
            return console.log("error", error);
        }
    };

    const [isDisabled, setIsDisabled] = useState(true);


	const handleFileChange = (event: FormEvent<HTMLInputElement>) => {
		setSelectedFile(event.target.files[0]);
	};

    const [channelName, setchannelName] = useState('');
    const [channelStatus, setChannelStatus] = useState('');

    
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
            avatar: selectedFile
        };
        // socket?.current.emit("sendConv", {
        //   author: +id,
        //   content: newConv,
        // })
        try {
            console.log("arrive dans le try")
          const res = await ConversationReq.postRoom(user, newConv);
          setConversations([res, ...conversations]);
          setShowPopUp(true); 
        } catch(err) {
          console.log(err);
        }
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
                        checked={isPublic}
                        onChange={() => setIsPublic(true)}
                    />
                    Public
                </label>
                <label className='wrap-circle'>
                    <input
                        className='circle'
                        type='radio'
                        checked={!isPublic && isPrivate}
                        onChange={() => {
                            setIsPublic(false);
                            setIsPrivate(true);
                        }}
                    />
                    Private
                </label>
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
            </div>
            <div className='choose-avatar'>
                <p>Choose an avatar for your new channel</p>
                <form onSubmit={handleSubmit}>
                    <input type="file" onChange={handleFileChange} />
                    <button type='submit'>Upload</button>
                </form>
            </div>
            <footer className='actions'>
                <button type='submit' onClick={createNewChannel}>OK</button>
                <button onClick={props.onCancel}>Cancel</button>
            </footer>
        </div>
    </div>
);
}

export default PopUp;