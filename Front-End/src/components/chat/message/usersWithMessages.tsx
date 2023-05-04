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





const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

function generate(element: React.ReactElement) {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value,
    }),
  );
}

export default function UsersWithDirectMessage(props: any) {
  const {currentDirect, setCurrentDirect, setCurrentChat} = props;
  const [usersWith, setUsersWith] = useState<UserChat[]>([]);
  const [me, setMe] = useState<UserChat | null>(null);
  const [AUsersWith, setAUsersWith] = useState<UserChat | null>(null);
  const user = useContext(AuthContext);
  const scrollRef: RefObject<HTMLDivElement> = useRef(null);
  const [sendMessage, addListener] = useSocket();
  const [toBlock, setToBlock] = useState<UserChat | null>(null);
  const [toUnblock, setToUnblock] = useState<UserChat | null>(null);
  const [fromBlock, setFromBlock] = useState<number | null>(null);
  const [unfromBlock, setUnfromBlock] = useState<number | null>();
  const [blockForMe, setBlockForMe] = useState<number | null>();
  const [unblockForMe, setUnblockForMe] = useState<number | null>();
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);

  
  // en cas de nouveau en route
  useEffect(() => {
    addListener("getNewDirectUser", data => setAUsersWith(data));
  });
    
  useEffect(() => {
    if (AUsersWith)
    {
      async function getUserFromBack() {
        if (AUsersWith)
        { const response = await Fetch.fetch(user.token, "GET", `users/block`, +AUsersWith);
        setUsersWith(prev => [response, ...prev]);}
      };
      getUserFromBack();
    }
    }, [AUsersWith]);

  // aller chercher la liste des users avec active conv
  async function getAllUsersWith() {
    const response = await Fetch.fetch(user.token, "GET", `users/userWith`, user.userId);
    setUsersWith(response);
  };
  useEffect(() => {
    getAllUsersWith();
  },[] ); 

    // pour le mécanisme des blocked,j'ai besoin de ME as user puisque je ne suis pas dans allWith direct messsage
    async function getMe() {
      if (user) {
      const response = await Fetch.fetch(user.token, "GET", `users/block`, +user.userId);
      setMe(response);
      }
    };
    useEffect(() => {
      getMe();
    }, [user]); 

  // invite to a game
  const inviteGame = (playerId :number ) => {
    sendMessage("InviteGame", {
      author: getUser(+user.userId),
      player: getUser(+playerId),
    } as any);
  }
  
  const getUser  = (userId: number): UserChat | null => {
    const a = usersWith.find(userX => +userX?.id === +userId);
    if (a !== undefined)
    { return(a)}
    return (null);
  };

  // suis-je bloqué
  const amIBlocked = (userXid: number): string => {
  if (me && userXid && me?.blockedFrom.find((u: UserChat) => +u.id === +userXid))
      { return "chatOnlineNotFriend"; }
    else
      {return "chatOnlineFriend";}
  };

  // scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior: "smooth"})
  }, [usersWith]);


  const getDirect = (userX: UserChat): void => {
    if (me && (me.blockedTo.find((u: UserChat) => +u.id === +userX.id) === undefined ))
    {
      if (me.blockedFrom.find((u: UserChat) => +u.id === +user.userId) === undefined)
      { 
        setCurrentDirect(userX);
        setCurrentChat(null);
      }
    }
  }

  useEffect(() => {
    addListener("blockForMe", data => {
      if (+data.id !== +user.userId)
        { setBlockForMe(+data.id);}
    });
  });
  useEffect(() => {
    addListener("unblockForMe", data => {
      if (+data.id !== +user.userId)
        { setUnblockForMe(+data.id);}
    });
  });

  // je reçois le socket message que ME was blocked by data
  useEffect(() => {
    addListener("wasBlocked", data => {
      if (+data.id !== +user.userId)
      { setFromBlock(+data.id);}
    });
  });

    // je reçois le socket message que ME was UNblocked by data
  useEffect(() => {
    addListener("wasUnblocked", data => {
      if (+data.id !== +user.userId)
      { setUnfromBlock(+data.id);}
    });
  });

  // je change la data en conséquence du message que ME a été bloqué
  useEffect(() => {
    if (usersWith !== undefined && user.userId && fromBlock && fromBlock !== +user.userId) {
      const j = usersWith.find(userX => +userX.id === +fromBlock);
      (j && me) ? me.blockedFrom.push(j) : "";
      if (currentDirect && +currentDirect.id === fromBlock)
        {setCurrentDirect(null);}
      setFromBlock(null);
    };
  }, [fromBlock]);

  // je change la data en conséquence du message que ME a été UNblocked
  useEffect(() => {
    if (usersWith !== undefined && user.userId && unfromBlock && unfromBlock !== +user.userId) {
      const j = usersWith.find(userX => +userX.id === +unfromBlock);
      (j && me) ? me.blockedFrom = j.blockedFrom.filter((u: UserChat) => +u.id !== unfromBlock) : "";
      setUnfromBlock(null);
    };
  }, [unfromBlock]);

