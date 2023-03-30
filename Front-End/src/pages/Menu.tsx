import React from "react";
import { useContext } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthContext from "../store/AuthContext";
import SideBar from '../components/SideBar'
import style from '../style/Menu.module.css'

const Menu = () => {
	const authCtx = useContext(AuthContext);

	const isLoggedIn = authCtx.isLoggedIn;
	const id = authCtx.userId;

	return (
		<>
		 <div className= {style.mainPos}>
			{isLoggedIn && <SideBar className={style.position}  title="Welcome"   isLoggedIn = {isLoggedIn} />}
			<div className={style.position}>
				{!isLoggedIn && <Navigate to="/" replace={true} />}
				{isLoggedIn && <h2 >WELCOME</h2>}

				{/*isLoggedIn && <p>Votre username : {authCtx.username} </p>*/}
				{/*isLoggedIn && <button onClick={authCtx.logout}>LOGOUT </button>*/}
				{/*<Link to={`/users/profile/${id}`} className='btn'>Profile page</Link>*/}
				{/*<Link to="/chat/message">Chat</Link>*/}

				<div className={style.card}>
					{isLoggedIn && <p >Challeng your frinds</p>}
					{isLoggedIn && <p className={style.cardTit}> chose one of your online firends and play againts them in png match</p>}
				</div>

				<div className={style.card}>
					{isLoggedIn && <p >Watch a match</p>}
					{isLoggedIn && <p className={style.cardTit}> Join a room and attend a pong match between yours frinds</p>}
				</div>
				<div className={style.card}>
					{isLoggedIn && <p >Chat with your frinds</p>}
					{isLoggedIn && <p className={style.cardTit}> Join a chatroom or discuss privetly with your frinds</p>}
				</div>

			</div>
		 </div>
		</>
	)
}

export default Menu
