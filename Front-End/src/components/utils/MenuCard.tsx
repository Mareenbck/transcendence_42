import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MenuCard = (props: any) => {
	const [body, setBody] = useState<string>('');
	const [icon, setIcon] = useState<string>('');
	const [link, setLink] = useState<string>('');

	useEffect(() => {
		if (props.body === "play") {
			setBody("choose one of your online friends and play against them in a pong match");
			setIcon("fa-sharp fa-solid fa-trophy");
			setLink("/game")
		} else if (props.body === "watch") {
			setBody("join a room and attend a pong match between your friends")
			setIcon("fa-solid fa-video");
			setLink("/game")
		} else if (props.body === "chat") {
			setBody("join a channel or discuss privately with your friends")
			setIcon("fa-solid fa-comments");
			setLink("/chat/message")
		}
	}, [props.icon, props.body])

	return (
		<>
		<Link to={link} className='menu-bodyCard'>
		<div className='menu-bodyCard'>
			<p>{body}</p>
			<div className='font-menu'>
				<i className={icon}></i>
			</div>
		</div>
		</Link>
		<br />
		</>
	)
}

export default MenuCard;
