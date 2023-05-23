import React, { FormEvent, useContext, useRef, useState } from "react";
import "../../../style/ChannelVisibility.css"
import { Modal, TextField, Typography } from "@mui/material";
import { Box } from "@mui/material";
import AuthContext from "../../../store/AuthContext";
import IconButton from "@mui/material/IconButton";
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import VisibilityIcon from '@mui/icons-material/Visibility';
import useSocket from "../../../service/socket";


export default function ChannelVisibility(props: any) {

	const [openJoinModal, setOpenJoinModal] = useState(false);
	const userContext = useContext(AuthContext);
	const passwordInputRef = useRef<HTMLInputElement>(null);
	const [isJoined, setIsJoined] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = (e: FormEvent) => setShowPassword(!showPassword);
	const [passwordError, setPasswordError] = useState(false);
	const [sendMessage, addListener] = useSocket();


  const handleOpenJoinModal = (e: FormEvent) => {
    setOpenJoinModal(true);
  };


  const handleCloseModal = (e: FormEvent) => {
    setOpenJoinModal(false);
  };


  function getIconByChannelType() {
    let icon;

    if (props.visibility === "PWD_PROTECTED") {
      icon = (
        <div className="visibility-icon">
          {!isJoined &&(
            <IconButton onClick={handleOpenJoinModal} aria-label="fingerprint">
              <ArrowCircleRightIcon />
            </IconButton>
          )}
        </div>
      );
    }else if (props.visibility === "PUBLIC") { // on vérifie que le timeout n'est pas actif
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

	if (!passwordInputRef.current?.value && props.visibility === "PWD_PROTECTED") {
		setPasswordError(true)
		alert("wrongpassword")
		return;
	}
    try {
        const resp = await fetch("http://" + window.location.hostname + ':3000'  + `/chatroom2/join`, {
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
        const data = await resp.json();
        if (!data) {
            setPasswordError(true);
			  alert("wrong pasword");
			return;
        } else {
            setIsJoined(true);
            setOpenJoinModal(false);
			      sendMessage("joinedChannel", data)
            sendMessage("toMute", data.channelId)
        }
    } catch (err) {
        console.log(err);
    }
};

const handlePassword= (e: FormEvent) => {
	const value = (e.target as HTMLInputElement).value;
	setPasswordError(value.trim() === '');
  };

  return (
    <>
      <div>
        <Modal
          className="modal-container"
          open={openJoinModal}
          onClose={handleCloseModal}
        >
          <Box className="modal-content-password">
            <label htmlFor="floatingPassword">Enter the password</label>
            <TextField
              id="password"
              className="custom-field"
              label="password"
              type={showPassword ? "text" : "password"}
              variant="filled"
              placeholder="Type a new password..."
              inputRef={passwordInputRef}
			        onChange={handlePassword}
              error={passwordError}
            />
            <VisibilityIcon
              className="pwd-icon"
              onClick={(e: FormEvent) => handleClickShowPassword(e)}
            />
            <Typography variant="caption" color="error">
              {passwordError && "Incorrect password"}
            </Typography>
            <button
				className="btnn"
				disabled={passwordError}
				onClick={(e: FormEvent) => joinChannel(e, props.id)}>ok
			</button>

          </Box>
        </Modal>
      </div>
      {getIconByChannelType()}
    </>
  );

}
