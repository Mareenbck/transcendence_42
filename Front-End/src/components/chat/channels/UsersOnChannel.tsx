import { useEffect, useContext, useState, useRef, FormEvent, RefObject } from 'react'
import React from 'react';
import AuthContext from '../../../store/AuthContext';
import '../../../style/UsersOnChannel.css'
import { FaCrown } from "react-icons/fa";
import MyAvatar from '../../user/Avatar';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import MicOffIcon from '@mui/icons-material/MicOff';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';

function generate(element: React.ReactElement) {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value,
    }),
  );
}

const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));


export default function UsersOnChannel(props: any) {
  
  const authCtx = useContext(AuthContext);
  const [isBanned, setIsBanned] = useState(false);
  const [participants, setParticipants] = useState([]);
  const banned = participants.filter((p) => p.status === 'BAN');
  const admins = participants.filter((p) => p.role === 'ADMIN');
  const users = participants.filter((p) => p.role === 'USER' && !banned.includes(p));        
  
    
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
                    setParticipants(data);
                }
            } catch(err) {
                console.log(err)
            }
        }

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
            if (!response.ok) {
              throw new Error("Failed to kick user.");
            }
            const updatedParticipants = participants.filter(p => p.user.id !== userId);
            setParticipants(updatedParticipants);
        } catch (error) {
            console.error(error);
        }
        };

        
        const banSomeone = async (channelId: string, userId: string) => {
            try {
                const response = await fetch(
                    `http://localhost:3000/chatroom2/${channelId}/ban/${userId}`,
              {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${authCtx.token}`,
                    },
                }
                );
                if (!response.ok) {
                    throw new Error("Failed to ban user.");
                }
                const updatedParticipants = participants.filter(p => p.user.id !== userId);
                setParticipants(updatedParticipants);
                setIsBanned(true);
                
            } catch (error) {
                console.error(error);
            }
        };
        
        const unBanSomeone = async (channelId: string, userId: string) => {
            try {
                const response = await fetch(
                    `http://localhost:3000/chatroom2/${channelId}/unban/${userId}`,
                    {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${authCtx.token}`,
                    },
                }
                );
                if (!response.ok) {
                    throw new Error("Failed to unban user.");
                }
                const updatedParticipants = participants.filter(p => p.user.id !== userId);
                setParticipants(updatedParticipants);
                
            } catch (error) {
                console.error(error);
            }
        };
        
        const muteSomeone = async (channelId: string, userId: string) => {
          try {
              const response = await fetch(
                  `http://localhost:3000/chatroom2/${channelId}/mute/${userId}`,
                  {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authCtx.token}`,
                  },
              }
              );
              if (!response.ok) {
                  throw new Error("Failed to mute user.");
              }
              const updatedParticipants = participants.filter(p => p.user.id !== userId);
              setParticipants(updatedParticipants);
              
          } catch (error) {
              console.error(error);
          }
      };

      const unMuteSomeone = async (channelId: string, userId: string) => {
        try {
            const response = await fetch(
                `http://localhost:3000/chatroom2/${channelId}/unmute/${userId}`,
                {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${authCtx.token}`,
                },
            }
            );
            if (!response.ok) {
                throw new Error("Failed to mute user.");
            }
            const updatedParticipants = participants.filter(p => p.user.id !== userId);
            setParticipants(updatedParticipants);
            
        } catch (error) {
            console.error(error);
        }
    };      

        
        useEffect(() => {
            showParticipants(props.channelId);
        }, [props.channelId, kickSomeone]);


        return (
            <>
          
                <h4 className='name-participants'>Users:</h4>
                
                <h4 className='name-participants'>Users Banned:</h4>
                <ul className='ul-participants'>
                  {banned.map((p) => (
                    <li className='username-participants' key={p.id}>
                      <MyAvatar style="s" authCtx={authCtx} alt={"avatar"} avatar={p.user.avatar} ftAvatar={p.user.ftAvatar}/>
                      {p.user.username} 
                      {admins.some(admin => admin.user.id === authCtx.userId) && (
                        <>
                          <i className="fa-solid fa-trash" onClick={() => kickSomeone(props.channelId, p.user.id)}></i>
                          {props.channelVisibility === 'PUBLIC' || props.channelVisibility === 'PWD_PROTECTED' ? (
                            <RemoveCircleOutlineIcon  onClick={() => unBanSomeone(props.channelId, p.user.id)} />
                          ) : null}
                        </>
                      )}
                    </li>
                  ))}
                </ul>
            </>
          );
          
          
}