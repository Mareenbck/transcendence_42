import React, { useContext, useEffect, useState, useRef, RefObject } from "react";
import useSocket from '../../../service/socket';
import AuthContext from "../../../store/AuthContext";
import Fetch from "../../../interfaces/Fetch"
import { UserChat } from "../../../interfaces/iChat";
import { Link } from "react-router-dom";
import MyAvatar from '../../user/Avatar';

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

  // set direct message if not blocked
  // const getDirect = (userX: UserChat): void => {
  //   if (userX && (userX.blockedTo.find((u: UserChat) => +u.id === +userX.id) === undefined ))
  //   {
  //     if (userX.blockedFrom.find((u: UserChat) => +u.id === +user.userId) === undefined)
  //     { 
  //       setCurrentDirect(userX);
  //       setCurrentChat(null);
  //     }
  //   }
  // }

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


  /// Block & Unblock mechanism
  // to get the info to change the icon, additional message because of the second list
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
        <>
        <div className="userWith">
           { usersWith && usersWith.map((o) => (
            // +o?.id !== +user.userId ?
            <div  key={o.id} className={amIBlocked(+o?.id)} >
                <Link to={'/game/play'} onClick={() => inviteGame(o?.id)}> <i className="fa fa-gamepad" aria-hidden="true"  ></i></Link>
                <Link to={`/users/profile/${o?.id}`} className="profile-link"> <i className="fa fa-address-card-o" aria-hidden="true"></i>   </Link>
                <div className="fname" onClick={()=> {getDirect(o)}} >
                    <div className="chatOnlineImgContainer">
                        <MyAvatar authCtx={user} id={o?.id} style="xs" avatar={o?.avatar} ftAvatar={o?.ftAvatar}/>
                    </div>
                    <span className="chatOnlineName"> {o?.username} </span>
                </div>
                { !me?.blockedTo.find((u: UserChat)=>(+o?.id === +u?.id)) ?
                <button className="chatSubmitButton" onClick={() => {setToBlock(o)}} >
                    <i className="fa fa-unlock" aria-hidden="true"></i>
                </button>
                :
                <button className="chatSubmitButton2" onClick={() => {setToUnblock(o)}} >
                    <i className="fa fa-lock" aria-hidden="true"></i>
                </button>}
            </div>
            // : <span className="noConversationText2" > New here ?... </span>
            ))}
        </div>
        </>
    );
}
