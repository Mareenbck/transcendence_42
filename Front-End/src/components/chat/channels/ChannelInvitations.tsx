import React, { FormEvent, useContext, useEffect, useState } from "react";
import { Snackbar } from '@mui/material';
import AuthContext from "../../../store/AuthContext";
import Avatar from '@mui/material/Avatar';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import PasswordIcon from '@mui/icons-material/Password';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import IconButton from "@mui/material/IconButton";
import CancelIcon from '@mui/icons-material/Cancel';
import useSocket from '../../../service/socket';

const ChannelInvitations = (props: any) => {
	const [invitations, setInvitations] = useState<any[]>([]);
	const authCtx = useContext(AuthContext);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [icon, setIcon] = useState<any>();
	const [sendMessage, addListener] = useSocket();

	useEffect(() => {
		getInvitations();
	}, [])

	const getInvitations = async () => {
		const response = await fetch(
			"http://" + window.location.hostname + ':3000'  + "/chatroom2/pending_invitations", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authCtx.token}`
			},
		})
		const data = await response.json();
		setInvitations(data.filter((invitation: any) => invitation.status === 'PENDING'));
	}

	useEffect(() => {
		addListener("invitedToChannel", () => {
			getInvitations();
		});
	});

	const updateDemand = async (invitId: number, res: string) => {
		try {
			const response = await fetch("http://" + window.location.hostname + ':3000'  + `/chatroom2/invit_update`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${authCtx.token}`,
				},
				body: JSON.stringify({ invitId: invitId, response: res }),
			});
			const data = await response.json();
			if (!response.ok) {
				return "error";
			}
			if (res === 'ACCEPTED') {
				sendMessage("acceptedChannelInvite", data);
			};
		} catch (error) {
			console.log("error", error);
		}
		getInvitations();
	}

	const handleCloseSnackbar = () => {
		setSnackbarOpen(false);
	}

	const handleUpdate = async (event: FormEvent, demandId: number, res: string) => {
		event.preventDefault();
		updateDemand(demandId, res)
		if (res === 'ACCEPTED') {
			setSnackbarOpen(true);
		}
	}

	useEffect(() => {
		if (props.visibility === 'PUBLIC') {
			setIcon(<PublicIcon />);
		} else if (props.visibility === 'PWD_PROTECTED') {
			setIcon(<PasswordIcon />);
		} else {
			setIcon(<LockIcon />);
		}
	}, [props.visibility])

	return (
		<>
		{invitations.map((invit: any) => (
			<div key={invit.id} >
				<div className="invitations-inlist">
					<div className="invitation-name">
						<Avatar variant="rounded" >
							{icon}
						</Avatar>
						<div className="conversationName">{invit.chatroom.name}</div>
					</div>
					<div className="accept-icon">
						<IconButton onClick={(event: FormEvent) => { handleUpdate(event, invit.id, 'ACCEPTED') }} className='accept'>
							<CheckCircleIcon />
						</IconButton>
					</div>
					<Snackbar
						anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
						open={snackbarOpen}
						autoHideDuration={1000}
						onClose={handleCloseSnackbar}
						message="Invitation Accepted"
						/>
					<div className="rejected-icon">
						<IconButton onClick={(event: FormEvent) => { handleUpdate(event, invit.id, 'REJECTED') }} className='deny'>
							<CancelIcon />
						</IconButton>
					</div>
				</div>
			</div>
		))}
		</>
	)
}

export default ChannelInvitations;
