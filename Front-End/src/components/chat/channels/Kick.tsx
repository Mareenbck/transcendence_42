import { useContext, useState } from "react";
import AuthContext from '../../../store/AuthContext';
import MyAvatar from '../../user/Avatar';
import React from "react";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

export default function Kick(props: any) {
    const authCtx = useContext(AuthContext);
    const [participant, setParticipant] = useState(props.participant);

    console.log("HELLOOOOOO")
  
    const kickSomeone = async (channelId: string, userId: string) => {
      try {
        const response = await fetch(
          `http://localhost:3000/chatroom2/${channelId}/kick/${userId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authCtx.token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to kick user.");
        }
        const data = await response.json();
        console.log(data); // affiche la réponse du serveur après avoir viré l'utilisateur
      } catch (error) {
        console.error(error);
      }
    };
  
    const handleKickClick = async () => {
      try {
        console.log("entre dans handle kick click")
        await kickSomeone(props.channelId, participant.user.id);
        console.log(`Kicked user ${participant.user.username}`);
      } catch (error) {
        console.error("Failed to kick user:", error);
      }
    };

    console.log("PARTICIPANT---->", participant)
  
    return (
      <li className="username-participants" key={participant.id}>
        <MyAvatar
          style="s"
          authCtx={authCtx}
          alt={"avatar"}
          avatar={participant.user.avatar}
          ftAvatar={participant.user.ftAvatar}
        />
        {participant.user.username}
        {participant.isAdmin && (
          <IconButton aria-label="kick" onClick={handleKickClick}>
            <HighlightOffIcon />
          </IconButton>
        )}
      </li>
    );
  }