import React, { useContext, useEffect, useState } from "react";
import useSocket from '../../../service/socket';
import Conversation from "./Conversation";
import ChannelVisibility from "./ChannelVisibility";
// import io, { Socket } from "socket.io-client";
import AuthContext from "../../../store/AuthContext";
import ConversationReq from "./ConversationRequest"
import ChannelsSettings from "./ChannelsSettings";
import CreateChannelButton from "./CreateChannelBtn";
import ChannelInvitations from "./ChannelInvitations";


export default function UpdateChannelsInList(props: any) {
	const [conversations, setConversations] = useState([]);
	const [AConversation, setAConversation] = useState(null);
	const user = useContext(AuthContext);

	const { currentChat, currentDirect, setCurrentDirect, setCurrentChat } = props;
	const [openModal, setOpenModal] = useState(false);
	const [sendMessage, addListener] = useSocket()

	useEffect(() => {
		addListener("getConv", data => {
			setAConversation({
				name: data.content.name,
			});
		});
	}, []);

	useEffect(() => {
		AConversation && setConversations(prev => [AConversation, ...prev]);
	}, [AConversation]);

	useEffect(() => {
		async function getAllConv(user: AuthContext) {
			if (user) {
				const response = await ConversationReq.getAll(user);
				const filteredConversations = response.filter(c =>
					c.visibility === 'PUBLIC' || c.visibility === 'PWD_PROTECTED' ||
					(c.visibility === 'PRIVATE' && c.participants.some(p => p.userId === user.userId))
				);
				console.log("filteredConversations dans le fetch")
				console.log(filteredConversations)
				setConversations(filteredConversations);
			}
		};
		getAllConv(user);
	}, [user]);

	return (
		<>
			<CreateChannelButton />
			{conversations.map((c) => (
				<div key={c.id} onClick={() => { setCurrentChat(c); setCurrentDirect(null) }}>
					<div className="conversation">
						<div className="conversation-name">
							<Conversation name={c.name} />
						</div>
						<div className="conversation-icon">
							<ChannelVisibility visibility={c.visibility} id={c.id} />
						</div>
					</div>
				</div>
			))}
			<ChannelInvitations />
		</>
	);
}

