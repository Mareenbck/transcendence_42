import { useEffect, useContext, useState, useRef, FormEvent } from 'react'
import { Link } from "react-router-dom";
import AuthContext from '../../store/AuthContext';
import io, { Socket } from "socket.io-client";
import MessagesInput from "./MessagesInput"
import Conversation from "./conversation/conversation"
import ConversationReq from "./conversation/conversation.req"
import MessageReq from "./message/message.req"
import ChatReq from "./Chat.req"
import Message2 from "./message/message"
import MessageD from "./message/messageD"
import './Chat.css'
import '../../style/Friends.css';
import React from 'react';
import PopUp from './PopUpChannel';
import ChannelVisibility from './ChannelVisibility';


function Chat() {
  const socket = useRef();
  const user = useContext(AuthContext);
  const id = user.userId;
  const [onlineUsers, setOnlineUsers] = useState<UserDto[]> ([]);
  const [AMessageD, setAMessageD] = useState (null);
  const [AMessageChat, setAMessageChat] = useState (null);
  const [AConversation, setAConversation] = useState (null);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState (null);
  const [currentDirect, setCurrentDirect] = useState (null);
  const [messages2, setMessages2] = useState<MessageDto[]> ([]);
  const [messagesD, setMessagesD] = useState<MessageDDto[]> ([]);
  const [newMessage2, setNewMessage2] = useState ("");
  const [newMessageD, setNewMessageD] = useState ("");
  const [otherUsers, setOtherUsers] = useState <UserDto[]> ([]);
  const [allUsers, setAllUsers] = useState <UserDto[]> ([]);
  const scrollRef = useRef();
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState('');
  const [newConversation, setNewConversation] = useState("");
  const [toBlock, setToBlock] = useState(null);
  const [toUnblock, setToUnblock] = useState(null);
  const [fromBlock, setFromBlock] = useState<number>();
  const [unfromBlock, setUnfromBlock] = useState<number>();
  const [invite, setInvite] = useState ([]);
  const [channelName, setchannelName] = useState('');

///////////////////////////////////////////////////////////
// Partie 1 : set up et Ecoute les messages du GATEWAY CHAT
///////////////////////////////////////////////////////////

  useEffect(() => {
    socket.current = io("ws://localhost:8001")
//    socket.current.data.fromPage = "chat";

    socket.current.on("getMChat", (data)=> {
      setAMessageChat({
        authorId: data.authorId,
        chatroomId: data.chatroomId,
        content: data.content,
        createdAt: Date.now(),
      });
    })
    
    socket.current.on("getMD", (data)=> {
      setAMessageD({
        content: data.content,
        author: data.author,
        receiver: data.receiver,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    socket.current.on("getConv", data => {
      setAConversation({
        name: data.content.name,
        avatar: data.content.avatar,
      });
    });
  }, []);

  useEffect(() => {
    socket.current.emit("addUser", user);
  },[user])

  useEffect(() => {
    socket.current.on("getUsers", users => {
      setOnlineUsers(users);
    });
  });

  useEffect(() => {
    socket.current.on("notAuth", data => {
      window.location.replace('/root');
    });
  });

 useEffect(() => {
    socket.current.on("wasBlocked", data => {
      if (+data.id !== +id)
      { setFromBlock(+data.id);}
    });
  }, []);

  useEffect(() => {
    socket.current.on("wasUnblocked", data => {
      if (+data.id !== +id)
      { setUnfromBlock(+data.id);}
    });
  }, []);

  useEffect(() => {
    socket.current.emit("addUser", user);
  },[user])

  useEffect(() => {
    socket.current.on("getUsers", users => {
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

  async function getAllUsersWithBlocked(user: AuthContext) {
    const response = await ChatReq.getAllUsersWithBlocked(user);
    setAllUsers(response);
    setOtherUsers(response.filter(u => !(onlineUsers.some(e => +e.userId.userId === +u.id))));
  };

  useEffect(() => {
    getAllUsersWithBlocked(user);
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
      async function getMess(user: AuthContext) {
        try {
          const response = await MessageReq.getMess(user, currentChat?.id);
          setMessages2(response);
          socket?.current.emit("userRoom", {
            userId: user.userId,
            roomId: currentChat.id,
          })
        } catch(err) {
          console.log(err);
        }
      };
      getMess(user);
    }
  }, [currentChat]);

  useEffect(() => {
    if (currentDirect)
    {
      async function getDirMess(user: AuthContext) {
        try {
          if (currentDirect?.userId)
            { setMessagesD(await MessageReq.getDirMess(user, id, currentDirect?.userId))}
          else
            {setMessagesD(await MessageReq.getDirMess(user, id, currentDirect?.id))};
        } catch(err) {
          console.log(err);
        }
      };
      getDirMess(user);
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
      socket?.current.emit("toBlock", {
        blockTo: +toBlock.id,
        blockFrom: +id,
      })
      async function blockUser() {
        try {
          const res = await ChatReq.postBlock(user, toBlock.id);
        } catch(err) {console.log(err)}
      };
      blockUser(toBlock);
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
      socket?.current.emit("toUnblock", {
        blockTo: +toUnblock.id,
        blockFrom: +id,
      })
      async function unblockUser() {
        try {
          const res = await ChatReq.postUnblock(user, toUnblock.id);
        } catch(err) {console.log(err)}
      };
      unblockUser(toUnblock);
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

  const getAvatar = (userId) => {
    const u = allUsers.find(user => +user?.id === +userId);
    return (u && u.avatar);
  };

  const getName = (userId) => {
    const u = allUsers.find(user => +user?.id === +userId);
    return (u.username);
  };

  const getUser = (userId) => {
    return allUsers.find(user => +user?.id === +userId);
  };

  const amIBlocked = (userXid) : string => {
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
    const i = getUser(+id);
    if (i && (i.blockedFrom.find(u => +u.id === +userX.userId) === undefined ) && (i.blockedFrom.find((i)=> +id === +i) === undefined ))
    {
      setCurrentDirect(userX);
      setCurrentChat(null)
    }
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

    socket?.current.emit("sendMChat", {
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
      socket?.current.emit("sendMD", {
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

// Invite
  
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


const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowPopUp(true);
  };

  const handleCreateChannel = () => {
    setShowPopUp(true);
  };

const [showPopUp, setShowPopUp] = useState(false);


return (
  <>
  {" "}
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuW">
            <form onSubmit={handleFormSubmit}>
              <button onClick={handleCreateChannel}>Create new channel</button>
              {showPopUp && (
                  <PopUp
                  title="Création d'un nouveau channel"
                  message="Choisissez les options de votre channel"
                  onCancel={() => setShowPopUp(false)}
                  onClick={() => setShowPopUp(false)}
                  onSubmit={{handleFormSubmit}}
                  
                  >
                  </PopUp>
            )}
            </form>
            {conversations.map((c) => (
                <div key={c.name + c.id} onClick={() => {setCurrentChat(c); setCurrentDirect(null)}}>
                    <div className="conversation">
                      <div className="conversation-name">
                          <Conversation conversation={c}/>
                      </div>
                      <div className="conversation-icon">
                      <ChannelVisibility conversation={c}/>
                      </div>
                    </div>
                </div>
                ))}
            </div>
          </div>
        <div className="chatBox">
          <div className="chatBoxW">
          {
            currentChat ?
            <>
              <div className="chatBoxTop">
                { messages2.length ?
                  messages2.map((m) => (
                    <div key={m.createdAt} ref={scrollRef}>
                      <Message2 message2={m} avatar={getAvatar(m.authorId)} nameA={getName(m.authorId)} own={m.authorId === +id} />
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
                        <MessageD messageD={m} avatar={getAvatar(m.author)} nameA={getName(m.author)} own={m?.author === +id} />
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
                  <button className="chatSubmitButton" onClick={() => {setToInvite(getUser(o.userId.userId))}} >

                    <i className="fa fa-gamepad" aria-hidden="true"  ></i>

                  </button>

                    <Link to={`/users/profile/${o?.id}`} className="profile-link"> <i className="fa fa-address-card-o" aria-hidden="true"></i>   </Link>
                    <div className="fname" onClick={()=> {getDirect(o?.userId)}} >
                      <div className="chatOnlineImgContainer">
                        <img  className="chatOnlineImg"
                          src={ getAvatar(o?.userId.userId) ? getAvatar(o?.userId.userId) : "http://localhost:8080/public/images/no-avatar.png"}
                          alt=""
                        />
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
                  <i className="fa fa-gamepad" aria-hidden="true"  onClick={() => {setInvite(o)}}></i>



                    <Link to={`/users/profile/${o?.id}`} className="profile-link"> <i className="fa fa-address-card-o" aria-hidden="true"></i>   </Link>
                    <div className="fname" onClick={()=> {getDirect(o)}} >
                      <div className="chatOnlineImgContainer">
                        <img  className="chatOnlineImg"
                          src={ o?.avatar ? o?.avatar : "http://localhost:8080/public/images/no-avatar.png"}
                          alt=""
                        />
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
