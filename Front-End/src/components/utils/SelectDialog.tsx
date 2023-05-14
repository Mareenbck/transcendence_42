import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import AuthContext from "../../store/AuthContext";
import { FriendContext } from "../../store/FriendshipContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import Tooltip from '@mui/material/Tooltip';
import Fetch from "../../interfaces/Fetch"
import Friend from "../../interfaces/IFriendship"
import useSocket from '../../service/socket';


export default function DialogSelect(props: { channelId:number, onSelect: (userId: string) => void, onInvite: (userId: string) => void, onAddAdmin: (userId: string) => void, type: string}) {
	const [open, setOpen] = React.useState(false);
	const [friends, setFriends] = React.useState<any[]>([]);
	const authCtx = React.useContext(AuthContext);
	const friendCtx = React.useContext(FriendContext);
	const [invitedUser, setInvitedUser] = React.useState<string | null>(''); // Ajouter une variable d'état pour stocker l'ID de l'utilisateur sélectionné
	const [button, setButton] = React.useState<any>()
	const [sendMessage, addListener] = useSocket()

	const handleChange = (event: SelectChangeEvent) => {
		setInvitedUser(event.target.value ? event.target.value : ''); // Mettre à jour l'ID de l'utilisateur sélectionné
	};

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = (event: React.SyntheticEvent<unknown>, reason?: string) => {
		if (reason !== 'backdropClick') {
			setOpen(false);
		}
	};

	const handleInvite = (event: React.SyntheticEvent<unknown>) => {
		if (invitedUser) {
			props.onSelect(invitedUser);
			props.onInvite(invitedUser);
		}
		handleClose(event, '');
	};

	const handleInviteAdmin = (event: React.SyntheticEvent<unknown>) => {
		if (invitedUser) {
			props.onAddAdmin(invitedUser);
		}
		handleClose(event, '');
	}

	const fetchUsers = async () => {
		if (props.type === "invite-admin")
		{
			const data = await Fetch.fetch(authCtx.token, "GET", `chatroom2`, props.channelId, 'participants');
			setFriends(data.filter((u: any)=> +u.userId !== +authCtx.userId));
		}
		else
		{
			const data = await Fetch.fetch(authCtx.token, "GET", `users/`);
			const updatedFriends = await Promise.all(data.map(async (friend: Friend) => {
				const avatar = await friendCtx.fetchAvatar(friend.id);
				return { ...friend, avatar };
			}));
			setFriends(updatedFriends.filter(u => +u.id !== +authCtx.userId));
		}
	}

	React.useEffect(() => {
		fetchUsers();
	}, [props.channelId, props.type])

	React.useEffect(() => {
		addListener("changeParticipants", () => {
			fetchUsers();
		});
	});

	React.useEffect (() => {
		if (props.type === 'invite-user') {
			setButton(<Tooltip title="Invite User">
						<FontAwesomeIcon icon={faUserPlus} onClick={handleClickOpen} className="btn-dialog-navbar"/></Tooltip>)
		} else {
			setButton(<Tooltip title="Add Admin">
						<FontAwesomeIcon icon={faCrown} onClick={handleClickOpen} className="btn-dialog-navbar"/></Tooltip>)
		}
	}, [props.type])

	return (
		<div>
			{button}
			<Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
				<DialogTitle>{props.type === "invite-user" ? "Invite User" : "Add Admin"}</DialogTitle>
				<DialogContent>
					<Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
						<FormControl sx={{ m: 1, minWidth: 120 }}>
							<InputLabel htmlFor="demo-dialog-native">Users</InputLabel>
							<Select
								native
								value={invitedUser !== null ? invitedUser : ''}
								onChange={handleChange}
							>
								<option aria-label="None" value="" />
								{friends?.map((friend: any) => (
									props.type === "invite-user" ?
										<option key={friend.id} value={friend.id}> {friend.username} </option>
									:
										<option key={friend.userId} value={friend.userId}> {friend.user.username} </option>
								))}
							</Select>
						</FormControl>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={props.type === "invite-user" ? handleInvite : handleInviteAdmin}>Ok</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
