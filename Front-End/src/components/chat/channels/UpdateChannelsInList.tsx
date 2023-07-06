import React, { RefObject, useContext, useEffect, useRef, useState } from "react";
import useSocket from '../../../service/socket';
import Conversation from "./Conversation";
import ChannelVisibility from "./ChannelVisibility";
import AuthContext from "../../../store/AuthContext";
import CreateChannelButton from "./CreateChannelBtn";
import ChannelInvitations from "./ChannelInvitations";
import Fetch from "../../../interfaces/Fetch";

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
			if (AConversation === null || +AConversation !== +data)
			{
				setAConversation(data);
			}
		});
	});

	useEffect(() => {
		addListener("newPriv", (channelId: number) => {
			if (APrivChannel === null || +APrivChannel !== +channelId)
			{
				setAPrivChannel(channelId);
			}
		});
	});

	useEffect(() => {
		addListener("deleteChannel", (channelId) => {
			if (ADelChannel === null || +ADelChannel !== +channelId)
			{
				setADelChannel(channelId);
			}
		});
	});

	useEffect(() => {
		addListener('leavedChannel', (channelId: number) => {
			if (ALeavedChannel === null ||	ALeavedChannel !== channelId)
			{
				setALeavedChannel(channelId);
			}
		});
	});

	async function getAllConv(user: any) {
		if (user) {
			const response = await Fetch.fetch(user.token, "GET", `chatroom2`);
			const filteredConversations = response.filter((c: any) =>
				c.visibility === 'PUBLIC' || c.visibility === 'PWD_PROTECTED' ||
				(c.visibility === 'PRIVATE' &&
				c.participants.some((p: any) => +p.userId === +user.userId))
			);
			setConversations(filteredConversations);
		}
	};

	useEffect(() => {
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


