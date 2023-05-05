import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import { Avatar, ListItem, Tooltip } from '@mui/material';
import { ListItemAvatar } from '@mui/material';
import { faBan, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Friend from '../interfaces/IFriendship';
import { UserChat } from '../../../interfaces/iChat';
import AuthContext from '../../store/AuthContext';

const PersonnalInfoChat = (props: any) => {
	const authCtx = useContext(AuthContext);


	return (
		<div className='border-perso'>

		<div className='persoInfo'>
				<Avatar variant="rounded" className="avat-perso"  src={authCtx.ftAvatar ? authCtx.ftAvatar : authCtx.avatar} />
			<div className='avatName'>
				<h3>{authCtx.username}</h3>
				<p>{authCtx.email}</p>
			</div>
			<Link to="/menu" className="outChat">
				<FontAwesomeIcon icon={faArrowRightFromBracket} />
			</Link>
		</div>
		</div>
	);
}

export default PersonnalInfoChat;
