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
    user
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
      <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
          All users
        </Typography>
        <Demo>
          <List dense={dense}>
            {onlineUsers?.map((o) => (
              +o?.userId.userId !== +id ? (
                <ListItem
                  key={o?.userId.userId}
                  secondaryAction={
                    <IconButton edge="end" aria-label="Jouer" onClick={() => inviteGame(o?.userId.userId)}> 
                    <Link to={'/game/'} onClick={() => inviteGame(+o?.userId.userId)}>                    
                        <PlayCircleIcon/>                    
                    </Link>
                    <Link to={`/users/profile/${o?.id}`} className="profile-link">                    
                        <AccountBoxIcon/>
                    </Link>
                    </IconButton>
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
                  key={o?.id}
                  secondaryAction={
                    <IconButton edge="end" aria-label="Jouer" onClick={() => inviteGame(o?.userId.userId)}> 
                    <Link to={'/game/'} onClick={() => inviteGame(+o?.userId.userId)}>                    
                        <PlayCircleIcon/>                    
                    </Link>
                    <Link to={`/users/profile/${o?.id}`} className="profile-link">                    
                        <AccountBoxIcon/>
                    </Link>                    
                    </IconButton>
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