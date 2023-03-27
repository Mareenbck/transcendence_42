import React, { useRef } from 'react';
import { Popup } from 'reactjs-popup';
import { useEffect, useContext, useState, FormEvent } from 'react'
import "../../style/PopUpChannel.css"
import "../../pages/Setting.tsx"
import AuthContext from '../../store/AuthContext';
import Chat from './Chat';
import { socket } from '../../service/socket';
import ConversationReq from "./conversation/conversation.req"
import { Box, Modal, Typography } from '@mui/material';

const authCtx = useContext(AuthContext);    
const [isPublic, setIsPublic] = useState(true);
const [isPrivate, setIsPrivate] = useState(true);
const [isProtected, setIsProtected] = useState(true);
const [selectedFile, setSelectedFile] = useState('');
const [conversations, setConversations] = useState<ConversationDto[]> ([]);
const [showPopUp, setShowPopUp] = useState(false);
const user = useContext(AuthContext);
const id = user.user

<Button onClick={handleOpen}>Open modal</Button>
<Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={style}>
    <Typography id="modal-modal-title" variant="h6" component="h2">
      Text in a modal
    </Typography>
    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
      Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
    </Typography>
  </Box>
</Modal>