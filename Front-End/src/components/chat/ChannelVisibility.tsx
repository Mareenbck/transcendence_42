import React, { FormEvent, useContext, useState } from "react";
import "../../style/ChannelVisibility.css"
import Settings from '@mui/icons-material/Settings';
import KeyIcon from '@mui/icons-material/Key';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import IconButton from "@mui/material/IconButton";
import { Modal } from "@mui/material";
import { Box } from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';
import ConversationReq from "./conversation/conversation.req";
import AuthContext from "../../store/AuthContext";

interface Conversation {
  id: number;
  name: string;
  visibility: string;
  isPrivate: boolean;
  isProtected: boolean;
  isPublic: boolean;
}

interface Props {
  conversation: Conversation;
  channelName: string;
}


export default function ChannelVisibilityIcon({conversation, channelName}: Props) {

  const [openModal, setOpenModal] = useState(false);

  const userContext = useContext(AuthContext)

  const joinChannel = async (e: FormEvent, channelId: number) => {
    e.preventDefault();
      const res = await ConversationReq.joinTable(channelId, userContext.token, parseInt(userContext.userId))
      console.log("RES")
      console.log(res)
  }

  function getIconByChannelType() {
    let icon;

    if (conversation.visibility === "PRIVATE") {
      icon = (
        <>
          <AddBoxIcon onClick={(e: FormEvent) => joinChannel(e, conversation.id)}className="join-channel" fontSize="small" />
          <LockIcon className="channel-icon" fontSize="small" />
          <IconButton onClick={() => setOpenModal(true)}>
            <Settings fontSize="small" />
          </IconButton>
        </>

      );
    } else if (conversation.visibility === "PWD_PROTECTED") {
      icon = (
        <>
          <AddBoxIcon onClick={(e: FormEvent) => joinChannel(e, conversation.id)}className="join-channel" fontSize="small" />
          <KeyIcon className="channel-icon" fontSize="small" />
          <IconButton onClick={() => setOpenModal(true)}>
            <Settings fontSize="small" />
          </IconButton>
        </>
      );
    } else {
      icon = (
        <>          
        <AddBoxIcon onClick={(e: FormEvent) => joinChannel(e, conversation.id)}className="join-channel" fontSize="small" />
          <PublicIcon className="channel-icon" fontSize="small" />
          <IconButton onClick={() => setOpenModal(true)}>
            <Settings fontSize="small" />
          </IconButton>
        </>
      );
    }

    return icon;
  }

  return (
    <div>
      {getIconByChannelType()}
      <Modal className="modal-container" open={openModal} onClose={() => setOpenModal(false)}>
        <Box className="modal-content">
          <h2>Welcome to {channelName} settings</h2>
          <div>Do you want to change the password ?</div>
        </Box>
      </Modal>
    </div>
  );
}