//  pour mettre à jour le toogle bouton qui viendrait de l'autre liste...
  useEffect(() => {
    if (blockForMe && usersWith !== undefined && user.userId && blockForMe !== (undefined || null) && blockForMe !== +user.userId) {
      const j = usersWith.find(userX => +userX.id === +blockForMe);
      if (j && me && blockForMe) {
        me.blockedTo.push(j);
      };
    };
      setBlockForMe(null);
  }, [blockForMe]);
     
  useEffect(() => {
    if (unblockForMe && usersWith !== undefined && user.userId && unblockForMe !== (undefined || null) && unblockForMe !== +user.userId) {
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
        blockFrom: +user.userId,
      } as any )
      async function blockUser() {
        try {
          if (toBlock) { const res = await Fetch.postBlock(user.token, toBlock.id, +user.userId)};
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
        blockFrom: +user.userId,
      } as any)
      async function unblockUser() {
        try {
          if (toUnblock) { const res = await Fetch.postUnblock(user.token, toUnblock.id, +user.userId)};
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
        <Demo style={{ backgroundColor: '#f2f2f2' }}>
        <List dense={dense}>

         {usersWith && usersWith.map((o) => (
            <ListItem  key={o.id} className={amIBlocked(+o?.id)}
            //   secondaryAction={
            //   <div>
            //  <IconButton className='violet-icon' edge="end" aria-label="Chat" onClick={()=> {getDirect(o)}}>
            //     <ChatBubbleIcon />
            //   </IconButton>   
            //     <Link to={`/users/profile/${o?.id}`} className="profile-link">
            //       <IconButton  className='violet-icon' edge="end" aria-label="Profil">
            //         <AccountBoxIcon />
            //       </IconButton>
            //     </Link>
            //     { !me?.blockedTo.find((u: UserChat)=>(+o?.id === +u?.id)) ?
            //     <IconButton className="chatSubmitButton" onClick={() => {setToBlock(o)}} >
            //       <LockOpenIcon /> 
            //       <Link to={'/game/'} onClick={() => inviteGame(o?.id)}> 
            //         <IconButton className='violet-icon' edge="end" aria-label="Play">
            //           <PlayCircleIcon/>
            //         </IconButton>
            //       </Link>                  
            //     </IconButton>
            //     :
            //     <IconButton className="chatSubmitButton2" onClick={() => {setToUnblock(o)}} >
            //         <LockIcon />                    
            //     </IconButton>}

            //   </div>
            //   }
              >
              <ListItemAvatar>
                <MyAvatar authCtx={user} id={o?.id} style="xs" avatar={o?.avatar} ftAvatar={o?.ftAvatar}/>
              </ListItemAvatar>
              <ListItemText
                  primary={o?.username}
                  secondary={secondary ? 'Secondary text' : null}
              />
            </ListItem>
            ))}
        </List>
        </Demo>
      </Box>

    );
}

       