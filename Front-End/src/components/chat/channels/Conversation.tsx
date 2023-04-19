import { useEffect, useState } from "react";
import "./../../../style/Conversation.css"
import React from "react";
import UsersOnChannel from "./UsersOnChannel";
import { Modal } from "@mui/material";
import { Button } from "@mui/material";
import '../../../style/UsersOnChannel.css'


export default function Conversation(props: any) {
  const [showParticipants, setShowParticipants] = useState(false);

  const handleOpen = () => {
    setShowParticipants(true);
  };

  const handleClose = () => {
    setShowParticipants(false);
  };

  return (
    <>
      <div className="conversation">
        <div className="conversationName" onClick={handleOpen}>{props.name}</div>
      </div>
          <Modal
        open={showParticipants}
        onClose={handleClose}
        BackdropComponent={(props) => (
          <div style={{ backgroundColor: 'transparent', ...props.style }} />
        )}
      >
        <div className="modal-participants">
        <button className="close-btn" onClick={handleClose}>
          <i className="fa fa-times"></i>
        </button>
          <ul>
            <UsersOnChannel channelName={props.name} channelId={props.id} />
          </ul>
        </div>
      </Modal>
    </>
  );
}

