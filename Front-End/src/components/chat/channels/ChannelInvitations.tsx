import React, { FormEvent, useContext, useEffect, useState } from "react";
import { Snackbar } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AuthContext from "../../../store/AuthContext";

const ChannelInvitations = (props: any) => {
	const [invitations, setInvitations] = useState<any[]>([]);
	const authCtx = useContext(AuthContext);
	const pendingInvitations = invitations.filter((invitation: any) => invitation.status === 'PENDING');
	const [snackbarOpen, setSnackbarOpen] = useState(false);

	console.log("invitations--->")
	console.log(invitations)
	console.log("pendingInvitations--->")
	console.log(pendingInvitations)

	useEffect(() => {
		getInvitations();
	}, [])

	const getInvitations = async () => {
		const response = await fetch(
			"http://localhost:3000/chatroom2/pending_invitations", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authCtx.token}`
			},
		}
		)
		const data = await response.json();
		// const updatedDemands = await Promise.all(data.map(async (demand: any) => {
		// 	const avatar = await fetchAvatar(demand.userId);
		// 	if (!avatar) {
		// 		return demand;
		// 	}
		// 	return { ...demand, user: {...demand.user, avatar }};
		// }));
		setInvitations(data);
	}


	// const fetchAvatar = async (userId: number) => {
	// 	try {
	// 		const response = await fetch(`http://localhost:3000/friendship/${userId}/avatar`, {
	// 			method: 'GET',
	// 		});
	// 		if (response.ok) {
	// 			if (response.status === 204) {
	// 				return null
	// 			}
	// 			const blob = await response.blob();
	// 			return URL.createObjectURL(blob);
	// 		}
	// 	} catch (error) {
	// 		return console.log("error", error);
	// 	}
	// }


	const updateDemand = async (demandId: number, res: string) => {
		try {
			const response = await fetch(`http://localhost:3000/friendship/update`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${authCtx.token}`,
				},
				body: JSON.stringify({ demandId: demandId, response: res }),
			});
			await response.json();
			if (!response.ok) {
				console.log("POST error on /friendship/validate");
				return "error";
			}
		} catch (error) {
			console.log("error", error);
		}
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

	return (
		<>
			<ul>
				{pendingInvitations.map((invit: any) => (
					<li key={invit.id} className='friend'>
						<span className='demand-username'>{invit.chatroom.name}</span>
						<div onClick={(event: FormEvent) => { handleUpdate(event, invit.id, 'ACCEPTED') }} className='accept'>
							<CheckCircleOutlineIcon />
						</div>
						<Snackbar
							anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
							open={snackbarOpen}
							autoHideDuration={1000}
							onClose={handleCloseSnackbar}
							message="Invitation Accepted"
						/>
						<div onClick={(event: FormEvent) => { handleUpdate(event, invit.id, 'REFUSED') }} className='deny'>
							<HighlightOffIcon />
						</div>
					</li>
				))}
			</ul>
		</>
	)
}

export default ChannelInvitations;
