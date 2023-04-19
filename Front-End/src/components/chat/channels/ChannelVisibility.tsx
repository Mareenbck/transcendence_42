import React, { FormEvent, useContext, useEffect, useRef, useState } from "react";
import "../../../style/ChannelVisibility.css"
import Settings from '@mui/icons-material/Settings';
import KeyIcon from '@mui/icons-material/Key';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import { Modal } from "@mui/material";
import { Box } from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';
import ConversationReq from "./ConversationRequest";
import AuthContext from "../../../store/AuthContext";
import ChannelsSettings from "./ChannelsSettings";
import JoinProtectedChannel from "./JoinProtectedChannel";
import PrivateChannel from "./PrivateChannel";

export default function ChannelVisibility(props: any) {

  const [openModal, setOpenModal] = useState(false);
  const [openJoinModal, setOpenJoinModal] = useState(false);
  const userContext = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState<string | null>('');
  const [isUser, setIsUser] = useState<string | null>('');
  const passwordInputRef = useRef<HTMLInputElement>(null);


  const getRolesUser = async (id: string, channelId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/chatroom2/userTable/${id}/${channelId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userContext.token}`
          }
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setIsAdmin(data[0].role);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };


  useEffect(() => {
    if (props.id)
      {getRolesUser(userContext.userId, props.id)};
  }, [props.id, userContext.userId])

  const handleOpenJoinModal = (e: FormEvent) => {
    setOpenJoinModal(true);
  };


  function getIconByChannelType() {
    let icon;

    if (props.visibility === "PRIVATE") {
      icon = <PrivateChannel id={props.id} role={isAdmin} />;
    } else if (props.visibility === "PWD_PROTECTED") {
      icon = (
        <>
         <div className="visibility-icon">
          {/* <JoinProtectedChannel onOpenModal={handleOpenJoinModal} onClick={(e: FormEvent) => joinChannel(e, props.channelId)} className="join-channel" fontSize="small" />  */}
          <JoinProtectedChannel onOpenJoinModal={handleOpenJoinModal} className="join-channel" fontSize="small"/>
          <KeyIcon className="channel-icon" fontSize="small" />
          <ChannelsSettings role={isAdmin} onOpenModal={handleOpenModal} />
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

  const joinChannel = async (e: FormEvent, channelId: number, token: string) => {
	e.preventDefault();
	const password = passwordInputRef.current?.value;
	try {
		const resp = await fetch(`http://localhost:3000/chatroom2/join`, {
		  method: "POST",
		  headers: {
			"Content-type": "application/json",
			Authorization: `Bearer ${userContext.token}`,
		  },
		  body: JSON.stringify({
        channelId: channelId,
        userId: userContext.userId,
        hash: password,
		  }),
		});
		if (!resp.ok) {
		  const message = `An error has occured: ${resp.status} - ${resp.statusText}`;
		  throw new Error(message);
		}
		const data = await resp.json();
	  } catch(err) {
		console.log(err)
	  }
	  setOpenJoinModal(false);
  }


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
      <Modal className="modal-container" open={openModal}  onClose={() => setOpenModal(false)}>
        <Box className="modal-content">
          <h2>Welcome to {props.name} settings</h2>
          <div>Do you want to change the password ?</div>
        </Box>
      </Modal>
      </div>
      {getIconByChannelType()}
      <div>
    </div>
    </>
  );
}
