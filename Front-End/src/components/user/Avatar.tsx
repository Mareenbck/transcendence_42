import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import '../../style/Settings.css';
import Avatar from '@mui/material/Avatar';

const customStylesSidebar = `
	.custom-avatar {
		width: 60px;
		height: 60px;
		border: 2.97px solid #FFFFFF;
		filter: drop-shadow(4.97px 3.97px 0px #000000);
		margin-right: 25px;
	}
`;

const customStyleS = `
	.custom-avatar-small {
		width: 30px;
		height: 30px;
		border: 2.97px solid #FFFFFF;
		filter: drop-shadow(4.97px 3.97px 0px #000000);
		margin-right: 25px;
	}
`;

const customStyleXS = `
	.custom-avatar-small {
		width: 15px;
		height: 15px;
		border: 2.97px solid #FFFFFF;
		filter: drop-shadow(4.97px 3.97px 0px #000000);
		margin-right: 25px;
	}
`;

const MyAvatar = (props: any) => {
	const authCtx = props.authCtx;
	const [style, setStyle] = useState('');
	// const [avatar, setAvatar] =  useState<string | null>('');
	const [content, setContent] = useState<any>(null);

	useEffect(() => {
		if (props.style === "sidebar") {
			setStyle(customStylesSidebar);
		} else if (props.style ==='xs') {
			setStyle(customStyleXS);
		} else {
			setStyle(customStyleS);
		}
	}, [props.style]);

	useEffect(() => {
		if (authCtx.userId === props.id) {
			setContent(authCtx.avatar ? <Avatar className="custom-avatar" src={authCtx.avatar} /> : <Avatar className="custom-avatar" src={authCtx.ftAvatar} /> )
		} else  {
			setContent(props.avatar ? <Avatar className="custom-avatar" src={props.avatar} /> : <Avatar className="custom-avatar" src={props.ftAvatar} />)
		}
	}, [authCtx.avatar, props.avatar]);

	return (
		<>
		<style>{style}</style>
			{content}
			{/* {authCtx.avatar ? <Avatar className="custom-avatar" src={authCtx.avatar} /> : <Avatar className="custom-avatar" src={authCtx.ftAvatar} /> } */}
			{/* <Avatar className="custom-avatar" src={avatar} /> */}
		</>
	)
}


export default MyAvatar;
