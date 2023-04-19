import React, { RefObject, useContext, useEffect, useRef, useState } from "react";
import useSocket from '../../../service/socket';
import Conversation from "./Conversation";
import ChannelVisibility from "./ChannelVisibility";
// import io, { Socket } from "socket.io-client";
import AuthContext from "../../../store/AuthContext";
import CreateChannelButton from "./CreateChannelBtn";
import ChannelInvitations from "./ChannelInvitations";
import Fetch from "../../../interfaces/Fetch";


export default function UpdateChannelsInList(props: any) {
	const scrollRef: RefObject<HTMLDivElement> = useRef(null);
	const [conversations, setConversations] = useState([]);
	const [AConversation, setAConversation] = useState(null);
	const user = useContext(AuthContext);

	const { currentChat, setCurrentChat } = props;
	// const [openModal, setOpenModal] = useState(false);
	const [sendMessage, addListener] = useSocket()

	useEffect(() => {
		addListener("getConv", data => setAConversation({
			id: data.channelId,
			name: data.name,
			visibility: data.visibility,
		}));
	});

	useEffect(() => {
		AConversation && setConversations(prev => [AConversation, ...prev]);
	}, [AConversation]);

	useEffect(() => {
		async function getAllConv(user: AuthContext) {
			if (user) {
				const response = await Fetch.fetch(user.token, "GET", `chatroom2`);
				const filteredConversations = response.filter(c =>
					c.visibility === 'PUBLIC' || c.visibility === 'PWD_PROTECTED' ||
					(c.visibility === 'PRIVATE' && c.participants.some(p => p.userId === user.userId))
				);
				setConversations(filteredConversations);
			}
		};
		getAllConv(user);
	}, [user]);

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" })
	}, [conversations]);

	return (
		<>
			<CreateChannelButton />
			{conversations.map((c) => (
				<div key={c.id} onClick={() => { setCurrentChat(c) }}>
					<div className="conversation">
						<div className="conversation-name">
							<Conversation name={c.name} id={c.id}/>
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

