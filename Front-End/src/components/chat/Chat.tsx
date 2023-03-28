import { useEffect, useContext, useState, useRef, FormEvent } from 'react'
import AuthContext from '../../store/AuthContext';
import io, { Socket } from "socket.io-client";
import MessagesInput from "./MessagesInput"
import Conversation from "./conversation/conversation"
import ConversationReq from "./conversation/conversation.req"
import MessageReq from "./message/message.req"
import Message2 from "./message/message"
import MessageD from "./message/messageD"
import './Chat.css'
import React from 'react';
import PopUp from './PopUpChannel';

function Chat() {
  const socket = useRef();
  const [messages, setMessages] = useState<string[]>([]);
  const user = useContext(AuthContext);
  const isLoggedIn = user.isLoggedIn;
  const id = user.userId;
  const [onlineUsers, setOnlineUsers] = useState<UserDto[]> ([]);
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
  const [otherUsers, setOtherUsers] = useState ("");
  const scrollRef = useRef();
  const authCtx = useContext(AuthContext);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState('');
  const [newConversation, setNewConversation] = useState([]);

  useEffect(() => {
    const url = "http://localhost:3000/users/";
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
      setOtherUsers(data.filter(u => !(onlineUsers.some(e => e.id === u.id))));
      }
    fetchUsers();
  }, [onlineUsers])

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
      setOnlineUsers(users);
    });
  })

  useEffect(() => {
    async function getAllConv() {
      const response = await ConversationReq.getAll();
      setConversations(response);
    };
    getAllConv();
  }, []);
/*
  useEffect(() => {
    async function getAllUsers() {
      const response = await .getAll();
      setAllUsers(response);
    };
    getAllUsers();
  }, []);
 */
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

  const handleSubmit = async (e)=> {
    e.preventDefault();
    console.log("check error M2");
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

  const handleSubmitD = async (e)=> {
    e.preventDefault();
    const r = currentDirect?.userId ? +currentDirect?.userId : +currentDirect?.id;
    const messageD = {
      author: +id,
      content: newMessageD,
      receiver: r,
    };

//    console.log("VVVVVVVVVVVVVV");
//     console.log(currentDirect?.userId);

//    if (onlineUsers.find(user => +user.userId.userId === currentDirect?.userId.userId))
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

  useEffect(() => {
    scrollRef.current?.scrollIntoView({behaviour: "smooth"})
  }, [messages2]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({behaviour: "smooth"})
  }, [messagesD]);

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
                      <Message2 message2={m} own={m.authorId === +id} />
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
                        <MessageD messageD={m} own={m?.author === +id} />
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
                  <div  key={o?.userId} className="chatOnlineFriend" onClick={()=> {setCurrentDirect(o?.userId); setCurrentChat(null)}} >
                    <div className="chatOnlineImgContainer">
                      <img  className="chatOnlineImg"
                        src={ o?.userId.avatar ? o?.avatar : "http://localhost:8080/public/images/no-avatar.png"}
                        alt=""
                      />
                      <div className="chatOnlineBadge"></div>
                    </div>
                    <span className="chatOnlineName"> {o?.userId.username} </span>
                  </div>
                : null
                )) : <span className="noConversationText2" > Nobody online. </span>
              }
              { otherUsers ? otherUsers?.map((o) => (
                +o?.id !== +id && !onlineUsers.find(u => +u.userId.userId === +o?.id) ?
                  <div  key={o?.userId} className="chatOnlineFriend" onClick={()=> {setCurrentDirect(o); setCurrentChat(null)}} >
                    <div className="chatOnlineImgContainer">
                      <img  className="chatOnlineImg"
                        src={ o?.avatar ? o?.avatar : "http://localhost:8080/public/images/no-avatar.png"}
                        alt=""
                      />
                    </div>
                    <span className="chatOnlineName"> {o?.username} </span>
                  </div>
                : null
                )) : <span className="noConversationText2" > Nobody online. </span>
              }
            </div>
          </div>
        </div>
        <div className="allOtherUsers">

        </div>
      </div>
    </>
  )
}

export default Chat;
