import React, { FormEvent, useContext, useEffect, useRef, useState } from "react";
import "../../../style/ChannelVisibility.css"
import Settings from '@mui/icons-material/Settings';
import KeyIcon from '@mui/icons-material/Key';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import { Modal } from "@mui/material";
import { Box } from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';
import ConversationReq from "./ConversationRequest";
import AuthContext from "../../../store/AuthContext";
import ChannelsSettings from "./ChannelsSettings";
import JoinProtectedChannel from "./JoinProtectedChannel";
import AccessChannelDemands from "./AccessChannelDemands";

export function PrivateChannel(props: any) {

	const userContext = useContext(AuthContext);
	const [isAdmin, setIsAdmin] = useState<string | null>('');
	const [demandList, setDemandList] = useState<any>();
	console.log("props.role dans PrivateChannel")
	console.log(props.role)

	useEffect(() => {
		setIsAdmin(props.role);
		if (isAdmin === "ADMIN") {
			setDemandList(<AccessChannelDemands />)
		}
	}, [])

	const askToJoinChannel = async (e: FormEvent, channelId: number) => {
		e.preventDefault();
		try {
			const resp = await fetch(`http://localhost:3000/chatroom2/ask_join`, {
				method: "POST",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${userContext.token}`,
				},
				body: JSON.stringify({channelId: channelId}),
			});
			if (!resp.ok) {
				const message = `An error has occured: ${resp.status} - ${resp.statusText}`;
				throw new Error(message);
			}
			const data = await resp.json();
		} catch(err) {
			console.log(err)
		}
	}


	return (
		<>
		<div className="visibility-icon">
			{/* <AddBoxIcon onClick={(e: FormEvent) => askToJoinChannel(e, props.id)} className="join-channel" fontSize="small" /> */}
			<LockIcon className="channel-icon" fontSize="small" />
			{/* {demandList} */}
		</div>
		</>
	);
}

export default PrivateChannel;
