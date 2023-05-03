import * as React from 'react';
import { useEffect, useContext, useState, useRef, FormEvent, RefObject } from 'react'
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
import MyAvatar from '../user/Avatar';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import LockIcon from '@mui/icons-material/Lock';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { Link } from "react-router-dom";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import CurrentChannel from './channels/CurrentChannel';
import UsersOnChannel from './channels/UsersOnChannel';
import MessageD from './message/messageD';
import UsersWithDirectMessage from './message/usersWithMessages';
import { Tab, useThemeProps } from '@mui/material';
import { Tabs } from '@mui/material';
import UpdateChannelsInList from './channels/UpdateChannelsInList';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import MailIcon from '@mui/icons-material/Mail';



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

export default function InteractiveList({
    onlineUsers,
    otherUsers,
    id,
    getUser,
    amIBlocked,
    inviteGame,
    setToBlock,
    setToUnblock,
    isHeBlocked,
    getDirect,
    user,
  
  }) {
    const [dense, setDense] = React.useState(false);
    const [secondary, setSecondary] = React.useState(false);
  
    function generate(element: React.ReactElement) {
      return [0, 1, 2].map((value) =>
        React.cloneElement(element, {
          key: value,
        }),
      );
    }


  
    return (
      <Box style={{ backgroundColor: '#f2f2f2'}} sx={{ flexGrow: 1, maxWidth: 752 }}>
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
          All users
        </Typography>
        <Demo style={{ backgroundColor: '#f2f2f2' }}>
          <List dense={dense}>

          {onlineUsers?.map((o) => (
            +o?.userId.userId !== +id ? (
                <ListItem key={o?.userId.userId} onClick={()=> {getDirect(o?.userId)}}
                secondaryAction={
                    <div>
                      
                    <Link to={'/game/'} onClick={() => inviteGame(+o?.userId.userId)}>
                        <IconButton className='violet-icon' edge="end" aria-label="Play">
                        <PlayCircleIcon/>
                        </IconButton>
                    </Link>
                    <Link to={`/users/profile/${o?.id}`} className="profile-link">
                        <IconButton  className='violet-icon' edge="end" aria-label="Profil">
                        <AccountBoxIcon />
                        </IconButton>
                    </Link>
                    {isHeBlocked(+o.userId.userId) ?
                        <IconButton className='violet-icon' edge="end" aria-label="Unblock" onClick={() => {setToBlock(getUser(+o.userId.userId))}}>
                        <LockOpenIcon />
                        </IconButton>
                        :
                        <IconButton edge="end" aria-label="Block" onClick={() => {setToUnblock(getUser(+o.userId.userId))}}>
                        <LockIcon />
                        </IconButton>
                    }
                    </div>
                }
                >
                <ListItemAvatar>
                    <MyAvatar authCtx={user} id={o?.userId.userId} style="xs" avatar={o?.userId.avatar} ftAvatar={o?.userId.ftAvatar}/>
                </ListItemAvatar>
                <ListItemText
                    primary={o?.userId.username}
                    secondary={secondary ? 'Secondary text' : null}
                />
                </ListItem>
            ) : null
            ))}

            {otherUsers?.map((o) => ( 
              +o?.id !== +id && !onlineUsers.find(u => +u.userId.userId === +o?.id) ? (
                <ListItem
                    key={o?.id} onClick={()=> {getDirect(o)}}
                    secondaryAction={
                        <div>
                        <Link to={'/game/'}  className='violet-icon' onClick={() => inviteGame(+o?.id)}>                    
                            <IconButton  edge="end" aria-label="Play"> 
                            <PlayCircleIcon className='violet-icon'/>
                            </IconButton>                  
                        </Link>
                        <Link to={`/users/profile/${o?.id}`}>  
                        <IconButton className='violet-icon' edge="end" aria-label="Profil">         
                            <AccountBoxIcon/>
                        </IconButton>
                        </Link>
                        {isHeBlocked(+o.id) ?
                        <IconButton className='violet-icon' edge="end" aria-label="Unblock" onClick={() => {setToBlock(getUser(+o.id))}}>
                            <LockOpenIcon/>
                            </IconButton>
                            :
                        <IconButton className='violet-icon' edge="end" aria-label="Block" onClick={() => {setToUnblock(getUser(+o.id))}}>
                            <LockIcon onClick={() => {setToUnblock(getUser(+o.id))}}/>
                            </IconButton>
                        }
                        </div>
                    }
                    >
                  <ListItemAvatar>
                    <MyAvatar authCtx={user} id={o?.id} style="xs" avatar={o?.avatar} ftAvatar={o?.ftAvatar}/>
                  </ListItemAvatar>
                  <ListItemText
                    primary={o?.username}
                    secondary={secondary ? 'Secondary text' : null}
                  />
                </ListItem>
              ) : null
            ))}
          </List>
        </Demo>
      </Box>
    );
  }