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
	const [conversations, setConversations] = useState<any []>([]);
	const [AConversation, setAConversation] = useState(null);
	const user = useContext(AuthContext);
	const { currentChat, setCurrentChat } = props;
	const [sendMessage, addListener] = useSocket();
	const [ALeavedChannel, setALeavedChannel] = useState<number | null>(null);
	const [APrivChannel, setAPrivChannel] = useState<number | null>(null);
	const [ADelChannel, setADelChannel] = useState<number | null>(null);

	useEffect(() => {
		addListener("getConv", data => {
	//		console.log("from new Conv 1");
			if (AConversation === null || +AConversation !== +data)
			{
	//			console.log("from new Conv 2");
				setAConversation(data);
			}
		});
	});

	useEffect(() => {
		addListener("newPriv", (channelId: number) => {
	//		console.log("from newpriv 1", channelId, "ee", APrivChannel);

			if (APrivChannel === null || +APrivChannel !== +channelId)
			{
	//			console.log("from newpriv 2");
				setAPrivChannel(channelId);
				//		getAllConv(user);
			}
		});
	});

	useEffect(() => {
		addListener("deleteChannel", (channelId) => {
	//		console.log("from Del Channel 1");
			if (ADelChannel === null || +ADelChannel !== +channelId)
			{
				setADelChannel(channelId);
	//			console.log("from Del Channel 2");
			}
			//			getAllConv(user);
		});
	});

	useEffect(() => {
		addListener('leavedChannel', (channelId: number) => {
	//		console.log("from Leave Channel 1", ALeavedChannel, "   ", channelId)
			if (ALeavedChannel === null ||	ALeavedChannel !== channelId)
			{	
	//			console.log("from Leave Channel 2")
				setALeavedChannel(channelId); 
			}
		});
	});

	async function getAllConv(user: any) {
		if (user) {
			const response = await Fetch.fetch(user.token, "GET", `chatroom2`);
// console.log("rrrrr",response);
			const filteredConversations = response.filter((c: any) =>
				c.visibility === 'PUBLIC' || c.visibility === 'PWD_PROTECTED' ||
				(c.visibility === 'PRIVATE' && 
				c.participants.some((p: any) => +p.userId === +user.userId))
			);
// console.log("rrrrr", filteredConversations);			
			setConversations(filteredConversations);
		}
	};

	useEffect(() => {
//		console.log("from ACONV Ou Leaved");
		getAllConv(user);
	}, [AConversation, ALeavedChannel, ADelChannel, APrivChannel]);

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" })
	}, [conversations]);

	const handleJoinChannel = () => {
		props.showParticipantsList(true);
	};

	return (
		<div className="conversation-list">
			{conversations.map((c: any) => (
				<div key={c?.id} onClick={() => { setCurrentChat(c) }}>
					<div className="channel-inlist">
						<div className="conversation-name">
							<Conversation name={c.name} id={c.id} visibility={c.visibility}/>
						</div>
						<div className="conversation-icon">
						{c.participants && !c.participants.some((p: any) => p.userId === user.userId) && (
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


