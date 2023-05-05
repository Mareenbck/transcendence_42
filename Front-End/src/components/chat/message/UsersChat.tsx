import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../../store/AuthContext';
import { FriendContext } from '../../../store/FriendshipContext';
import Friend from '../../interfaces/IFriendship'
import '../../../style/UsersChat.css';
import UsersAction from './UsersActions';
import { UserChat } from '../../../interfaces/iChat';
import PersonnalInfoChat from '../PersonnalInfoChat';


const UsersChat = (props: any) => {
	const [friends, setFriends] = useState<UserChat[]>([]);
	const authCtx = useContext(AuthContext);
	const friendCtx = useContext(FriendContext);

	const currentUserId = authCtx.userId;
	const onlineFriends: UserChat[] = friends.filter((friend: UserChat) => friend.status === 'ONLINE' && friend.id !== parseInt(currentUserId));
	const offlineFriends: UserChat[] = friends.filter((friend: UserChat) => friend.status === 'OFFLINE' && friend.id !== parseInt(currentUserId));
	const playingFriends: UserChat[] = friends.filter((friend: UserChat) => friend.status === 'PLAYING' && friend.id !== parseInt(currentUserId));

	useEffect(() => {
		const url = "http://localhost:3000/users/block/users/";
		const fetchUsers = async () => {
			const response = await fetch(
				url,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${authCtx.token}`
					}
				}
			)
			const data = await response.json();
			const updatedFriends = await Promise.all(data.map(async (friend: Friend) => {
				const avatar = await friendCtx.fetchAvatar(friend.id);
				return { ...friend, avatar };
			}));
			setFriends(updatedFriends);
		}
		fetchUsers();
	}, [])

	return (
		<>
		<div className='contain-users'>
		<PersonnalInfoChat />
			<UsersAction title="Online" users={onlineFriends} chat={props} getDirect={props.getDirect} isHeBlocked={props.isHeBlocked} inviteGame={props.inviteGame} setToBlock={props.setToBlock} getUser={props.getUser} setToUnblock={props.setToUnblock}/>
			<UsersAction title="Offline" users={offlineFriends} chat={props} getDirect={props.getDirect} isHeBlocked={props.isHeBlocked} inviteGame={props.inviteGame} setToBlock={props.setToBlock} getUser={props.getUser} setToUnblock={props.setToUnblock}/>
			<UsersAction title="Playing" users={playingFriends} chat={props} getDirect={props.getDirect} isHeBlocked={props.isHeBlocked} inviteGame={props.inviteGame} setToBlock={props.setToBlock} getUser={props.getUser} setToUnblock={props.setToUnblock}/>
		</div>
		</>
	  );

}

export default UsersChat;
