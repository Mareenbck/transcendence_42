import * as React from 'react';
import { useEffect, useContext, useState, useRef, RefObject } from 'react'
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import useSocket from '../../../service/socket';
import AuthContext from "../../../store/AuthContext";
import Fetch from "../../../interfaces/Fetch"
import { UserChat } from "../../../interfaces/iChat";
import { Avatar } from '@mui/material';
import { FriendContext } from '../../../store/FriendshipContext';
import { faBan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DirectMessageInfo from './DirectMessageInfo';

export default function UsersWithDirectMessage(props: any) {
	const [usersWith, setUsersWith] = useState<UserChat[]>([]);
	const [me, setMe] = useState<UserChat | null>(null);
	const [AUsersWith, setAUsersWith] = useState<UserChat | null>(null);
	const authCtx = useContext(AuthContext);
	const friendCtx = useContext(FriendContext);
	const scrollRef: RefObject<HTMLDivElement> = useRef(null);
	const [sendMessage, addListener] = useSocket();
	const [latestsMsgs, setLatestsMsgs] = useState<any>(null);

	useEffect(() => {
		scrollRef.current?.scrollIntoView({behavior: "smooth"})
	}, [usersWith]);

	useEffect(() => {
		addListener("getNewDirectUser", data => {
			setAUsersWith(data)
		});
	}, [addListener]);

	useEffect(() => {
		if (AUsersWith) {
			async function getUserFromBack() {
				if (AUsersWith) {
					const response = await Fetch.fetch(authCtx.token, "GET", `users/block`, +AUsersWith);
					const avatar = await friendCtx.fetchAvatar(response.id);
					response.avatar = avatar;
					setUsersWith(prev => [response, ...prev]);
				}
			};
		getUserFromBack();
	}
	}, [AUsersWith]);

	async function getAllUsersWith() {
		const response = await Fetch.fetch(authCtx.token, "GET", `users/userWith`, authCtx.userId);
		const updatedFriends = await Promise.all(response.map(async (friend: UserChat) => {
			const avatar = await friendCtx.fetchAvatar(friend.id);
			return { ...friend, avatar };
		}));
		if (AUsersWith) {
			setAUsersWith(null);
		}
		return updatedFriends;
	};

	useEffect(() => {
		const fetchData = async () => {
		  const data = await getAllUsersWith();
		  setUsersWith(data);
		};
		fetchData();
	}, [AUsersWith]);

	async function getMe() {
		if (authCtx) {
			const response = await Fetch.fetch(authCtx.token, "GET", `users/block`, +authCtx.userId);
			setMe(response);
		}
	};

	useEffect(() => {
		getMe();
	}, [props]);

	const amIBlocked = (userXid: number): string => {
		if (me && userXid && me?.blockedFrom.find((u: UserChat) => +u.id === +userXid))
			{ return "chatOnlineNotFriend"; }
		else
			{return "chatOnlineFriend";}
	}

	useEffect(() => {
		const fetchUserWithDirectMessages = async () => {
			if (authCtx && props.currentDirect && props.currentDirect.id) {
				const response = await Fetch.fetch(authCtx.token, "GET", `dir-mess/getMessages/`);
				setLatestsMsgs(response);
			}
		};
		fetchUserWithDirectMessages();
	}, [authCtx, props.currentDirect]);

	return (
		<Box style={{ backgroundColor: '#f2f2f2'}} sx={{ flexGrow: 1, maxWidth: 752 }}>
			{usersWith && usersWith.map((o) => (
				<ListItem
					key={o.id}
					className={amIBlocked(+o?.id)}
					secondaryAction={
						<>
						{!me?.blockedTo.find((u: UserChat)=>(+o?.id === +u?.id)) ?
							undefined
							:
							<FontAwesomeIcon icon={faBan} onClick={() => {props.setToUnblock(props.getUser(o.id))}} className={`btn-chatlist-clicked`}/>
						}
						{ amIBlocked(+o?.id) === "chatOnlineNotFriend" ? (
							<FontAwesomeIcon icon={faBan} className={`btn-chatlist-disable`} />
							) : (
								!me?.blockedTo.find((u: UserChat) => +o?.id === +u?.id) ? (
									<DirectMessageInfo userWithDM={o} type='status' currentDirect={props.currentDirect} latestsMsgs={latestsMsgs} />
								) : null
						)}
						</>
					} >
					<ListItemAvatar>
						<Avatar variant="rounded" className="users-chatlist-avatar"  src={o.avatar ? o.avatar : o.ftAvatar} />
					</ListItemAvatar>
					<div className='directMess-info'>
						<ListItemText className="dicuss-link" primary={o?.username} onClick={props.isHeBlocked(o.id) ? () => props.getDirect(o) : undefined}/>
						<DirectMessageInfo userWithDM={o} type='msg' latestsMsgs={latestsMsgs}/>
					</div>
				</ListItem>
			))}
		</Box>
	);
}


