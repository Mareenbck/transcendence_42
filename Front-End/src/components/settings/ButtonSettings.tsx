import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import '../../style/Settings.css';

const customStyles = `
  .MuiButton-contained:hover {
    background-color: #C7B9FF;
	border: solid 3px #000000;
  }
`;

const ButtonSettings = (props: any) => {

	const [title, setTitle] = useState('');
	useEffect(() => {
		if (props.is2FAEnabled === true && props.title === '2FA') {
			setTitle('Enable');
		} else if (props.is2FAEnabled === false && props.title === '2FA'){
			setTitle('Disable');
		}
	}, [props.is2FAEnabled]);
	console.log("props---->")
	console.log(props)

	return (
		<>
		<style>{customStyles}</style>
		<Button variant="contained" className="custom-button">{title}</Button>
		</>
	)
}

export default ButtonSettings;
