import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import '../../style/Settings.css';

const customStyles = `
	.MuiButton-contained:hover,
	.custom-button.active  {
		background-color: #C7B9FF;
		border: solid 3px #000000;
		box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%);
	}
	.custom-button {
		color: black;
		box-shadow: 3.65002px 3.65002px 0px #000000;
		font-family: 'Inter';
		text-transform: none;
		font-weight: 500;
		font-size: 16px;
		line-height: 19px;
		background: #FFFFFF;
		border: 3.19377px solid #000000;
		box-shadow: 3.65002px 3.65002px 0px #000000;
		border-radius: 10.9501px;
		width: 107px;
		height: 40px;
		display: flex;
		align-items: center;
		padding: 16px;
		margin-right: 30px;
	}
`;

const ButtonSettings = (props: any) => {
	const [title, setTitle] = useState('');
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		if (props.title === 'Upload') {
			const input = document.createElement("input");
			input.type = "file";
			input.accept = "image/*";
			input.onchange = (e) => {
				const file = (e.target as HTMLInputElement).files?.[0];
				if (file) {
					props.onSubmit(file);
				}
			};
			input.click();
		} else if (props.title === '2FA') {
			return ;
		} else {
			props.onSubmit(event);
		}
	}

	useEffect(() => {
		if (props.is2FAEnabled === true && props.title === '2FA') {
			setTitle('Enable');
		} else if (props.is2FAEnabled === false && props.title === '2FA'){
			setTitle('Disable');
		}
		else {
			setTitle(props.title)
		}
	}, [props.is2FAEnabled, props.title]);

	return (
		<>
		<style>{customStyles}</style>
			<Button variant="contained" className={`custom-button ${props.is2FAEnabled ? 'active' : ''}`} onClick={handleClick}>{title}
			</Button>
		</>
	)
}

export default ButtonSettings;
