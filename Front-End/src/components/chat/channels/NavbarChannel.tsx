import React from "react";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../store/AuthContext";
import SelectDialog from "../../utils/SelectDialog";
import ChannelsSettings from "./ChannelsSettings";
import { Modal } from "@mui/material";
import { Box } from "@mui/material";

export function NavbarChannel(props: any) {
	const userContext = useContext(AuthContext);
	const [isAdmin, setIsAdmin] = useState<string | null>('');
	const [selectedUser, setSelectedUser] = useState<string | null>('');
	const [openModal, setOpenModal] = useState(false);

	// console.log("props--->")
	// console.log(props)
	useEffect(() => {
		const currentUser = props.chatroom.participants.find((participant: any) => participant.userId === userContext.userId);
		if (currentUser) {
			setIsAdmin(currentUser.role);
		}
	}, [props.chatroom.participants, userContext.userId]);

	const inviteUserOnChannel = async (channelId: number, invitedId: number) => {
		try {
			const resp = await fetch(`http://localhost:3000/chatroom2/invite_channel`, {
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

	const addAdminToChannel = async (channelId: number, userId: number) => {
		try {
			const response = await fetch(`http://localhost:3000/chatroom2/${channelId}/admin/${userId}`, {
			  method: 'POST',
			  headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userContext.token}`,
			  },
			});
			const data = await response.json();
			return data;
		} catch(err) {
			console.log(err);
		}
	  }
	  

	const handleInviteUser = (invitedUserId: string) => {
		inviteUserOnChannel(props.chatroom.id, parseInt(invitedUserId));
	}

	const handleAddAdmin = (invitedUserId: string) => {
		addAdminToChannel(props.chatroom.id, parseInt(invitedUserId));
	}
	const handleOpenModal = () => {
		setOpenModal(true);
	};


	return (
		<>
			{isAdmin === 'ADMIN' &&
				<div className="visibility-icon">
					<SelectDialog onSelect={(userId: string) => setSelectedUser(userId)} onInvite={handleInviteUser} channelId={props.chatroom.id}/>
					{/* <SelectDialog onSelect={(userId: string) => setSelectedUser(userId)} onInvite={handleInviteUser} /> */}
					<ChannelsSettings role={isAdmin} onOpenModal={handleOpenModal} />
				</div>
			}
				<>
			<Modal className="modal-container" open={openModal} onClose={() => setOpenModal(false)}>
				<Box className="modal-content">
					<h2>Welcome to {props.chatroom.name} settings</h2>
					<div>Do you want to change the password ?</div>
				</Box>
			</Modal>
			</>
		</>
	);
}

export default NavbarChannel;
