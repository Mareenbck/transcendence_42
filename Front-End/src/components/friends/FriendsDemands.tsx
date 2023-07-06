import React, { FormEvent, useContext, useEffect, useState } from "react";
import Demand from '../../interfaces/IFriendship'
import { Snackbar } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import MyAvatar from "../user/Avatar";
import { Popover } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { FriendContext } from "../../store/FriendshipContext";
import useSocket from "../../service/socket";
import NotificationDemands from "./NotificationDemands";
import AuthContext from "../../store/AuthContext";

const FriendsDemands = (props: any) => {
	const [sendMessage, addListener] = useSocket();
	const friendCtx = useContext(FriendContext);
	const authCtx = useContext(AuthContext);
	const [pendingDemands, setPendingDemands] = useState<Demand []>([]);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);

	const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	useEffect(() => {
		friendCtx.getDemands(authCtx.token, authCtx.userId);
	}, []);

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;

	const handleCloseSnackbar = () => {
		setSnackbarOpen(false);
	}

	const handleUpdate = async (event: FormEvent, demandId: number, res: string) => {
		event.preventDefault();
		friendCtx.updateDemand(demandId, res, props.token)
		if (res === 'ACCEPTED') {
			setSnackbarOpen(true);
		}
		setPendingDemands(prevDemands => prevDemands.filter(demand => demand.id !== demandId));
	}

	useEffect(() => {
		setPendingDemands(friendCtx.demands.filter((demand: Demand) => demand.status === 'PENDING'));
	}, [friendCtx.demands]);

	useEffect(() => {
		addListener('pendingDemands', (pendingDemands: any[]) => {
			const receiverDemands = pendingDemands.filter(
				(demand: Demand) => demand.receiverId === parseInt(props.authCtx.userId)
			);
			setPendingDemands(receiverDemands.filter((demand: Demand) => demand.status === 'PENDING'));
		});
	}, [addListener]);

	return (
		<>
			<div className="notif-keyboard">
				<KeyboardArrowDownIcon onClick={handleClick} className="arrowdown-icon"/>
				<NotificationDemands />
			</div>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
			>
				<ul>
					{pendingDemands.map((demand: Demand) => (
						<li key={demand.id} className='friend'>
							<MyAvatar style='xs' authCtx={props.authCtx} id={demand.requester.id} avatar={demand.requester.avatar} ftAvatar={demand.requester.ftAvatar}></MyAvatar>
							<span className='demand-username'>{demand.requester.username}</span>
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
			</Popover>
		</>
	)
}

export default FriendsDemands;
