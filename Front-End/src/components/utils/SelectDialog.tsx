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

export default function DialogSelect(props: { onSelect: (userId: string) => void, onInvite: (userId: string) => void }) {
	const [open, setOpen] = React.useState(false);
	const [friends, setFriends] = React.useState<any[]>([]);
	const authCtx = React.useContext(AuthContext);
	const friendCtx = React.useContext(FriendContext);
	const [invitedUser, setInvitedUser] = React.useState<string | null>(''); // Ajouter une variable d'état pour stocker l'ID de l'utilisateur sélectionné

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
			console.log("invitedUser--->")
			console.log(invitedUser)
			props.onSelect(invitedUser); // Appeler props.onSelect avec l'ID de l'utilisateur sélectionné
			props.onInvite(invitedUser);
		}
		handleClose(event, '');
	};

	React.useEffect(() => {
		const url = "http://localhost:3000/users/";
		const fetchUsers = async () => {
			const response = await fetch(
				url,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${authCtx.token}`
					}
				}
			)
			const data = await response.json();
			const updatedFriends = await Promise.all(data.map(async (friend: Friend) => {
				const avatar = await friendCtx.fetchAvatar(friend.id);
				return { ...friend, avatar };
			}));
			setFriends(updatedFriends);
		}
		fetchUsers();
	}, [])

	return (
		<div>
			<Button onClick={handleClickOpen}>Invite Users</Button>
			<Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
				<DialogTitle>Invite :</DialogTitle>
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
								{friends.map((friend) => (
									<option key={friend.id} value={friend.id}>
										{friend.username}
									</option>))}
							</Select>
						</FormControl>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={handleInvite}>Ok</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
