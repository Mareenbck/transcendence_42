import { useEffect, useContext, useState, useRef, FormEvent, RefObject } from 'react'
import React from 'react';
import AuthContext from '../../../store/AuthContext';
import { useParams } from "react-router-dom";


export default function UsersOnChannel(props: any) {

    const authCtx = useContext(AuthContext);
    const { id } = useParams();
    const [participants, setParticipants] = useState([]);


    useEffect(() =>  {
        showParticipants();
    }, [id])

    const url = `http://localhost:3000/chatroom2/${id}/participants`;
    const showParticipants = async () => {
        try {
            const response = await fetch(
                url,
                {
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

    return (
        <>
        <h2>Participants List</h2>
        <div className='participants-list'>
                <ul>
                    {participants.map(participant => (
                        <li key={participant.id}>{participant.name}</li>
                    ))}
                </ul>
        </div>
       </>
    );
}