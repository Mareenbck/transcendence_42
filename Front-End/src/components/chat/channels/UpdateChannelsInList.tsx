import React, { useContext, useEffect, useState } from "react";
import { socket } from "../../../service/socket";
import Conversation from "./Conversation";
import ChannelVisibility from "./ChannelVisibility";
import io, { Socket } from "socket.io-client";
import AuthContext from "../../../store/AuthContext";
import ConversationReq from "./ConversationRequest"
import ChannelsSettings from "./ChannelsSettings";



export default function UpdateChannelsInList(props: any) {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState (null);
  const [currentDirect, setCurrentDirect] = useState (null);
  const [AConversation, setAConversation] = useState (null);
  const user = useContext(AuthContext);
  const [openModal, setOpenModal] = useState(false);




    useEffect(() => {
      socket.current = io("ws://localhost:8001")
    })

    useEffect(() => {
      socket.current.on("getConv", data => {
        setAConversation({
          name: data.content.name,
          avatar: data.content.avatar,
        });
      });
    }, []);
    
    useEffect(() => {
      AConversation && setConversations(prev=>[AConversation, ...prev]);
      }, []);
      
      
      useEffect(() => {
        async function getAllConv(user: AuthContext) {
          const response = await ConversationReq.getAll(user);
          setConversations(response);
        };
        getAllConv(user);
      }, []);
      
    return (
        <>
        {conversations.map((c) => (
            <div key={c.id} onClick={() => {setCurrentChat(c); setCurrentDirect(null)}}>
                <div className="conversation">
                    <div className="conversation-name">
                        <Conversation name={c.name}/>

                    </div>
                    <div className="conversation-icon">
                        <ChannelVisibility visibility={c.visibility} id={c.id}/>
                    </div>
                </div>
            </div>
            ))}
        </>
    );
}