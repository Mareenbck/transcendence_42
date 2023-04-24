import React, { FormEvent, useContext, useEffect, useRef, useState } from "react";
import "../../../style/ChannelVisibility.css"
import { Modal } from "@mui/material";
import { Box } from "@mui/material";
import AuthContext from "../../../store/AuthContext";
import IconButton from "@mui/material/IconButton";
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ChatInChatroom from "./ChatInChatroom";

export default function ChannelVisibility(props: any) {

  const [openJoinModal, setOpenJoinModal] = useState(false);
  const userContext = useContext(AuthContext);
  const passwordInputRef = useRef<HTMLInputElement>(null);
	const [isJoined, setIsJoined] = useState(false);


  const handleOpenJoinModal = (e: FormEvent) => {
    setOpenJoinModal(true);
  };


  function getIconByChannelType() {
    let icon;

    if (props.visibility === "PWD_PROTECTED") {
      icon = (
        <div className="visibility-icon">
          {!isJoined && (
            <IconButton onClick={handleOpenJoinModal} aria-label="fingerprint">
              <ArrowCircleRightIcon />
            </IconButton>
          )}
          {isJoined && (
            <IconButton disabled={true} aria-label="fingerprint" style={{ opacity: 0 }}>
              <ArrowCircleRightIcon />
            </IconButton>
          )}
        </div>
      );
    } else if (props.visibility === "PUBLIC") {
      icon = (
        <div className="visibility-icon">
          {!isJoined && (
            <IconButton onClick={(e: FormEvent) => joinChannel(e, props.id)} aria-label="fingerprint">
              <ArrowCircleRightIcon />
            </IconButton>
          )}
          {isJoined && (
            <IconButton disabled={true} aria-label="fingerprint" style={{ opacity: 0 }}>
              <ArrowCircleRightIcon />
            </IconButton>
          )}
        </div>
      );
    }
    return icon;
  }

  const joinChannel = async (e: FormEvent, channelId: number) => {
    e.preventDefault();
    const password = passwordInputRef.current?.value;
    try {
      const resp = await fetch(`http://localhost:3000/chatroom2/join`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userContext.token}`
        },
        body: JSON.stringify({
          channelId: channelId,
          userId: userContext.userId,
          hash: password
        })
      });
      if (!resp.ok) {
        const message = `An error has occured: ${resp.status} - ${resp.statusText}`;
        throw new Error(message);
      }
      setIsJoined(true);
    } catch (err) {
      console.log(err);
    }
    setOpenJoinModal(false);
  };


  return (
    <>
        <div>
          <Modal className="modal-container" open={openJoinModal} onClose={() => setOpenJoinModal(false)}>
            <Box className="modal-content">
              <div className="form-input">
                <label htmlFor="floatingPassword">Password</label>
                <input type="password" ref={passwordInputRef} className="form-fields-channel" placeholder="Password" />
              </div>
              <button onClick={(e: FormEvent) => joinChannel(e, props.id)}>ok</button>
            </Box>
          </Modal>
        </div>
        {getIconByChannelType()}
    </>
  );
  
}
