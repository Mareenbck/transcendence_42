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


export default function MyAccountMenu(props: any) {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
	<React.Fragment>
		{/* <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}> */}
		<Tooltip title="Account settings">
			<IconButton
			onClick={handleClick}
			size="small"
			sx={{ ml: 2 }}
			aria-controls={open ? 'account-menu' : undefined}
			aria-haspopup="true"
			aria-expanded={open ? 'true' : undefined}
			>
			<MyAvatar style='m' authCtx={props.authCtx} id={props.authCtx.userId}/>
			</IconButton>
			</Tooltip>
      {/* </Box> */}
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
			<MyAvatar authCtx={props.authCtx} id={props.authCtx.userId} sx={{ width: 34, height: 34 }}/>
			<Link to={`/users/profile/${props.authCtx.userId}`}>Profile</Link>
		</MenuItem>
		{/* <MenuItem onClick={handleClose}>
			<Avatar /> My Friends
		</MenuItem> */}
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
		<MenuItem onClick={props.authCtx.logout}>
			<ListItemIcon>
				<Logout fontSize="small"/>
			</ListItemIcon>
			Logout
		</MenuItem>
		</Menu>
	</React.Fragment>
	);
}
