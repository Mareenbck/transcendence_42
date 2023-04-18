import { useEffect, useState } from "react";
import "./../../../style/Conversation.css"
import React from "react";
import UsersOnChannel from "./UsersOnChannel";

export default function Conversation(props: any) {

 
  const [showParticipants, setShowParticipants] = useState(false);

  const handleClick = () => {
    setShowParticipants(true);
  };

  return (
    <>
      <div className="conversation" onClick={handleClick}>
        <div className="conversationName">{props.name}</div>
      </div>
      {showParticipants && <UsersOnChannel channelId={props.id} channelName={props.name} username={props.username}/>}
    </>
  );

}
