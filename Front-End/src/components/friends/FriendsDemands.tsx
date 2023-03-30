import React, { FormEvent, useContext, useState } from "react";
import Demand from '../../interfaces/IFriendship'
import { Snackbar } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import MyAvatar from "../user/Avatar";

const FriendsDemands = (props: any) => {
	const friendCtx = props.friendCtx;
	const prendingDemands = friendCtx.demands.filter((demand: Demand) => demand.status === 'PENDING');
	const [snackbarOpen, setSnackbarOpen] = useState(false);

	const handleCloseSnackbar = () => {
		setSnackbarOpen(false);
	}

	const handleUpdate = async (event: FormEvent, demandId: number, res: string) => {
		event.preventDefault();
		friendCtx.updateDemand(demandId, res, props.token)
		if (res === 'ACCEPTED') {
			setSnackbarOpen(true);
		}
	}

	return (
		<>
		<ul>
			{prendingDemands.map((demand: Demand) => (
				<li key={demand.id} className='friend'>
					<MyAvatar style='xs' authCtx={props.authCtx} id={demand.requester.id} avatar={demand.requester.avatar} ftAvatar={demand.requester.ftAvatar}></MyAvatar>
					<span className='friend-username'>{demand.requester.username}</span>
						<div onClick={(event: FormEvent) => { handleUpdate(event, demand.id, 'ACCEPTED') }} className='accept'>
							<CheckCircleOutlineIcon />
						</div>
						<Snackbar
							anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
							open={snackbarOpen}
							autoHideDuration={1000}
							onClose={handleCloseSnackbar}
							message="New Friend Accepted"
						/>
						<div onClick={(event: FormEvent) => { handleUpdate(event, demand.id, 'REFUSED') }} className='deny'>
							<HighlightOffIcon />
						</div>
				</li>
			))}
		</ul>
		</>
	)
}

export default FriendsDemands;
