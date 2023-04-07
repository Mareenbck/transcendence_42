import React, { FormEvent, useContext, useEffect, useState } from "react";
import "../../../style/ChannelVisibility.css"
import Settings from '@mui/icons-material/Settings';
import KeyIcon from '@mui/icons-material/Key';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import IconButton from "@mui/material/IconButton";
import { Modal } from "@mui/material";
import { Box } from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';
import ConversationReq from "./ConversationRequest";
import AuthContext from "../../../store/AuthContext";
import ChannelsSettings from "./ChannelsSettings";

export default function ChannelVisibility(props: any) {

  const [openModal, setOpenModal] = useState(false);
  const userContext = useContext(AuthContext);
  
  
  function getIconByChannelType() {
    let icon;
        
    if (props.visibility === "PRIVATE") {
      icon = (
        <>
        <div className="visibility-icon">
          <AddBoxIcon onClick={(e: FormEvent) => joinChannel(e, props.id)}className="join-channel" fontSize="small" />
          <LockIcon className="channel-icon" fontSize="small" />
        </div>
        </>

      );
    } else if (props.visibility === "PWD_PROTECTED") {
      icon = (
        <>
         <div className="visibility-icon">
          <AddBoxIcon onClick={(e: FormEvent) => joinChannel(e, props.id)}className="join-channel" fontSize="small" />
          <KeyIcon className="channel-icon" fontSize="small" />
          <ChannelsSettings openModal={openModal} setOpenModal={setOpenModal}/>
        </div>
        </>
      );
    } else if (props.visibility == "PUBLIC") {
      icon = (
        <>   
        <div className="visibility-icon">
          <AddBoxIcon onClick={(e: FormEvent) => joinChannel(e, props.id)}className="join-channel" fontSize="small" />
          <PublicIcon className="channel-icon" fontSize="small" />        
        </div>       
        </>
      );
    }
    
    return icon;
  }
  
  const joinChannel = async (e: FormEvent, channelId: number) => {
    e.preventDefault();
    const res = await ConversationReq.joinTable(channelId, userContext.token, parseInt(userContext.userId))
    // console.log("RES")
    // console.log(res)
  }


  return (
    <div>
      {getIconByChannelType()}
      <Modal className="modal-container" open={openModal} onClose={() => setOpenModal(false)}>
        <Box className="modal-content">
          <h2>Welcome to {props.name} settings</h2>
          <div>Do you want to change the password ?</div>
        </Box>
      </Modal>
    </div>
  );
}
