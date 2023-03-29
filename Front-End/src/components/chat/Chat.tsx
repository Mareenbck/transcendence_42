import { useEffect, useContext, useState, useRef, FormEvent } from 'react'
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
import React from 'react';
import PopUp from './PopUpChannel';

function Chat() {
  const socket = useRef();
  // const [messages, setMessages] = useState<string[]>([]);
  const user = useContext(AuthContext);
  // const isLoggedIn = user.isLoggedIn;
  const id = user.userId;
  const [onlineUsers, setOnlineUsers] = useState<UserDto[]> ([]);
  const [onlineUsers2, setOnlineUsers2] = useState ([]);
  const [AMessageD, setAMessageD] = useState (null);
  const [AMessageChat, setAMessageChat] = useState (null);
  const [AConversation, setAConversation] = useState (null);
  const [conversations, setConversations] = useState<ConversationDto[]> ([]);
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
  const [newConversation, setNewConversation] = useState([]);
  const [toBlock, setToBlock] = useState(null);
  const [toUnblock, setToUnblock] = useState(null);
  const [didBlock, setDidBlock] = useState(null);
  const [wasBlocked, setWasBlocked] = useState(null);

  useEffect(() => {
    async function getAllUsersWithBlocked(user: AuthContext) {
      const response = await ChatReq.getAllUsersWithBlocked();
      setAllUsers(response);
      setOtherUsers(response.filter(u => !(onlineUsers.some(e => +e.userId.userId === +u.id))));
    };
       getAllUsersWithBlocked();
    let online = [];
    onlineUsers.map(u=>{
      online.push(getUser(+u.userId.userId));
    });
    setOnlineUsers2(online);

  }, []);

  useEffect(() => {
    socket.current = io("ws://localhost:8001")
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

  useEffect(() => {
    socket.current.emit("addUser", user);
  },[user])
  
  useEffect(() => {
    socket.current.on("getUsers", users => {
      let online = [];
//      users.map(u => {
//        online.push(getUser(+u.userId.userId));
 //     });
 ///     setOnlineUsers(online);
  //    console.log(online);
      setOnlineUsers(users);
    });
  });
  
  useEffect(() => {
    async function getAllConv() {
      const response = await ConversationReq.getAll();
      setConversations(response);
    };
    getAllConv();
  }, []);

  useEffect(() => {
    if (currentChat)
    {
      async function getMess() {
        try {
          const response = await MessageReq.getMess(currentChat?.id);
          setMessages2(response);
          socket?.current.emit("userRoom", {
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
            { setMessagesD(await MessageReq.getDirMess(id, currentDirect?.userId))}
          else
            {setMessagesD(await MessageReq.getDirMess(id, currentDirect?.id))};
        } catch(err) {
          console.log(err);
        }
      };
      getDirMess();
    }
  }, [currentDirect]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({behaviour: "smooth"})
  }, [messages2]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({behaviour: "smooth"})
  }, [messagesD]);

  useEffect(() => {
    socket.current.on("wasBlocked", data => {
console.log(data);
console.log(+data.id !== +id);
      if (+data.id !== +id)
      {
  //      if (onlineUsers && onlineUsers.find(userX => +userX.userId.userId === +data.id)) {
       console.log("dddddddddd 2");
          const i = allUsers.findIndex(userX => +userX.id === +data.id);
          const j = allUsers.find(userX => +userX.id === +data.id);
          j.blockedFrom.push(+data.id);
          const NewAll = allUsers;
          NewAll.splice(i, 1, j);
          setAllUsers([...NewAll]);
    //    setOnlineUsers([...onlineUsers]);
   //     }
      }
    })

    socket.current.on("wasUnblocked", data => {
      if (+data.id !== +id)
      {
        if (onlineUsers && onlineUsers.find(userX => +userX.userId.userId === +data.id)) {
          const i = allUsers.findIndex(userX => +userX.id === +data.id);
          const j = allUsers.find(userX => +userX.id === +data.id);
          j.blockedFrom = j.blockedFrom.filter(u => +u.id !== +id);
          j.blockedFrom = j.blockedFrom.filter(i => +i !== +id);
          const NewAll = allUsers;
          NewAll.splice(i, 1, toUnblock);
          setAllUsers([...NewAll]);
        }
      }
    })
  }, []);

  useEffect(() => {
    if (toBlock)
    {
      socket?.current.emit("toBlock", {
        blockTo: +toBlock.id,
        blockFrom: +id,
      })

      console.log("fffffffffffffffffff");
            console.log(toBlock.id);
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
    //    setOnlineUsers([...onlineUsers]);
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
  }, [toBlock, toUnblock]);

  const getAvatar = (userId) => {
    const u = allUsers.find(user => +user?.id === +userId);
    return (u && u.avatar);
  };

  const getUser = (userId) => {
    return allUsers.find(user => +user?.id === +userId);
  };

  const amIBlocked = (userXid) : string => {
    return getUser(+id)?.blockedFrom.find(u => +u.id === +userXid) ? "chatOnlineNotFriend" : "chatOnlineFriend";
  }

  const isHeBlocked = (userXid) => {
    const i = getUser(userXid);
    if (i && i.blockedFrom && !i?.blockedFrom.find((u)=>(+id === +u?.id)) && !i.blockedFrom.find((i)=>(+id === +i)))
      {return (true);};
    }

// !getUser(o.userId.userId).blockedFrom.find((u)=>(+id === +u?.id)) && !getUser(o.userId.userId).blockedFrom.find((i)=>(+id === +i)) ?


  const getDirect = (userX) => {
    const i = getUser(+id);
    console.log(i)
    if (i && !i.blockedFrom.find(u => +u.id === +userX.userId) && !i.blockedFrom.find((i)=> +id === +i))
    {
      setCurrentDirect(userX);
      setCurrentChat(null)
    }
  }

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
      const res = await MessageReq.postMess(message2);
      setMessages2([...messages2, res]);
      setNewMessage2("");
    } catch(err) {console.log(err)}
  }
  
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
      const res2 = await MessageReq.postDirMess(messageD);
      setMessagesD([...messagesD, res2]);
      setNewMessageD("");
    } catch(err) {console.log(err)}
  }
  
  const handleFileChange = (event: FormEvent<HTMLInputElement>) => {
	 setSelectedFile(event.target.files[0]);
  };

  const handleChannelNameChange = (e: FormEvent) => {
    setNewConversation(e.target.value);
  };

  const createNewConv = async (e: FormEvent) => {
    e.preventDefault();
    const newConv = {
      name: newConversation,
      avatar: ""
    };
  
    socket?.current.emit("sendConv", {
      author: +id,
      content: newConv,
    })
  
    try {
      const res = await ConversationReq.postRoom(user, newConv);
      setConversations([res, ...conversations]);
      setNewConversation("");
    } catch(err) {console.log(err)}
  };

  const [channels, setChannelName] = useState([]);
  const [showPopUp, setShowPopUp] = useState(false);

  return (
  <>
  {" "}
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuW">
          <div className="conversationListe">
            <form onSubmit={createNewConv}>
                <input type="text" placeholder="New channel name ? " className="chatMessageInput" value={newConversation} onChange={handleChannelNameChange} />
              <button className="chatSubmitButton" type="submit" onClick={() => setShowPopUp(true)}>Create new channel</button>
                  {showPopUp ? (
                    <PopUp
                  title="Creation d'un nouveau Channel"
                  message="Choisissez les options de votre channe    l"
                  onConfirm={() => setShowPopUp(false)}
              />
              ) : null}
            </form>
            { conversations.map((c) => (
              <div key={c.name + c.id} onClick= {() => {setCurrentChat(c); setCurrentDirect(null)}} >
                <Conversation conversation={c}/>
              </div>
            ))}
          </div>
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
                    <div key={m.id} ref={scrollRef}>
                      <Message2 message2={m} avatar={getAvatar(m.authorId)} own={m.authorId === +id} />
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
                      <div key={m.id} ref={scrollRef}>
                        <MessageD messageD={m} avatar={getAvatar(m.author)} own={m?.author === +id} />
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
                          Block
                      </button>
                     :
                       <button className="chatSubmitButton2" onClick={() => {setToUnblock(getUser(o.userId.userId))}} >
                          UnBlock
                      </button>
                    }
                  </div>
                : null
                )) : null
              }
              { otherUsers ? otherUsers?.map((o) => (
                +o?.id !== +id && !onlineUsers.find(u => +u.userId.userId === +o?.id) ?
                  <div  key={o?.id} className={amIBlocked(o?.id)} >
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
                          Block
                      </button>
                     :
                       <button className="chatSubmitButton2" onClick={() => {setToUnblock(o)}} >
                          UnBlock
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
