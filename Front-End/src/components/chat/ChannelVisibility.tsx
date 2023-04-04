import React, { useState } from "react";
import "../../style/ChannelVisibility.css"
import Settings from '@mui/icons-material/Settings';
import KeyIcon from '@mui/icons-material/Key';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import IconButton from "@mui/material/IconButton";
import { Modal } from "@mui/material";
import { Box } from "@mui/material";

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
}

export default function ChannelVisibilityIcon({conversation}: Props) {

  const [openModal, setOpenModal] = useState(false);

  function getIconByChannelType() {
    let icon;

    if (conversation.visibility === "PRIVATE") {
      icon = (
        <>
          <LockIcon fontSize="small" />
          <IconButton onClick={() => setOpenModal(true)}>
            <Settings fontSize="small" />
          </IconButton>
        </>

      );
    } else if (conversation.visibility === "PWD_PROTECTED") {
      icon = (
        <>
          <KeyIcon fontSize="small" />
          <IconButton onClick={() => setOpenModal(true)}>
            <Settings fontSize="small" />
          </IconButton>
        </>
      );
    } else {
      icon = (
        <>
          <PublicIcon fontSize="small" />
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
          <h2>Welcome to channel settings</h2>
          <div>Do you want to change the password ? </div>
        </Box>
      </Modal>
    </div>
  );
}
