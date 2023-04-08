import { useEffect, useContext, useState, useRef, FormEvent } from 'react'
import { Link } from "react-router-dom";
import AuthContext from '../../store/AuthContext';
import useSocket from '../../service/socket';
import MessagesInput from "./MessagesInput"
import Conversation from "./channels/Conversation"
import ConversationReq from "./channels/ConversationRequest"
import MessageReq from "./message/message.req"
import Fetch from "../../interfaces/Fetch"
import Message2 from "./message/message"
import MessageD from "./message/messageD"
import '../../style/Chat.css'
import '../../style/Friends.css';
import React from 'react';
import PopupChallenge from './PopupChallenge';
import MyAvatar from '../user/Avatar';
import Channels from './channels/Channels';
import UpdateChannelsInList from './channels/UpdateChannelsInList';
import {RoomMessage, DirectMessage, UserChat, ChatRoom} from "../interfaces/iChat";


function Chat() {
  const user = useContext(AuthContext);
  const id = user.userId;
  const [onlineUsers, setOnlineUsers] = useState<UserChat[]> ([]);
  const [AMessageD, setAMessageD] = useState<DirectMessage> (null);
  const [AMessageChat, setAMessageChat] = useState<RoomMessage> (null);
  const [AConversation, setAConversation] = useState (null);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState<ChatRoom> (null);
  const [currentDirect, setCurrentDirect] = useState<UserChat> (null);
  const [messages2, setMessages2] = useState<RoomMessage[]> ([]);
  const [messagesD, setMessagesD] = useState<DirectMessage[]> ([]);
  const [newMessage2, setNewMessage2] = useState<RoomMessage> (null);
  const [newMessageD, setNewMessageD] = useState<DirectMessage> (null);
  const [otherUsers, setOtherUsers] = useState <UserChat[]> ([]);
  const [allUsers, setAllUsers] = useState <UserChat[]> ([]);
  const [toBlock, setToBlock] = useState(null);
  const [toUnblock, setToUnblock] = useState(null);
  const [fromBlock, setFromBlock] = useState<number>();
  const [unfromBlock, setUnfromBlock] = useState<number>();
  const [invited, setInvited] = useState<UserChat> ();
  const [sendMessage, addListener] = useSocket()
  const scrollRef: RefObject<HTMLDivElement> = useRef(null);
///////////////////////////////////////////////////////////
// Partie 1 : set up et Ecoute les messages du GATEWAY CHAT
///////////////////////////////////////////////////////////

  useEffect(() => {
    addListener("getMessageRoom", (data) => setAMessageChat({
      authorId: data.authorId,
      chatroomId: data.chatroomId,
      content: data.content,
      createdAt: Date.now(),
    }))
    
    addListener("getMessageDirect", (data)=> setAMessageD({
      content: data.content,
      author: data.author,
      receiver: data.receiver,
      createdAt: Date.now(),
    }));
  });

  useEffect(() => {
    addListener("getConv", data => setAConversation({
      name: data.content.name,
      avatar: data.content.avatar,
    }));
  });

  useEffect(() => {
    sendMessage("addUserChat", user);
    return () => {
      sendMessage("removeUserChat", user);
    }
  },[user])

  useEffect(() => {
    addListener("getUsersChat", users => {
      setOnlineUsers(users);
    });
  });

  useEffect(() => {
    addListener("wasInvited", data => {
      setInvited(data.from.username);
    });
  });

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
    sendMessage("getUsers", users => {
      setOnlineUsers(users);
    });
  })

  useEffect(() => {
    AMessageChat && currentChat?.id === AMessageChat.chatroomId &&
    setMessages2(prev=>[...prev, AMessageChat]);
  },[AMessageChat, currentChat])

  useEffect(() => {
    AMessageD && currentDirect?.id === AMessageD.sender &&
    setMessagesD(prev=>[...prev, AMessageD]);
  },[AMessageD, currentDirect])

  useEffect(() => {
    AConversation && setConversations(prev=>[AConversation, ...prev]);
  }, [AConversation]);



