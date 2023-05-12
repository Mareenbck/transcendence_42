import React, { useContext, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Avatar, ListItem, Tooltip } from '@mui/material';
import { ListItemAvatar } from '@mui/material';
import { faBan, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Friend from '../interfaces/IFriendship';
import { UserChat } from '../../../interfaces/iChat';
import AuthContext from '../../store/AuthContext';

const styleChannel = `
	.border-perso .channel {
		height: 101px;
		border-bottom: 1px solid rgb(211, 211, 211);
		margin-left: -20px;
		margin-right: -20px;
	}
`;

const styleChat = `
	.border-perso .chat {
		height: 120px;
		border-bottom: 1px solid rgb(211, 211, 211);
		margin-left: -20px;
		margin-right: -20px;
	}
`;

const PersonnalInfoChat = (props: any) => {
	const authCtx = useContext(AuthContext);
	const [style, setStyle] = useState('');

	useEffect(() => {
		if (props.style === "channel") {
			setStyle("border-perso-channel");
		} else if (props.style === 'chat') {
			setStyle("border-perso-chat");
		}
	}, [props.style]);


	return (
		<div className={style}>
		{/* // <div className="border-perso-channel"> */}
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
