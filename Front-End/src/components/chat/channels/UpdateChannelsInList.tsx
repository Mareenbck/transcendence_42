import React, { useContext, useEffect, useState } from "react";
import useSocket from '../../../service/socket';
import Conversation from "./Conversation";
import ChannelVisibility from "./ChannelVisibility";
import AuthContext from "../../../store/AuthContext";
import ConversationReq from "./ConversationRequest"
import ChannelsSettings from "./ChannelsSettings";
import CreateChannelButton from "./CreateChannelBtn";
import Fetch from "../../../interfaces/Fetch"

export default function UpdateChannelsInList(props: any) {
  const [conversations, setConversations] = useState([]);
  const [AConversation, setAConversation] = useState (null);
  const user = useContext(AuthContext);

  const {currentChat, currentDirect, setCurrentDirect, setCurrentChat} = props;
  const [openModal, setOpenModal] = useState(false);
  const [sendMessage, addListener] = useSocket()

  useEffect(() => {
    addListener("getConv", data => setAConversation({
      name: data.name,
      visibility: data.visibility,
    }));
  });
    
  useEffect(() => {
    AConversation && setConversations(prev=>[AConversation, ...prev]);
    }, [AConversation]);

  async function getAllConv() {
    const response = await Fetch.fetch(user.token, "GET", `chatroom2`);
    setConversations(response);
  };
  useEffect(() => {
    getAllConv();
  }, []); 

    return (
        <>
        <CreateChannelButton/>
        {conversations.map((c) => (
            <div key={c.name} onClick={() => {setCurrentChat(c); setCurrentDirect(null)}}>
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