////////////////////////////////////////////////
// Partie II : va chercher les infos de la base de donnée
////////////////////////////////////////////////

  async function getAllUsersWithBlocked(token: string) {
    const response = await Fetch.fetch(token, "GET", `users\/block\/users`);
    setAllUsers(response);
    setOtherUsers(response.filter(u => !(onlineUsers.some(e => +e.userId.userId === +u.id))));
  };

  useEffect(() => {
    getAllUsersWithBlocked(user.token);
  }, []);


  useEffect(() => {
    async function getAllConv(user: AuthContext) {
      const response = await ConversationReq.getAll(user);
      setConversations(response);
    };
    getAllConv(user);
  }, []);

  useEffect(() => {
    if (currentChat)
    {
      async function getMess() {
        try {
          const response = await Fetch.fetch(user.token, "GET", `chat-mess\/room`, currentChat?.id);
          setMessages2(response);
          sendMessage("userRoom", {
            userId: user.userId,
            roomId: currentChat.id,
          })
        } catch(err) {
          console.log(err);
        }
      };
      getMess();
    }
  }, [currentChat]);

  useEffect(() => {
    if (currentDirect)
    {
      async function getDirMess() {
        try {
          if (currentDirect?.userId)
            { setMessagesD(await Fetch.fetch(user.token, "GET", `dir-mess`, id, currentDirect?.userId))}
          else
            { setMessagesD(await Fetch.fetch(user.token, "GET", `dir-mess`, id, currentDirect?.id))};
        } catch(err) {
          console.log(err);
        }
      };
      getDirMess();
    }
  }, [currentDirect]);


////////////////////////////////////////////////
// Partie III : Gestion Block / unblock / I am blocked ...
////////////////////////////////////////////////

  useEffect(() => {
    if (allUsers !== undefined && user.userId && fromBlock && fromBlock !== user.userId.userId) {
      const i = allUsers.findIndex(userX => +userX.id === +id);
      const j = allUsers.find(userX => +userX.id === +id);
      j?.blockedFrom.push(fromBlock);
      const NewAll = allUsers;
      NewAll.splice(i, 1, j);
      setAllUsers([...NewAll]);
      setFromBlock(null);
    };
  }, [fromBlock]);

  useEffect(() => {
    if (allUsers !== undefined && user.userId && unfromBlock !== user.userId.userId) {
      const i = allUsers.findIndex(userX => +userX.id === +id);
      const j = allUsers.find(userX => +userX.id === +id);
      j.blockedFrom = j.blockedFrom.filter(u => +u.id !== unfromBlock);
      j.blockedFrom = j.blockedFrom.filter(i => +i !== unfromBlock);
      const NewAll = allUsers;
      NewAll.splice(i, 1, j);
      setAllUsers([...NewAll]);
      setUnfromBlock(null);
    };
  }, [unfromBlock]);

  useEffect(() => {
    if (toBlock)
    {
      sendMessage("toBlock", {
        blockTo: +toBlock.id,
        blockFrom: +id,
      })
      async function blockUser() {
        try {
          const res = await Fetch.postBlock(user.token, toBlock.id, user.userId);
        } catch(err) {console.log(err)}
      };
      blockUser();
      if (onlineUsers && onlineUsers.find(userX => +userX.userId.userId === +toBlock.id)) {
        const i = allUsers.findIndex(userX => +userX.id === +toBlock.id);
        toBlock.blockedFrom.push(+user.userId);
        const NewAll = allUsers;
        NewAll.splice(i, 1, toBlock);
        setAllUsers([...NewAll]);
      }
      if (otherUsers && otherUsers.find(user => +user.id === +toBlock.id)) {
        const i = otherUsers.findIndex(user => +user.id === +toBlock.id);
        toBlock.blockedFrom.push(+user.userId);
        const NewOthers = otherUsers;
        NewOthers.splice(i, 1, toBlock);
        setOtherUsers([...NewOthers]);
      }
      setToBlock(null);
    }
  }, [toBlock]);

  useEffect(() => {
    if (toUnblock)
    {
      sendMessage("toUnblock", {
        blockTo: +toUnblock.id,
        blockFrom: +id,
      })
      async function unblockUser() {
        try {
          const res = await Fetch.postUnblock(user.token, toUnblock.id, user.userId);
        } catch(err) {console.log(err)}
      };
      unblockUser();
      if (onlineUsers && onlineUsers.find(userX => +userX.userId.userId === +toUnblock.id)) {
        const i = allUsers.findIndex(userX => +userX.id === +toUnblock.id);
        toUnblock.blockedFrom = toUnblock.blockedFrom.filter(u => +u.id !== +user.userId);
        toUnblock.blockedFrom = toUnblock.blockedFrom.filter(i => +i !== +user.userId);
        const NewAll = allUsers;
        NewAll.splice(i, 1, toUnblock);
        setAllUsers([...NewAll]);
      }
      if (otherUsers && otherUsers.find(user => +user.id === +toUnblock.id)) {
        const i = otherUsers.findIndex(user => +user.id === +toUnblock.id);
        toUnblock.blockedFrom = toUnblock.blockedFrom.filter(u => +u.id !== +user.userId);
        toUnblock.blockedFrom = toUnblock.blockedFrom.filter(i => +i !== +user.userId);
        const NewOthers = otherUsers;
        NewOthers.splice(i, 1, toUnblock);
        setOtherUsers([...NewOthers]);
      }
      setToUnblock(null);
    }
  }, [toUnblock]);


