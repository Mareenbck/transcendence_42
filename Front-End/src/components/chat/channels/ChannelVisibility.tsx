import React, { FormEvent, useContext, useEffect, useRef, useState } from "react";
import "../../../style/ChannelVisibility.css"
import { Modal } from "@mui/material";
import { Box } from "@mui/material";
import AuthContext from "../../../store/AuthContext";
import IconButton from "@mui/material/IconButton";
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

export default function ChannelVisibility(props: any) {

  const [openJoinModal, setOpenJoinModal] = useState(false);
  const userContext = useContext(AuthContext);
//   const [isAdmin, setIsAdmin] = useState<string | null>('');
  const passwordInputRef = useRef<HTMLInputElement>(null);
    const [isJoined, setIsJoined] = useState(false);


//   const getRolesUser = async (id: string, channelId: string) => {
//     try {
//       const response = await fetch(
//         `http://localhost:3000/chatroom2/userTable/${id}/${channelId}`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${userContext.token}`
//           }
//         }
//       );
//       if (response.ok) {
//         const data = await response.json();
//         if (data && data.length > 0) {
//           setIsAdmin(data[0].role);
//         }
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleOpenModal = () => {
//     setOpenModal(true);
//   };


//   useEffect(() => {
//     if (props.id)
//       {getRolesUser(userContext.userId, props.id)};
//   }, [props.id, userContext.userId])

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

//   useEffect(() => {
//     async function fetchChannelJoinStatus() {
//       try {
//         const resp = await fetch(`http://localhost:3000/chatroom2/userTable/${userContext.userId}/${props.id}`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${userContext.token}`
//           }
//         });

//         if (!resp.ok) {
//           const message = `An error has occured: ${resp.status} - ${resp.statusText}`;
//           throw new Error(message);
//         }

//         const data = await resp.json();
//         if (data && data.length > 0) {
//           setIsJoined(true);
//         }
//       } catch (err) {
//         console.log(err);
//       }
//     }

//     fetchChannelJoinStatus();
//   }, [props.id, userContext.token, userContext.userId]);


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
