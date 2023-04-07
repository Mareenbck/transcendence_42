import { Button } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import '../../style/Settings.css';
import Avatar from '@mui/material/Avatar';
import { FriendContext } from '../../store/FriendshipContext';
import AuthContext from '../../store/AuthContext';

const customStylesL = `
	.custom-avatar.avatar-l {
		width: 80px;
		height: 80px;
		border: 2.97px solid #FFFFFF;
		filter: drop-shadow(4.97px 3.97px 0px #000000);
		margin-right: 25px;
	}
`;

const customStylesM = `
	.custom-avatar.avatar-m {
		width: 65px;
		height: 65px;
		border: 2.97px solid #FFFFFF;
		filter: drop-shadow(4.97px 3.97px 0px #000000);
		margin-right: 25px;
	}
`;

const customStyleS = `
	.custom-avatar.avatar-s {
		width: 40px;
		height: 40px;
		border: 2.97px solid #FFFFFF;
		filter: drop-shadow(4.97px 3.97px 0px #000000);
		margin-right: 25px;
	}
`;

const customStyleXS = `
	.custom-avatar.avatar-xs {
		width: 30px;
		height: 30px;
		border: 1px solid #FFFFFF;
		filter: drop-shadow(3px 2px 0px #000000);
		margin-right: 10px;
	}
`;

const MyAvatar = (props: any) => {
	const authCtx = useContext(AuthContext)
	const isMyProfile = parseInt(authCtx.userId) === parseInt(props.id);
	const friendCtx = useContext(FriendContext)
	const [style, setStyle] = useState('');
	const [content, setContent] = useState<any>(null);
	const [avatar, setAvatar] = useState<any>(null);

	useEffect(() => {
		// if(!isMyProfile) {
			const fetchData = async () => {
				const avat: any = await friendCtx.fetchAvatar(props.id);
				if (avat) {
					setAvatar(avat);
				}
			};
			fetchData();
		// }
	}, [props.id, isMyProfile])

	useEffect(() => {
		if (props.style === "m") {
			setStyle(customStylesM);
		} else if (props.style === 'xs') {
			setStyle(customStyleXS);
		} else if (props.style === 's') {
			setStyle(customStyleS);
		} else if (props.style === 'l') {
			setStyle(customStylesL);
		}
	}, [props.style]);

	useEffect(() => {
		const avatarClass = `custom-avatar avatar-${props.style}`;
		if (authCtx.userId === props.id) {
			setContent(authCtx.avatar ? <Avatar className={avatarClass} src={authCtx.avatar} /> : <Avatar className={avatarClass} src={authCtx.ftAvatar} />)
		} else {
			setContent(avatar ? <Avatar className={avatarClass} src={avatar} /> : <Avatar className={avatarClass} src={props.ftAvatar} />)
		}
	}, [authCtx.avatar, avatar]);

	return (
		<>
			<style>{style}</style>
			{content}
		</>
	)
}


export default MyAvatar;
