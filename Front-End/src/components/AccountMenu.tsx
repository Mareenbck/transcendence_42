import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import MyAvatar from './user/Avatar';
import { Link } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import AuthContext from '../store/AuthContext';
import NotificationDemands from './friends/NotificationDemands';
import useSocket from '../service/socket';
import { GameStatus } from './game/interface_game';

export default function MyAccountMenu(props: any) {
	const [sendMessage, addListener] = useSocket();
	const authCtx = React.useContext(AuthContext);
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	React.useEffect(() => {
		if (authCtx.avatar) {
			authCtx.fetchAvatar(authCtx.userId);
		}
	}, [])

	const handleLogout = async () => {
		await sendMessage("exitGame", { user: authCtx.userId, status: GameStatus.GAME } as any);
		authCtx.logout();
		sendMessage("logout", authCtx.userId as any);
	};

	return (
	<React.Fragment>
		<Tooltip title="Account settings">
			<IconButton
				onClick={handleClick}
				size="small"
				sx={{ ml: 2 }}
				aria-controls={open ? 'account-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				>
			<div className='notif-sidebar'>
				<NotificationDemands />
				<MyAvatar style='m' avatar={authCtx.avatar} authCtx={authCtx} id={authCtx.userId}/>
			</div>
			</IconButton>
		</Tooltip>
		<Menu
			anchorEl={anchorEl}
			id="account-menu"
			open={open}
			onClose={handleClose}
			onClick={handleClose}
			PaperProps={{
				elevation: 0,
				sx: {
				overflow: 'visible',
				filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
				mt: 1.5,
				'& .MuiAvatar-root': {
					width: 32,
					height: 32,
					ml: -0.5,
					mr: 1,
				},
				'&:before': {
					content: '""',
					display: 'block',
					position: 'absolute',
					top: 0,
					right: 14,
					width: 10,
					height: 10,
					bgcolor: 'background.paper',
					transform: 'translateY(-50%) rotate(45deg)',
					zIndex: 0,
				},
				},
			}}
			transformOrigin={{ horizontal: 'right', vertical: 'top' }}
			anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
		<MenuItem>
			<MyAvatar authCtx={authCtx} id={authCtx.userId} sx={{ width: 34, height: 34 }}/>
			<Link to={`/users/profile/${authCtx.userId}`}>Profile</Link>
		</MenuItem>
		<Divider />
		<MenuItem>
			<ListItemIcon>
				<Settings fontSize="small" />
			</ListItemIcon>
			<Link to={`/settings`}>Settings</Link>
		</MenuItem>
		<MenuItem>
			<ListItemIcon>
				<HomeIcon color="action" />
			</ListItemIcon>
			<Link to={`/menu`}>Home</Link>
		</MenuItem>
		<MenuItem onClick={handleLogout}>
			<ListItemIcon>
				<Logout fontSize="small"/>
			</ListItemIcon>
			Logout
		</MenuItem>
		</Menu>
	</React.Fragment>
	);
}
