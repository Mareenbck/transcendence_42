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
import MyAvatar from '../../user/Avatar';
import AuthContext from '../../../store/AuthContext';
import { Link } from "react-router-dom";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import MicOffIcon from '@mui/icons-material/MicOff';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import "../../../style/UsersOnChannel.css"

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
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);
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
    <Box className="participants-container" style={{ backgroundColor: '#f2f2f2'}} sx={{ flexGrow: 1, maxWidth: 752 }}>
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        Participants of {props.name}
        </Typography>
        <Demo style={{ backgroundColor: '#f2f2f2' }}>
        <List dense={dense}>
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
             Admins
        </Typography>
        {admins.map((p: any) => (
            <ListItem key={p.user.username}
            secondaryAction={
                <div>
                <Link to={`/users/profile/${p?.user.userId}`} className="profile-link">
                    <IconButton  className='violet-icon' edge="end" aria-label="Profil">
                    <AccountBoxIcon />
                    </IconButton>
                </Link>
                <i className="fa-sharp fa-solid fa-crown"></i>
                </div>
            }
            >
            <ListItemAvatar>
                <MyAvatar style="s" authCtx={authCtx} alt={"avatar"} avatar={p.user.avatar} ftAvatar={p.user.ftAvatar}/>
            </ListItemAvatar>
            <ListItemText
                primary={p?.user.username}
                secondary={secondary ? 'Secondary text' : null}
            />
            </ListItem>    
        ))}
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
            Users
            </Typography>
        {users.map((p: any) => ( 
            <ListItem key={p.user.username}
            secondaryAction={
                <div>
                <Link to={`/users/profile/${p?.user.userId}`} className="profile-link">
                    <IconButton  className='violet-icon' edge="end" aria-label="Profil">
                    <AccountBoxIcon />
                    </IconButton>
                </Link>
                </div>
            }
            >
            <ListItemAvatar>
                <MyAvatar style="s" authCtx={authCtx} alt={"avatar"} avatar={p.user.avatar} ftAvatar={p.user.ftAvatar}/>
            </ListItemAvatar>
            <ListItemText
                primary={p?.user.username}
                secondary={secondary ? 'Secondary text' : null}
            />
            {admins.some(admin => admin.user.id === authCtx.userId) && (
                <>
                <DeleteIcon onClick={() => kickSomeone(props.channelId, p.user.id)}/>
                {props.channelVisibility === 'PUBLIC' || props.channelVisibility === 'PWD_PROTECTED' ? (
                    <RemoveCircleIcon className="ban-icon" onClick={() => banSomeone(props.channelId, p.user.id)} />
                    ) : null
                }
                <MicOffIcon 
                className={`mute ${p.status === 'MUTE' ? 'muted' : ''}`} 
                onClick={() => {
                    if (p.status === 'MUTE') {
                    unMuteSomeone(props.channelId, p.user.id);
                    } else {
                    muteSomeone(props.channelId, p.user.id);
                    }
                }}
                />
                </>
            )}
            </ListItem>  
        ))}
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
            Banned Users
        </Typography>
        {banned.map((p) => (
             <ListItem key={p.user.username}
             secondaryAction={
                 <div>
                 <Link to={`/users/profile/${p?.user.userId}`} className="profile-link">
                     <IconButton  className='violet-icon' edge="end" aria-label="Profil">
                     <AccountBoxIcon />
                     </IconButton>
                 </Link>
                 </div>
             }
             >
            <ListItemAvatar>
                <MyAvatar style="s" authCtx={authCtx} alt={"avatar"} avatar={p.user.avatar} ftAvatar={p.user.ftAvatar}/>
            </ListItemAvatar>
            <ListItemText
                primary={p?.user.username}
                secondary={secondary ? 'Secondary text' : null}
            />
                {admins.some(admin => admin.user.id === authCtx.userId) && (
                <>
                    <DeleteIcon onClick={() => kickSomeone(props.channelId, p.user.id)}/>
                    {props.channelVisibility === 'PUBLIC' || props.channelVisibility === 'PWD_PROTECTED' ? (
                    <RemoveCircleOutlineIcon  onClick={() => unBanSomeone(props.channelId, p.user.id)} />
                    ) : null}
                </>
                )}
            </ListItem>
        ))}
        </List>
        </Demo>
    </Box>
    );
}