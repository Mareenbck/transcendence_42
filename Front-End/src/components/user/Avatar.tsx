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

const MyAvatar = (props: any) => {

	const [style, setStyle] = useState('');

	useEffect(() => {
		if (props.style === "sidebar") {
			setStyle(customStylesSidebar);
		} else {
			setStyle(customStyleS);
		}
	}, [props.style]);

	return (
		<>
		<style>{style}</style>
			{props.src.avatar ? <Avatar className="custom-avatar" src={props.src.avatar} /> : <Avatar className="custom-avatar" src={props.src.ftAvatar} /> }
		</>
	)
}


export default MyAvatar;
