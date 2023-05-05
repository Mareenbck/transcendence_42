import * as React from 'react';
import { useEffect, useContext, useState, useRef, FormEvent, RefObject } from 'react'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import useSocket from '../../../service/socket';
import AuthContext from "../../../store/AuthContext";
import Fetch from "../../../interfaces/Fetch"
import { UserChat } from "../../../interfaces/iChat";
import { Link } from "react-router-dom";
import MyAvatar from '../../user/Avatar';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { Avatar } from '@mui/material';
import { FriendContext } from '../../../store/FriendshipContext';
import { faBan, faTableTennisPaddleBall } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DirectMessageInfo from './DirectMessageInfo';

export default function UsersWithDirectMessage(props: any) {
  const {currentDirect, setCurrentDirect} = props;
  const [usersWith, setUsersWith] = useState<UserChat[]>([]);
  const [me, setMe] = useState<UserChat | null>(null);
  const [AUsersWith, setAUsersWith] = useState<UserChat | null>(null);
  const authCtx = useContext(AuthContext);
  const friendCtx = useContext(FriendContext);
  const scrollRef: RefObject<HTMLDivElement> = useRef(null);
  const [sendMessage, addListener] = useSocket();
  const [toBlock, setToBlock] = useState<UserChat | null>(null);
  const [toUnblock, setToUnblock] = useState<UserChat | null>(null);
  const [fromBlock, setFromBlock] = useState<number | null>(null);
  const [unfromBlock, setUnfromBlock] = useState<number | null>();
  const [blockForMe, setBlockForMe] = useState<number | null>();
  const [unblockForMe, setUnblockForMe] = useState<number | null>();

// scroll
	useEffect(() => {
		scrollRef.current?.scrollIntoView({behavior: "smooth"})
	}, [usersWith]);

	useEffect(() => {
		addListener("getNewDirectUser", data => setAUsersWith(data));
	}, [addListener]);

	useEffect(() => {
		if (AUsersWith) {
			async function getUserFromBack() {
				if (AUsersWith) {
					const response = await Fetch.fetch(authCtx.token, "GET", `users/block`, +AUsersWith);
					setUsersWith(prev => [response, ...prev]);
				}
			};
		getUserFromBack();
	}
	}, [AUsersWith]);

  // aller chercher la liste des users avec active conv
	async function getAllUsersWith() {
		const response = await Fetch.fetch(authCtx.token, "GET", `users/userWith`, authCtx.userId);
		const updatedFriends = await Promise.all(response.map(async (friend: UserChat) => {
			const avatar = await friendCtx.fetchAvatar(friend.id);
			return { ...friend, avatar };
		}));
		setUsersWith(updatedFriends);
	};

	useEffect(() => {
		getAllUsersWith();
	},[AUsersWith]);

// pour le mécanisme des blocked,j'ai besoin de ME as user puisque je ne suis pas dans allWith direct messsage
	async function getMe() {
		if (authCtx) {
			const response = await Fetch.fetch(authCtx.token, "GET", `users/block`, +authCtx.userId);
			setMe(response);
		}
	};

	useEffect(() => {
		getMe();
	}, [authCtx]);

  // suis-je bloqué
  const amIBlocked = (userXid: number): string => {
  if (me && userXid && me?.blockedFrom.find((u: UserChat) => +u.id === +userXid))
      { return "chatOnlineNotFriend"; }
    else
      {return "chatOnlineFriend";}
  };


  useEffect(() => {
    addListener("blockForMe", data => {
      if (+data.id !== +authCtx.userId)
        { setBlockForMe(+data.id);}
    });
  });
  useEffect(() => {
    addListener("unblockForMe", data => {
      if (+data.id !== +authCtx.userId)
        { setUnblockForMe(+data.id);}
    });
  });

  // je reçois le socket message que ME was blocked by data
  useEffect(() => {
    addListener("wasBlocked", data => {
      if (+data.id !== +authCtx.userId)
      { setFromBlock(+data.id);}
    });
  });

    // je reçois le socket message que ME was UNblocked by data
  useEffect(() => {
    addListener("wasUnblocked", data => {
      if (+data.id !== +authCtx.userId)
      { setUnfromBlock(+data.id);}
    });
  });

  // je change la data en conséquence du message que ME a été bloqué
  useEffect(() => {
    if (usersWith !== undefined && authCtx.userId && fromBlock && fromBlock !== +authCtx.userId) {
      const j = usersWith.find(userX => +userX.id === +fromBlock);
      (j && me) ? me.blockedFrom.push(j) : "";
      if (currentDirect && +currentDirect.id === fromBlock)
        {setCurrentDirect(null);}
      setFromBlock(null);
    };
  }, [fromBlock]);

  // je change la data en conséquence du message que ME a été UNblocked
  useEffect(() => {
    if (usersWith !== undefined && authCtx.userId && unfromBlock && unfromBlock !== +authCtx.userId) {
      const j = usersWith.find(userX => +userX.id === +unfromBlock);
      (j && me) ? me.blockedFrom = j.blockedFrom.filter((u: UserChat) => +u.id !== unfromBlock) : "";
      setUnfromBlock(null);
    };
  }, [unfromBlock]);

//  pour mettre à jour le toogle bouton qui viendrait de l'autre liste...
  useEffect(() => {
    if (blockForMe && usersWith !== undefined && authCtx.userId && blockForMe !== (undefined || null) && blockForMe !== +authCtx.userId) {
      const j = usersWith.find(userX => +userX.id === +blockForMe);
      if (j && me && blockForMe) {
        me.blockedTo.push(j);
      };
    };
      setBlockForMe(null);
  }, [blockForMe]);

  useEffect(() => {
    if (unblockForMe && usersWith !== undefined && authCtx.userId && unblockForMe !== (undefined || null) && unblockForMe !== +authCtx.userId) {
      const j = usersWith.find(userX => +userX.id === +unblockForMe);
      if (j && me && unblockForMe) {
        me.blockedTo = me.blockedTo.filter((u: UserChat) => +u.id !== +unblockForMe)}
    };
      setBlockForMe(null);
  }, [unblockForMe]);

  // Je viens de bloquer un user, 1 j'envoie le message socket, 2 je POST en bdd, 3 je met à jour la data ici
  useEffect(() => {
    if (toBlock)
    {
      sendMessage("toBlock", {
        blockTo: +toBlock.id,
        blockFrom: +authCtx.userId,
      } as any )
      async function blockUser() {
        try {
          if (toBlock) { const res = await Fetch.postBlock(authCtx.token, toBlock.id, +authCtx.userId)};
        } catch(err) {console.log(err)}
      };
      blockUser();
      if (usersWith && usersWith.find(user => +user.id === +toBlock.id)) {
        me ? me.blockedTo.push(toBlock) : "";
      }
      if (currentDirect && toBlock && +currentDirect.id === +toBlock.id)
        {setCurrentDirect(null)};
      setToBlock(null);
    }
  }, [toBlock]);

    // Je viens de UNblock un user, 1 j'envoie le message socket, 2 je POST en bdd, 3 je met à jour la data ici
  useEffect(() => {
    if (toUnblock)
    {
      sendMessage("toUnblock", {
        blockTo: +toUnblock.id,
        blockFrom: +authCtx.userId,
      } as any)
      async function unblockUser() {
        try {
          if (toUnblock) { const res = await Fetch.postUnblock(authCtx.token, toUnblock.id, +authCtx.userId)};
        } catch(err) {console.log(err)}
      };
      unblockUser();
      if (usersWith && usersWith.find(userX => +userX.id === +toUnblock.id)) {
        const i = usersWith.findIndex(userX => +userX.id === +toUnblock.id);
        me ? me.blockedTo = me.blockedTo.filter((u: UserChat) => +u.id !== +toUnblock.id) : "";
      }
      setToUnblock(null);
    }
  }, [toUnblock]);

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
								!me?.blockedTo.find((u: UserChat) => +o?.id === +u?.id) && (
									// <DirectMessageInfo userWithDM={o} type='status'/>
									<p>LOL</p>
								)
						)}
						</>
					}
					>
					<ListItemAvatar>
						<Avatar variant="rounded" className="users-chatlist-avatar"  src={o.ftAvatar ? o.ftAvatar : o.avatar} />
					</ListItemAvatar>
					<div className='directMess-info'>
						<ListItemText className="dicuss-link" primary={o?.username} onClick={props.isHeBlocked(o.id) ? () => props.getDirect(o) : undefined}/>
						{/* <DirectMessageInfo userWithDM={o} type='msg'/> */}
					</div>
				</ListItem>
			))}
		</Box>
	);
}

