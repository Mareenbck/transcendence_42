import * as React from 'react';
import { useEffect, useContext, useState, useRef, FormEvent, RefObject } from 'react'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import AuthContext from '../../../store/AuthContext';
import { Link } from "react-router-dom";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import MicOffIcon from '@mui/icons-material/MicOff';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import "../../../style/UsersOnChannel.css"
import PersonnalInfoChat from '../PersonnalInfoChat';
import { Avatar, Tooltip } from '@mui/material';
import "../../../style/UsersChat.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FriendContext } from "../../../store/FriendshipContext";
import { faTrash, faBan, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons'


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

export default function InteractiveListe(props: any) {
    const friendCtx = React.useContext(FriendContext);
    const [friends, setFriends] = React.useState<any[]>([]);
    const [dense, setDense] = React.useState(false);
    const [secondary, setSecondary] = React.useState(false);
    const authCtx = useContext(AuthContext);
    const [isBanned, setIsBanned] = React.useState(false);
    const [isMuted, setIsMuted] = React.useState(false);
    const [participants, setParticipants] = React.useState([]);
    const banned = participants.filter((p: any) => p.status === 'BAN');
    const admins = participants.filter((p: any) => p.role === 'ADMIN');
    const users = participants.filter((p: any) => p.role === 'USER' && !banned.includes(p)); 
   
    const showParticipants = React.useCallback(async (channelId: string) => {
        try {
            const response = await fetch(
                `http://localhost:3000/chatroom2/${channelId}/participants`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authCtx.token}`
                    }
                }
            );
            if (response.ok) {
                const data = await response.json();
                setParticipants(data);
            }
        } catch (err) {
            console.log(err)
        }
    }, [authCtx.token]);


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
        }, [props.channelId, showParticipants]);


return (
    <Box className="participants-container" style={{ backgroundColor: '#f2f2f2'}} sx={{ flexGrow: 1, maxWidth: 752 }}>
        <PersonnalInfoChat />
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        Participants of {props.channelName}
        </Typography>
        <Demo style={{ backgroundColor: '#f2f2f2' }}>
        <List dense={dense}>
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
             Admins
        </Typography>
        {admins.map((participants: any) => (
            <ListItem key={participants.user.username}
            secondaryAction={
                <div>
                    <i className="fa-sharp fa-solid fa-crown"></i>
                </div>
            }
            >
            <ListItemAvatar>
                {/* <Avatar variant="rounded" className="users-chatlist-avatar" src={participants.user.ftAvatar ? participants.user.ftAvatar : participants.user.avatar} /> */}
            </ListItemAvatar>
            <ListItemText
                primary={participants?.user.username}
                secondary={secondary ? 'Secondary text' : null}
            />
            </ListItem>
        ))}
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
            Users
            </Typography>
        {users.map((participants: any) => ( 
            <ListItem key={participants.user.username}>
            <ListItemAvatar>
                {/* <Avatar variant="rounded" className="users-chatlist-avatar"  src={participants.user.ftAvatar ? participants.user.ftAvatar : participants.user.avatar} /> */}
            </ListItemAvatar>
            <ListItemText
                primary={participants?.user.username}
                secondary={secondary ? 'Secondary text' : null}
            />
            {admins.some(admin => admin.user.id === authCtx.userId) && (
                <>
                <Tooltip title="Kick">
                    <FontAwesomeIcon icon={faTrash} onClick={() => kickSomeone(props.channelId, participants.user.id)} className={`btn-chatlist`}/>
				</Tooltip>
                {props.channelVisibility === 'PUBLIC' || props.channelVisibility === 'PWD_PROTECTED' ? (
                     <Tooltip title="Ban">
                        <FontAwesomeIcon icon={faBan} onClick={() => banSomeone(props.channelId, participants.user.id)} className={`btn-chatlist`}/>
                    </Tooltip>
                    ) : null
                }
                 <Tooltip title="Mute">
                    <FontAwesomeIcon 
                        icon={faMicrophoneSlash} 
                        onClick={() => {
                            if (participants.status === 'MUTE') {
                            unMuteSomeone(props.channelId, participants.user.id);
                            } else {
                            muteSomeone(props.channelId, participants.user.id);
                            }
                        }}                        
                        className={`btn-chatlist mute ${participants.status === 'MUTE' ? 'muted' : ''}`}
                    />
				</Tooltip>           
                </>
            )}
            </ListItem>
        ))}
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
            Banned Users
        </Typography>
        {banned.map((participants: any) => (
             <ListItem key={participants.user.username}>
            <ListItemAvatar>
                {/* <Avatar variant="rounded" className="users-chatlist-avatar"  src={participants.user.ftAvatar ? participants.user.ftAvatar : participants.user.avatar} /> */}
            </ListItemAvatar>
            <ListItemText
                primary={participants?.user.username}
                secondary={secondary ? 'Secondary text' : null}
            />
                {admins.some(admin => admin.user.id === authCtx.userId) && (
                <>
                <Tooltip title="Kick">
                    <FontAwesomeIcon icon={faTrash} onClick={() => kickSomeone(props.channelId, participants.user.id)} className={`btn-chatlist`}/>
				</Tooltip>                   
                {props.channelVisibility === 'PUBLIC' || props.channelVisibility === 'PWD_PROTECTED' ? (
                <Tooltip title="UnBan">
                    <FontAwesomeIcon icon={faBan} onClick={() => unBanSomeone(props.channelId, participants.user.id)} className={`btn-chatlist`}/>
                </Tooltip> 
                ) : null
                }
                </>
                )}
            </ListItem>
        ))}
        </List>
        </Demo>
    </Box>
    );
}
