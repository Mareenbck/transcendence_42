import React from "react";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../store/AuthContext";
import SelectDialog from "../../utils/SelectDialog";
import AccessChannelDemands from "./AccessChannelDemands";

export function NavbarChannel(props: any) {

	const userContext = useContext(AuthContext);
	const [isAdmin, setIsAdmin] = useState<string | null>('');
	const [demandList, setDemandList] = useState<any>();
	const [selectedUser, setSelectedUser] = useState<string | null>('');

	useEffect(() => {
		const currentUser = props.chatroom.participants.find((participant: any) => participant.userId === userContext.userId);
		if (currentUser) {
			setIsAdmin(currentUser.role);
		}
	}, [props.chatroom.participants, userContext.userId]);

	const inviteUserOnChannel = async (channelId: number, invitedId: number) => {
		console.log("rentre dans fetch ")
		console.log(channelId);
		console.log(invitedId);
		try {
			const resp = await fetch(`http://localhost:3000/chatroom2/ask_join`, {
				method: "POST",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${userContext.token}`,
				},
				body: JSON.stringify({ channelId: channelId, invitedId: invitedId }),
			});
			if (!resp.ok) {
				const message = `An error has occured: ${resp.status} - ${resp.statusText}`;
				throw new Error(message);
			}
			const data = await resp.json();
		} catch (err) {
			console.log(err)
		}
	}

	const handleInviteUser = () => {
		console.log("handle Invite User")
		console.log(selectedUser)
		if (selectedUser !== null) {
			inviteUserOnChannel(props.channelId, parseInt(selectedUser));
		}
	}

	return (
		<>
			{isAdmin === 'ADMIN' &&
				<div className="visibility-icon">
					<SelectDialog onSelect={(userId: string) => setSelectedUser(userId)} onInvite={handleInviteUser} />
				</div>
			}
		</>
	);
}

export default NavbarChannel;
