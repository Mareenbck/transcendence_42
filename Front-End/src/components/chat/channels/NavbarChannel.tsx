import React, { FormEvent, useRef } from "react";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../store/AuthContext";
import SelectDialog from "../../utils/SelectDialog";
import ChannelsSettings from "./ChannelsSettings";
import { Modal, TextField, Tooltip } from "@mui/material";
import { Box } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import PasswordIcon from '@mui/icons-material/Password';
import Avatar from '@mui/material/Avatar';
import '../../../style/NavbarChannel.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { isAnyArrayBuffer } from "util/types";
import { faCrown, faUserPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import useSocket from '../../../service/socket';


export function NavbarChannel(props: any) {
	const userContext = useContext(AuthContext);
	const [isAdmin, setIsAdmin] = useState<string | null>('');
	const [selectedUser, setSelectedUser] = useState<string | null>('');
	const [openModal, setOpenModal] = useState(false);
	const passwordInputRef = useRef<HTMLInputElement>(null);
	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = (e: FormEvent) => setShowPassword(!showPassword);
	const [sendMessage, addListener] = useSocket()


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
			sendMessage("inviteToPriv", {channelId: channelId, invitedId: invitedId});
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
			sendMessage('toMute', {channelId: channelId})
			return data;
		} catch(err) {
			console.log(err);
		}
	  }

	const leaveChannel = async (channelId: number) => {
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
			sendMessage("leaveChannel", {channelId: channelId});
			sendMessage("showUsersList", data);
			sendMessage('toMute', {channelId: channelId})
			props.onLeaveChannel();
			return data;
		} catch(err) {
			console.log(err);
		}
	}

	const deleteChannel = async (channelId: string) => {
        try {
            const response = await fetch(`http://localhost:3000/chatroom2/${channelId}/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({channelId: props.channelId}),
            });
            const data = await response.json();
            props.onDeleteChannel();
			sendMessage("removeConv", {channelId: channelId})
			sendMessage("showUsersList", data)
            return data;

        } catch(error) {
            console.log("error", error)
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
			// console.log('Password changed:', data);
		} catch (err) {
			console.log(err);
		}
	};

	const changeAndClose = async (e:FormEvent) => {
		try {
			await changePassword(e);
			setOpenModal(false);
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

	const handleDeleteChannel = () => {
		deleteChannel(props.chatroom.id)
			// sendMessage("removeConv")
	}

	return (
		<div className="navbar-channel">
			<Avatar variant="rounded" className="channel-avatar-navbar" >
				{icon}
			</Avatar>
			<div className="name-channel">
				<h4>{props.chatroom.name}</h4>
				<p>{props.chatroom.participants.length} members</p>
			</div>

			{isAdmin === 'ADMIN' || isAdmin === 'OWNER' &&
				<div className="btn-admin-channel">
					<SelectDialog
						onSelect={(userId: string) => setSelectedUser(userId)}
						onInvite={handleInviteUser}
						onAddAdmin={handleAddAdmin}
						channelId={props.chatroom.id}
						type="invite-admin"
					/>
					<FontAwesomeIcon className="btn-dialog-navbar" icon={faTrash} onClick={handleDeleteChannel} role={isAdmin}/>
					{props.chatroom.visibility === 'PRIVATE' &&
						<SelectDialog
						onSelect={(userId: string) => setSelectedUser(userId)}
						onInvite={handleInviteUser}
						onAddAdmin={handleAddAdmin}
						channelId={props.chatroom.id}
						type="invite-user"
						/>
					}
					{props.chatroom.visibility === 'PWD_PROTECTED' &&
						<ChannelsSettings
							role={isAdmin}
							onOpenModal={handleOpenModal}
							onDeleteChannel={handleDeleteChannel} />
					}
				</div>
			}
			{isAdmin === 'USER' &&
				<FontAwesomeIcon onClick={() => leaveChannel(props.chatroom.id)} icon={faArrowRightFromBracket} className="btn-dialog-navbar-leave"/>
			}
			 {/* <Button onClick={() => leaveChannel(props.chatroom.id)}>Leave Channel</Button> */}
				<>
			<Modal className="modal-container" open={openModal} onClose={() => setOpenModal(false)}>
				<Box className="modal-content-password">
					<h2>{props.chatroom.name} settings</h2>
					<div>Chose a new password</div>
					<TextField
						id="password"
						className="custom-field"
						label="password"
						type={showPassword ? 'text' : 'password'}
						variant="filled"
						placeholder="Type a new password..."
						inputRef={passwordInputRef}
					/>
					 <div className="button-popup-global">
						<VisibilityIcon className="pwd-icon" onClick={(e:FormEvent) => handleClickShowPassword(e)} />
						<button className="button-popup" type='submit' onSubmit={handleFormSubmit} onClick={changeAndClose}>OK</button>
						<button className="button-popup" onClick={() => setOpenModal(false)}>Cancel</button>
					 </div>
				</Box>
			</Modal>
			</>
		</div>
	);
}
export default NavbarChannel;