////////////////////////////////////////////////
// Partie IV : fonctions ...
////////////////////////////////////////////////

  const getUser = (userId: number) => {
    return allUsers.find(user => +user?.id === +userId);
  };

  const amIBlocked = (userXid: string | number) : string => {
    if (getUser(+id)?.blockedFrom.find(u => +u.id === +userXid || u === +userXid))
      { return "chatOnlineNotFriend"; }
    else
      {return "chatOnlineFriend";}
  };

  const isHeBlocked = (userXid) => {
    const i = getUser(userXid);
    if (i && i.blockedFrom && !i?.blockedFrom.find((u)=>(+id === +u?.id)) && !i.blockedFrom.find((i)=>(+id === +i)))
      {return (true);};
    }

  const getDirect = (userX) => {
    const gUser = getUser(+id);
    if (gUser && (gUser.blockedFrom.find(u => +u.id === +userX.userId) === undefined ) && (gUser.blockedFrom.find((u)=> +userX.userId === +u) === undefined ))
    {
      setCurrentDirect(userX);
      setCurrentChat(null);
    }
  }

  const inviteGame = (playerId) => {
    console.log(playerId);
    sendMessage("InviteGame", {
      author: +id,
      player: +playerId,
    });
  }


////////////////////////////////////////////////
// Partie V : handle submit...
////////////////////////////////////////////////

// Chat message
  const handleSubmit = async (e: FormEvent)=> {
    e.preventDefault();
    const message2 = {
      authorId: +id,
      content: newMessage2,
      chatroomId: currentChat.id,
    };

    sendMessage("sendMessageRoom", {
      authorId: +id,
      chatroomId: +currentChat?.id,
      content: newMessage2,
    })

    try {
      const res = await MessageReq.postMess(user, message2);
      setMessages2([...messages2, res]);
      setNewMessage2("");
    } catch(err) {console.log(err)}
  }

  
// Direct message
  const handleSubmitD = async (e: FormEvent)=> {
    e.preventDefault();
    const r = currentDirect?.userId ? +currentDirect?.userId : +currentDirect?.id;
    const messageD = {
      author: +id,
      content: newMessageD,
      receiver: r,
    };

    if (currentDirect?.userId)
    {
      sendMessage("sendMessageDirect", {
        author: +id,
        receiver: +currentDirect?.userId,
        content: newMessageD,
      })
    }
    try {
      const res2 = await MessageReq.postDirMess(user, messageD);
      setMessagesD([...messagesD, res2]);
      setNewMessageD("");
    } catch(err) {console.log(err)}
  }


////////////////////////////////////////////////
// Partie VI : Scroll to view
////////////////////////////////////////////////


  useEffect(() => {
    scrollRef.current?.scrollIntoView({behaviour: "smooth"})
  }, [messages2]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({behaviour: "smooth"})
  }, [messagesD]);

  const handleFileChange = (event: FormEvent<HTMLInputElement>) => {
  setSelectedFile(event.target.files[0]);
};

