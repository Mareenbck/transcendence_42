import React from "react";
import { Button } from '@mui/material';
import '../../../style/Settings.css';
import ButtonSettings from "../../settings/ButtonSettings";

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

const ButtonPassword = (props: any) => {

    return(
        <>
        <style>{customStyles}</style>
        </>
    );

}

export default ButtonPassword;
