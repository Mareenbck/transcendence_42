import React, { useEffect, useState } from 'react';
import '../../style/Settings.css';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';

import MyAvatar from '../user/Avatar';

const customStylesL = `
	.custom-icon.icon-l {
		width: 80px;
		height: 80px;
		background-color: black;
	}
`;

const customStylesM = `
	.custom-icon.icon-m {
		width: 65px;
		height: 65px;
	}
`;

const customStyleS = `
	.custom-icon.icon-s {
		width: 40px;
		height: 40px;
	}
`;

const customStyleXS = `
	.custom-icon.icon-xs {
		width: 30px;
		height: 30px;
	}
`;

const BadgeIcon = (props: any) => {
	const [style, setStyle] = useState('');
	const [content, setContent] = useState<any>(null);

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
		const iconClass = `custom-icon icon-${props.style}`;
		setContent(<Avatar className={iconClass} src={props.src} />)
	}, [props.style]);

	return (
		<>
		<style>{style}</style>
		<Tooltip title={props.description}>
			<Button sx={{ m: 1 }}>{content}</Button>
		</Tooltip>
		</>
	)
}


export default BadgeIcon;
