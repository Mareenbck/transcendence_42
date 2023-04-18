import { useEffect, useContext, useState, useRef, FormEvent, RefObject } from 'react'
import React from 'react';
import AuthContext from '../../../store/AuthContext';


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
                    console.log("data ------>", data);
                    setParticipants(data);
                }
            } catch(err) {
                console.log(err)
            }
        }
        
        
        useEffect(() =>  {
            showParticipants(props.channelId);
        }, [props.channelId])


        return (
            <>
              <div>
                <h2>Participants:</h2>
                <ul>
                  {participants.map((p) => (
                    <li key={p.id}>
                      {p.name} ({p.role})
                    </li>
                  ))}
                </ul>
              </div>
            </>
          );
          
}