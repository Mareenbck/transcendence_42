import React, { useRef } from 'react';
import { Popup } from 'reactjs-popup';
import { useEffect, useContext, useState, FormEvent } from 'react'
import "../../style/PopUpChannel.css"
import "../../pages/Setting.tsx"
import AuthContext from '../../store/AuthContext';
import Chat from './Chat';


function PopUp(props: any) {
    
    const authCtx = useContext(AuthContext);    
    const [isPublic, setIsPublic] = useState(true);
    const [isPrivate, setIsPrivate] = useState(true);
    const [selectedFile, setSelectedFile] = useState('');


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

	const handleFileChange = (event: FormEvent<HTMLInputElement>) => {
		setSelectedFile(event.target.files[0]);
	};


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
                            value='protected'
                            checked={!isPublic && !isPrivate}
                            onChange={() => {
                                setIsPublic(false);
                                setIsPrivate(false);
                            }}
                        />
                        Protected
                    </label>

                </div>
                <div className='choose-avatar'>
                    <p>Chose an avatar for your new channel</p>
                    <form onSubmit={handleSubmit}>
                        <input type="file" onChange={handleFileChange} />
                        <button type='submit'>Upload</button>
                    </form>
                </div>
                    <footer className='actions'>
                        <button type='submit' onClick={props.onConfirm}>OK</button>
                    </footer>
            </div>
        </div>
    );
}

export default PopUp;

