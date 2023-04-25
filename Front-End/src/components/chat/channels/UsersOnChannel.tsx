import { useEffect, useContext, useState, useRef, FormEvent, RefObject } from 'react'
import React from 'react';
import AuthContext from '../../../store/AuthContext';
import '../../../style/UsersOnChannel.css'
import { FaCrown } from "react-icons/fa";
import MyAvatar from '../../user/Avatar';
import Kick from './Kick';


export default function UsersOnChannel(props: any) {

    const authCtx = useContext(AuthContext);
    const [participants, setParticipants] = useState([]);

    
    const showParticipants = async (channelId: string) => {
        try {
            const response = await fetch(
                `http://localhost:3000/chatroom2/${channelId}/participants`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authCtx.token}`
                    }
                }
                )
                if (response.ok) {
                    const data = await response.json();
                    // console.log("data ------>", data);
                    setParticipants(data);
                }
            } catch(err) {
                console.log(err)
            }
        }
        
        
        useEffect(() =>  {
            showParticipants(props.channelId);
        }, [props.channelId])

        const admins = participants.filter((p) => p.role === 'ADMIN');
        const users = participants.filter((p) => p.role === 'USER');

        const kickSomeone = async (channelId: string, userId: string) => {
            try {
              const response = await fetch(
                `http://localhost:3000/chatroom2/${channelId}/kick/${userId}`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authCtx.token}`,
                },
            }
            );
            console.log("RESPONSE", response )
              if (!response.ok) {
                throw new Error("Failed to kick user.");
              }
              const data = await response.json();
              console.log(data); // affiche la réponse du serveur après avoir viré l'utilisateur
            } catch (error) {
              console.error(error);
            }
          };
        

        // console.log("participants -----> ", participants)
        return (
            <>
                <h2 className='participants-modal'>Participants of {props.channelName}:</h2>
                <h4 className='name-participants'>Admins:  </h4>
                <ul className='ul-participants'>
                    {admins.map((p) => (
                    <li className='username-participants' key={p.id}>
                        <MyAvatar style="s" authCtx={authCtx} alt={"avatar"} avatar={p.user.avatar} ftAvatar={p.user.ftAvatar}/>
                        {p.user.username} <i className="fa-sharp fa-solid fa-crown"></i>
                    </li>
                    ))}
                </ul>
                <h4 className='name-participants'>Users:</h4>
                <ul className='ul-participants'>
                {users.map((p) => (
                <li className='username-participants' key={p.id}>
                    <MyAvatar style="s" authCtx={authCtx} alt={"avatar"} avatar={p.user.avatar} ftAvatar={p.user.ftAvatar}/>
                    {p.user.username} <i className="fa-solid fa-trash" onClick={() => kickSomeone(props.channelId, p.user.id)}></i>
                </li>
                ))}
                </ul>
            </>
          );
          
}