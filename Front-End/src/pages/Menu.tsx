import React, { useState } from "react";
import { useContext } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthContext from "../store/AuthContext";
import SideBar from '../components/SideBar'
import style from '../style/Menu.module.css'
import '../style/MenuBis.css'
import ButtonToggle from "../components/utils/ButtonToggle";
import Card from "../components/utils/Card";

const Menu = () => {
	const authCtx = useContext(AuthContext);
	const isLoggedIn = authCtx.isLoggedIn;

	return (
		<>
		<div className={style.mainPos}>
			<SideBar title="Profile" />
			<div className="container-menu">
				<h2 >Welcome {authCtx.username}</h2>
				<div className="card-menu">
					<Card color='blue' title="Challenge your friend" body="play" type="menu" height="120px" width="725px"></Card>
					<Card color='red' title="Watch a match" body="watch" type="menu" height="120px" width="725px"></Card>
					<Card color='green' title="Chat with your friend" body="chat" type="menu" height="120px" width="725px"></Card>
				</div>
			</div>
			{!isLoggedIn && <Navigate to="/" replace={true} />}
			</div>
			<ButtonToggle />
		</>
		)
	}

	export default Menu
