import React, { FormEvent, useContext, useEffect, useState } from "react";
import Demand from '../../interfaces/IFriendship'
import { Snackbar } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Popover } from '@mui/material';
import BadgeUnstyled from '@mui/base/BadgeUnstyled';
import Face2Icon from '@mui/icons-material/Face2';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { FriendContext } from "../../store/FriendshipContext";
import MyAvatar from "../../user/Avatar";
import AuthContext from "../../../store/AuthContext";

const AccessChannelDemands = (props: any) => {
	const [demands, setDemands] = useState<any>([]);
	const authCtx = useContext(AuthContext);
	const prendingDemands = demands.filter((demand: Demand) => demand.status === 'PENDING');
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [badgeCount, setBadgeCount] = useState(0);

	useEffect(() => {
		getDemands();
	}, [])

	const getDemands = async () => {
		const response = await fetch(
			"http://localhost:3000/chatroom2/pending_demand", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authCtx.token}`
				},
			}
		)
		const data = await response.json();
		const updatedDemands = await Promise.all(data.map(async (demand: any) => {
			const avatar = await fetchAvatar(demand.userId);
			if (!avatar) {
				return demand;
			}
			return { ...demand, user: {...demand.user, avatar }};
		}));
		setDemands(updatedDemands);
	}


	const fetchAvatar = async (userId: number) => {
		try {
			const response = await fetch(`http://localhost:3000/friendship/${userId}/avatar`, {
				method: 'GET',
			});
			if (response.ok) {
				if (response.status === 204) {
					return null
				}
				const blob = await response.blob();
				return URL.createObjectURL(blob);
			}
		} catch (error) {
			return console.log("error", error);
		}
	}


	const updateDemand = async (demandId: number, res: string, token: string) => {
		try {
			const response = await fetch(`http://localhost:3000/friendship/update`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
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


	const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;

	const handleCloseSnackbar = () => {
		setSnackbarOpen(false);
	}

	const handleUpdate = async (event: FormEvent, demandId: number, res: string) => {
		event.preventDefault();
		updateDemand(demandId, res, props.token)
		if (res === 'ACCEPTED') {
			setSnackbarOpen(true);
		}
	}

	useEffect(() => {
	  setBadgeCount(prendingDemands.length)
	}, [prendingDemands.length])


	return (
		<>
			<BadgeUnstyled className="badge-unstyled">
				<KeyboardArrowDownIcon onClick={handleClick} fontSize="80px"/>
				{badgeCount > 0 && (
					<span className="badge-notification">{badgeCount}</span>
				)}
			</BadgeUnstyled>
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
					{prendingDemands.map((demand: Demand) => (
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

export default AccessChannelDemands;
