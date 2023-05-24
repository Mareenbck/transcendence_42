import React, { useEffect, useState } from 'react';
import '../../style/Settings.css';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';

const customStylesL = `
	.custom-icon.icon-l {
		width: 40px;
		height: 40px;
		background-color: black;
	}
`;

const customStylesM = `
	.custom-icon.icon-m {
		width: 30px;
		height: 30px;
	}
`;

const customStyleS = `
	.custom-icon.icon-s {
		width: 25px;
		height: 25px;
	}
`;

const customStyleXS = `
	.custom-icon.icon-xs {
		width: 20px;
		height: 20px;
	}
`;

const BadgeIcon = (props: any) => {
	const [style, setStyle] = useState<string>('');
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
