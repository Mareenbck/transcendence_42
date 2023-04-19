import { useEffect, useContext, useState, useRef, FormEvent, RefObject } from 'react'
import React from 'react';
import AuthContext from '../../../store/AuthContext';
import '../../../style/UsersOnChannel.css'
import { Modal } from "@mui/material";



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

        // console.log("participants -----> ", participants)
        return (
            <>
                <h2 className='participants-modal'>Participants of {props.channelName}:</h2>
                <ul>
                  {participants.map((p) => (
                    <li key={p.id}>
                      {p.user.username} ({p.role})
                    </li>
                  ))}
                </ul>
            </>
          );
          
}