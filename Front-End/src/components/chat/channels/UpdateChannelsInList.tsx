import React, { RefObject, useContext, useEffect, useRef, useState } from "react";
import useSocket from '../../../service/socket';
import Conversation from "./Conversation";
import ChannelVisibility from "./ChannelVisibility";
import AuthContext from "../../../store/AuthContext";
import CreateChannelButton from "./CreateChannelBtn";
import ChannelInvitations from "./ChannelInvitations";
import Fetch from "../../../interfaces/Fetch";
import UsersOnChannel from "./UsersOnChannel";

export default function UpdateChannelsInList(props: any) {
	const scrollRef: RefObject<HTMLDivElement> = useRef(null);
	const [conversations, setConversations] = useState([]);
	const [AConversation, setAConversation] = useState(null);
	const user = useContext(AuthContext);
	const { currentChat, setCurrentChat } = props;
	const [sendMessage, addListener] = useSocket();

	
	useEffect(() => {
		addListener("getConv", data => {setAConversation(data)});
	});

	useEffect(() => {
		addListener("deleteChannel", data => {setAConversation(data)});
	});

	// useEffect(() => {
	// 	AConversation && setConversations(prev => {
	// 		const conversationExists = prev.find((conversation: { id: number; }) => conversation.id === AConversation.id);
	// 		if (conversationExists) { return prev;} else {return [AConversation, ...prev];}
	// 	});
	// }, [AConversation]);


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
	}, [AConversation]);


	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" })
	}, [conversations]);

	const handleJoinChannel = () => {
		props.showParticipantsList(true);
	};


	return (
		<div className="conversation-list">
			{conversations.map((c: any) => (
				<div key={c.id} onClick={() => { setCurrentChat(c) }}>
					<div className="channel-inlist">
						<div className="conversation-name">
							<Conversation name={c.name} id={c.id} visibility={c.visibility}/>
						</div>
						<div className="conversation-icon">
						{c.participants && !c.participants.some(p => p.userId === user.userId) && (
							<ChannelVisibility 
								visibility={c.visibility} 
								id={c.id} 
								isJoined={c.isJoined} 
								setIsJoined={c.setIsJoined}
							/>
						)}
						</div>
					</div>
				</div>
			))}
			<ChannelInvitations />
			<div className="create-channel-position">
				<CreateChannelButton />
			</div>
		</div>
	);
}


