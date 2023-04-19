import React, { useContext, useEffect, useState, useRef, RefObject } from "react";
import useSocket from '../../../service/socket';
import AuthContext from "../../../store/AuthContext";
import Fetch from "../../../interfaces/Fetch"
import { UserChat } from "../../../interfaces/iChat";
import { Link } from "react-router-dom";
import MyAvatar from '../../user/Avatar';

export default function UsersWithDirectMessage(props: any) {
  const {currentChat, currentDirect, setCurrentDirect, setCurrentChat} = props;
  const [usersWith, setUsersWith] = useState<UserChat[]>([]);
  const [AUsersWith, setAUsersWith] = useState<UserChat | null>(null);
  const user = useContext(AuthContext);
  const scrollRef: RefObject<HTMLDivElement> = useRef(null);
  const [sendMessage, addListener] = useSocket();
  const [toBlock, setToBlock] = useState<UserChat | null>(null);
  const [toUnblock, setToUnblock] = useState<UserChat | null>(null);
  const [fromBlock, setFromBlock] = useState<number | null>(null);
  const [unfromBlock, setUnfromBlock] = useState<number | null>();

  // en cas de nouveau en reoute
  useEffect(() => {
    addListener("getNewDirectUser", data => setAUsersWith(data));
  });
    
  useEffect(() => {
    AUsersWith && setUsersWith(prev => [AUsersWith, ...prev]);
    }, [AUsersWith]);

    // aller chercher la liste des usersq avec active conv
  async function getAllUsersWith() {
    const response = await Fetch.fetch(user.token, "GET", `users/userWith`, user.userId);
    setUsersWith(response);
  };
  useEffect(() => {
    getAllUsersWith();
  }, []); 

  // invite to a game
  const inviteGame = (playerId :number ) => {
    console.log(playerId);
    sendMessage("InviteGame", {
      author: getUser(+user.userId),
      player: getUser(+playerId),
    } as any);
  }
  
  const getUser  = (userId: number): UserChat | null => {
    const a = usersWith.find(userX => +userX?.id === +user.userId);
    if (a !== undefined)
    { return(a)}
    return (null);
  };

  // suis-je bloqué
  const amIBlocked = (userXid: number): string => {
    const u = getUser(+user.userId)?.blockedFrom.find((u: UserChat) => +u.id === +userXid);
    if (u)
      { return "chatOnlineNotFriend"; }
    else
      {return "chatOnlineFriend";}
  };

  // scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior: "smooth"})
  }, [usersWith]);

  // set direct message if not blocked
  const getDirect = (userX: UserChat): void => {
    if (userX && (userX.blockedTo.find((u: UserChat) => +u.id === +userX.id) === undefined ))
    {
      if (userX.blockedFrom.find((u: UserChat) => +u.id === +user.userId) === undefined)
      { 
        setCurrentDirect(userX);
        setCurrentChat(null);
      }
      console.log("dsdzsdsds  2", currentDirect);
    }
  }

  // Block & Unblock mechanism

  useEffect(() => {
    addListener("wasBlocked", data => {
      if (+data.id !== +id)
      { setFromBlock(+data.id);}
    });
  }, []);

  useEffect(() => {
    addListener("wasUnblocked", data => {
      if (+data.id !== +id)
      { setUnfromBlock(+data.id);}
    });
  }, []);

  useEffect(() => {
    if (usersWith !== undefined && user.userId && fromBlock && fromBlock !== +user.userId) {
      const i = usersWith.findIndex(userX => +userX.id === +user.userId);
      const j = usersWith.find(userX => +userX.id === +user.userId);
      const k = usersWith.find(userX => +userX.id === +fromBlock);
      k ? j?.blockedFrom.push(k) : "";
      const NewAll = usersWith;
      j ? NewAll.splice(i, 1, j) : "";
      setUsersWith([...NewAll]);
      if (currentDirect && +currentDirect.id === fromBlock)
        {setCurrentDirect(null);}
      setFromBlock(null);
    };
  }, [fromBlock]);

  useEffect(() => {
    if (usersWith !== undefined && user.userId && unfromBlock && unfromBlock !== +user.userId) {
      const i = usersWith.findIndex(userX => +userX.id === +user.userId);
      const j = usersWith.find(userX => +userX.id === +user.userId);
      j ? j.blockedFrom = j.blockedFrom.filter((u: UserChat) => +u.id !== unfromBlock) : "";
      const NewAll = usersWith;
      j ? NewAll.splice(i, 1, j) : "";
      setUsersWith([...NewAll]);
      setUnfromBlock(null);
    };
  }, [unfromBlock]);

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
        const i = usersWith.findIndex(user => +user.id === +toBlock.id);
        const j = getUser(+user.userId)
        j ? toBlock.blockedFrom.push(j) : "";
        const NewOthers = usersWith;
        NewOthers.splice(i, 1, toBlock);
        setUsersWith([...NewOthers]);
      }
      if (currentDirect && toBlock && +currentDirect.id === +toBlock.id) 
        {setCurrentDirect(null)};
      setToBlock(null);
    }
  }, [toBlock]);

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
        toUnblock.blockedFrom = toUnblock.blockedFrom.filter((u: UserChat) => +u.id !== +user.userId);
        const NewOthers = usersWith;
        NewOthers.splice(i, 1, toUnblock);
        setUsersWith([...NewOthers]);
      }
      setToUnblock(null);
    }
  }, [toUnblock]);

    return (
        <>
        <div className="userWith">
           { usersWith && usersWith.map((o) => (
            +o?.id !== +user.userId ?
            <div  key={o?.id} className={amIBlocked(o?.id)} >
                <Link to={'/game/play'} onClick={() => inviteGame(o?.id)}> <i className="fa fa-gamepad" aria-hidden="true"  ></i></Link>
                <Link to={`/users/profile/${o?.id}`} className="profile-link"> <i className="fa fa-address-card-o" aria-hidden="true"></i>   </Link>
                <div className="fname" onClick={()=> {getDirect(o)}} >
                    <div className="chatOnlineImgContainer">
                        <MyAvatar authCtx={user} id={o?.id} style="xs" avatar={o?.avatar} ftAvatar={o?.ftAvatar}/>
                    </div>
                    <span className="chatOnlineName"> {o?.username} </span>
                </div>
                { !o.blockedFrom.find((u: UserChat)=>(+user.userId === +u?.id)) ?
                <button className="chatSubmitButton" onClick={() => {setToBlock(o)}} >
                    <i className="fa fa-unlock" aria-hidden="true"></i>
                </button>
                :
                <button className="chatSubmitButton2" onClick={() => {setToUnblock(o)}} >
                    <i className="fa fa-lock" aria-hidden="true"></i>
                </button>}
            </div>
            : <span className="noConversationText2" > New here ?... </span>
            ))}
        </div>
        </>
    );
}
