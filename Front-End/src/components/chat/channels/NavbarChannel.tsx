import React, { FormEvent, useRef } from "react";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../store/AuthContext";
import SelectDialog from "../../utils/SelectDialog";
import ChannelsSettings from "./ChannelsSettings";
import { Modal, TextField } from "@mui/material";
import { Box } from "@mui/material";
import { Button } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import PasswordIcon from '@mui/icons-material/Password';
import Avatar from '@mui/material/Avatar';
import '../../../style/NavbarChannel.css';


export function NavbarChannel(props: any) {
	const userContext = useContext(AuthContext);
	const [isAdmin, setIsAdmin] = useState<string | null>('');
	const [selectedUser, setSelectedUser] = useState<string | null>('');
	const [openModal, setOpenModal] = useState(false);
	const passwordInputRef = useRef<HTMLInputElement>(null);


    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = (e: FormEvent) => setShowPassword(!showPassword);
	const [showPopUp, setShowPopUp] = useState(true);



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
			// console.log("DATA IN FETCH", data)
			return data;
		} catch(err) {
			console.log(err);
		}
	  }

	const leaveChannel = async (channelId: number) => {
		console.log("channelId--->")
		console.log(channelId)
		try {
			const response = await fetch(`http://localhost:3000/chatroom2/leave_channel`, {
			  method: 'POST',
			  headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userContext.token}`,
			  },
			  body: JSON.stringify({ channelId: channelId }),
			});
			const data = await response.json();
			// console.log("DATA IN FETCH", data)
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

	const changePassword = async (e: FormEvent) => {
		e.preventDefault();
		const newPassword = passwordInputRef.current?.value;
		try {
			const response = await fetch(`http://localhost:3000/chatroom2/${props.chatroom.id}/newpassword`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${userContext.token}`,
				},
				body: JSON.stringify({ password: newPassword }),
			});
			if (!response.ok) {
				const message = `An error has occured: ${response.status} - ${response.statusText}`;
				throw new Error(message);
			}
			const data = await response.json();
			console.log('Password changed:', data);
		} catch (err) {
			console.log(err);
		}
	};


	const changeAndClose = async (e:FormEvent) => {
		try {
			await changePassword(e);
			setOpenModal(false);
			// props.onCLick();
		} catch (err) { console.log(err);}
	}

	const handleFormSubmit = (e:FormEvent) => {
        e.preventDefault();
        setOpenModal(false);
    };
	const [icon, setIcon] = useState<any>();
	useEffect(() => {
		if (props.chatroom.visibility === 'PUBLIC') {
			setIcon(<PublicIcon />);
		} else if (props.chatroom.visibility === 'PWD_PROTECTED') {
			setIcon(<PasswordIcon />);
		} else {
			setIcon(<LockIcon />);
		}
	}, [props.chatroom.visibility])

	return (
		<div className="navbar-channel">
			<Avatar variant="rounded" className="channel-avatar-navbar" >
				{icon}
			</Avatar>
			<h4>{props.chatroom.name}</h4>
			{isAdmin === 'ADMIN' &&
				<div className="visibility-icon">
					<SelectDialog
						onSelect={(userId: string) => setSelectedUser(userId)}
						onInvite={handleInviteUser}
						onAddAdmin={handleAddAdmin}
						type="invite-admin"
						/>
					{props.chatroom.visibility === 'PRIVATE' &&
						<SelectDialog
						onSelect={(userId: string) => setSelectedUser(userId)}
						onInvite={handleInviteUser}
						onAddAdmin={handleAddAdmin}
						type="invite-user"
						/>
					}
					{props.chatroom.visibility === 'PWD_PROTECTED' &&
						<ChannelsSettings role={isAdmin} onOpenModal={handleOpenModal} />
					}
				</div>
			}
			 <Button onClick={() => leaveChannel(props.chatroom.id)}>Leave Channel</Button>
				<>
			<Modal className="modal-container" open={openModal} onClose={() => setOpenModal(false)}>
				<Box className="modal-content">
					<h2>Welcome to {props.chatroom.name} settings</h2>
					<div>Do you want to change the password ?</div>
					<TextField
						id="password"
						className="custom-field"
						label="password"
						type={showPassword ? 'text' : 'password'}
						variant="filled"
						placeholder="Type a new password..."
						inputRef={passwordInputRef}
					/>
					 <VisibilityIcon className="pwd-icon" onClick={(e:FormEvent) => handleClickShowPassword(e)} />
					<button type='submit' onSubmit={handleFormSubmit} onClick={changeAndClose}>OK</button>
					<button onClick={() => setOpenModal(false)}>Cancel</button>
				</Box>
			</Modal>
			</>
		</div>
	);
}
export default NavbarChannel;
