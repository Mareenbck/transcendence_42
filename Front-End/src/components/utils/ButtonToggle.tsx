import React, { useState } from "react";
import Friends from "../friends/FriendsDrawer";
import "../../style/utils.css"
import { Drawer } from '@mui/material';
import ButtonLateral from "./ButtonLateral";

const ButtonToggle = () => {
	const [showUserList, setShowUserList] = useState(false);

	const toggleUserList = () => {
	  setShowUserList(!showUserList);
	}

	return (
		<>
		<div className="volet-container">
			<ButtonLateral onSubmit={toggleUserList} title="Users" open={showUserList}></ButtonLateral>
			<Drawer anchor="right" open={showUserList} onClose={toggleUserList}>
				<Friends />
			</Drawer>
		</div>
		</>
	)
}

export default ButtonToggle;