return (
  <>
  {" "}

      <div className="messenger">
        <div className="chatMenu"><UpdateChannelsInList
          currentChat={currentChat}
          currentDirect={currentDirect}
          setCurrentChat={setCurrentChat}
          setCurrentDirect={setCurrentDirect}
          /></div>
          <div className="line-chat"></div>
        <div className="chatBox">
          <div className="chatBoxW">
              <PopupChallenge triger={invited} setTriger={setInvited}> <h3></h3></PopupChallenge>
          {
            currentChat ?
            <>
              <div className="chatBoxTop">
                { messages2.length ?
                  messages2.map((m) => (
                    <div key={m?.createdAt} ref={scrollRef}>
                      <Message2 message2={m} user={getUser(m?.authorId)} authCtx={user} own={m?.authorId === +id} />
                    </div>
                  )) : <span className="noConversationText2" > No message in this room yet. </span>
                }
              </div>
              <div className="chatBoxBottom">
                <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage2(e.target.value)}
                    value={newMessage2}
                ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
              </div>
            </>
            :
            currentDirect ?
              <>
              <div className="chatBoxTop">
                { messagesD.length ?
                    messagesD?.map((m) => (
                      <div key={m.createdAt} ref={scrollRef}>
                        <MessageD messageD={m} user={getUser(m.author)} authCtx={user} own={m?.author === +id} />
                      </div>
                  )) : <span className="noConversationText2" > No message with this friend yet. </span>
                }
              </div>
              <div className="chatBoxBottom">
                <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessageD(e.target.value)}
                    value={newMessageD}
                ></textarea>
                {currentChat ?
                  <>
                    <button className="chatSubmitButton" onClick={handleSubmit}>
                      Send
                    </button>
                  </>
                  :
                  <>
                    <button className="chatSubmitButton" onClick={handleSubmitD}>
                      Send
                    </button>
                  </>
                }
              </div>
            </>
              : <span className="noConversationText" > Open a Room or choose a friend to start a chat. </span>
          }
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineW">
            <div className="chatOnline">
              { onlineUsers ? onlineUsers?.map((o) => (
                +o?.userId.userId !== +id ?
                <div  key={o?.userId.userId} className={amIBlocked(o?.userId.userId)}  >
                    <Link to={'/game/play'} onClick={() => inviteGame(o?.userId.userId)}> <i className="fa fa-gamepad" aria-hidden="true"  ></i></Link>
                    <Link to={`/users/profile/${o?.userId.userId}`} className="profile-link"> <i className="fa fa-address-card-o" aria-hidden="true"></i>   </Link>
                  <div className="fname" onClick={()=> {getDirect(o?.userId)}} >
                    <div className="chatOnlineImgContainer">
                     <MyAvatar authCtx={user} id={o?.userId.userId} style="xs" avatar={o?.userId.avatar} ftAvatar={o?.userId.ftAvatar}/>
                        <div className="chatOnlineBadge"></div>
                      </div>
                      <span className="chatOnlineName"> {o?.userId.username} </span>
                    </div>
                    { isHeBlocked(o.userId.userId) ?
                      <button className="chatSubmitButton" onClick={() => {setToBlock(getUser(o.userId.userId))}} >
                        <i className="fa fa-unlock" aria-hidden="true"></i>
                      </button>
                     :
                       <button className="chatSubmitButton2" onClick={() => {setToUnblock(getUser(o.userId.userId))}} >
                        <i className="fa fa-lock" aria-hidden="true"></i>
                      </button>
                    }
                  </div>
                : null
                )) : null
              }
              { otherUsers ? otherUsers?.map((o) => (
                +o?.id !== +id && !onlineUsers.find(u => +u.userId.userId === +o?.id) ?
                  <div  key={o?.id} className={amIBlocked(o?.id)} >
                    <Link to={'/game/play'} onClick={() => inviteGame(o?.id)}> <i className="fa fa-gamepad" aria-hidden="true"  ></i></Link>
                    <Link to={`/users/profile/${o?.id}`} className="profile-link"> <i className="fa fa-address-card-o" aria-hidden="true"></i>   </Link>
                    <div className="fname" onClick={()=> {getDirect(o)}} >
                      <div className="chatOnlineImgContainer">
                        <MyAvatar authCtx={user} id={o?.id} style="xs" avatar={o?.avatar} ftAvatar={o?.ftAvatar}/>
                      </div>
                      <span className="chatOnlineName"> {o?.username} </span>
                    </div>
                    { !o.blockedFrom.find((u)=>(+user.userId === +u?.id)) && !o.blockedFrom.find((i)=>(+user.userId === +i)) ?
                      <button className="chatSubmitButton" onClick={() => {setToBlock(o)}} >
                          <i className="fa fa-unlock" aria-hidden="true"></i>
                      </button>
                     :
                       <button className="chatSubmitButton2" onClick={() => {setToUnblock(o)}} >
                        <i className="fa fa-lock" aria-hidden="true"></i>
                      </button>
                    }
                  </div>
                : null
                )) : <span className="noConversationText2" > Nobody in the air... </span>
              }
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default Chat;
