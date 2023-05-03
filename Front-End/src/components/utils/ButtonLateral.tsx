import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';

const customStyles = `
	.MuiButton-contained:hover {
		background-color: #C7B9FF;
	}
	.custom-button-lat.active  {
		position: absolute;
		left: -468px;
		transform: translateY(-50%) rotate(270deg);
		background-color: #C7B9FF;
	}
	.custom-button-lat {
		padding: 10px 25px;
		background: #555;
		color: #fff;
		text-decoration: none;
		position: absolute;

		top: -60vh;
		left: -1vh;

		transform: translateY(-50%);
		z-index: 1;
		-ms-transform: rotate(270deg);
		-moz-transform: rotate(270deg);
		-webkit-transform: rotate(270deg);
		transform: rotate(270deg);

		border-radius: 8px 8px 0px 0px;
	}
`;

const ButtonLateral = (props: any) => {
	const [title, setTitle] = useState('');

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		props.onSubmit(event);
	}

	useEffect(() => {
		setTitle(props.title)
	}, [props.title]);

	return (
		<>
		<style>{customStyles}</style>
			<Button variant="contained" className={`custom-button-lat ${props.open ? 'active' : ''}`} onClick={handleClick}>{title}
			</Button>
		</>
	)
}

export default ButtonLateral;
