import React, { FormEvent, useContext, useEffect, useState } from "react";
import { FriendContext } from "../../store/FriendshipContext";
import Friend from '../../interfaces/IFriendship'
import { AvatarGroup } from '@mui/material';
import MyAvatar from "../user/Avatar";


const ShowFriends = (props: any) => {
	const friendCtx = useContext(FriendContext);
	const authCtx = props.authCtx;

	const handleRemoveFriend = async (event: FormEvent, friendId: number) => {
		event.preventDefault();
		friendCtx.removeFriend(friendId, props.currentId, props.token)
	}

	return (
		<>
		<AvatarGroup>
			{friendCtx.friends.map((friend: Friend) => (
				<li key={friend.id}>
					<MyAvatar style='l' authCtx={authCtx} id={friend.id} avatar={friend.avatar} ftAvatar={friend.ftAvatar}></MyAvatar>
				</li>
			))}
		</AvatarGroup>
		<br />
			{/* <ul>
				{friendCtx.friends.map((friend: Friend) => (
					<li key={friend.id}>
					<div className='friends-infos'>
						<span>{friend.username}</span>
						<div className='action-friend'>
							<form onSubmit={(event) => {handleRemoveFriend(event, friend.id)}}>
								<button type="submit"><i className="fa-solid fa-user-xmark fa-2xs"></i></button>
							</form>
							<i className="fa-solid fa-user-xmark fa-2xs"></i>
							<i className="fa-solid fa-user-xmark fa-2xs"></i>
						</div>
					</div>
					{friend.avatar ? <img className='avatar-img' src={friend.avatar} alt={"avatar"} /> : <img className='avatar-img' src={friend.ftAvatar} alt={"ftAvatar"} />}
				</li>
				))}
			</ul> */}
		</>
	)
}

export default ShowFriends;
