import { useEffect, useContext, useState, useRef, FormEvent } from 'react'
import AuthContext from '../../store/AuthContext';
import io, { Socket } from "socket.io-client";
import MessagesInput from "./MessagesInput"
// import Messages from "./Messages"
import Conversation from "./conversation/conversation"
import ConversationApi from "./conversation/conversation.api"
import MessageApi from "./message/message.api"
import Message2 from "./message/message"
import MessageD from "./message/messageD"
//import ChatOnline from "./chatOnline/chatOnline"
import ConversationDto from "./conversation/conversation.dto"
import MessageDto from "./message/message.dto"
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
  const [conversations, setConversations] = useState<ConversationDto[]> ([]);
  const [currentChat, setCurrentChat] = useState (null);
  const [currentDirect, setCurrentDirect] = useState (null);
  const [messages2, setMessages2] = useState<MessageDto[]> ([]);
  const [messagesD, setMessagesD] = useState<MessageDDto[]> ([]);
  const [newMessage2, setNewMessage2] = useState ("");
  const [newMessageD, setNewMessageD] = useState ("");
  const scrollRef = useRef();
  const authCtx = useContext(AuthContext);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState('');





  useEffect(() => {
    socket.current = io("ws://localhost:8001")
    socket.current.on("getMD", (data)=> {
      setAMessageD({
        sender: data.sender,
        receiver: data.receiver,
        content: data.content,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    AMessageD && currentDirect?.id === AMessageD.sender &&
    setMessagesD(prev=>[...prev, AMessageD]);
    },[AMessageD, currentDirect])

  useEffect(() => {
    socket.current.emit("addUser", user);
    socket.current.on("getUsers", users => {
      setOnlineUsers(users);
    });
  },[user])

  useEffect(() => {
    async function getAllConv() {
      const response = await ConversationApi.getAll();
      setConversations(response);
     };
    getAllConv();
  }, []);

  useEffect(() => {
    if (currentChat)
    {
      async function getMess() {
        try {
          const response = await MessageApi.getMess(currentChat?.id);
          setMessages2(response);
       //   socket?.current.emit("userRoom", {
       //     user: user,
       //     room: currentChat,
       //   })
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
        const response = await MessageApi.getDirMess(id, currentDirect?.userId);
        setMessagesD(response);
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
    try {
      const res = await MessageApi.postMess(message2);
      setMessages2([...messages2, res]);
      setNewMessage2("");
 //     socket?.emit("message2", message2)
    } catch(err) {console.log(err)}
  }

  const handleSubmitD = async (e)=> {
    console.log(+currentDirect?.userId);
    e.preventDefault();
      //  console.log("check error Dir");
    const messageD = {
      author: +id,
      content: newMessageD,
      receiver: +currentDirect?.userId,
    };

    socket?.current.emit("sendMD", {
        author: +id,
        receiver: +currentDirect?.userId,
        content: newMessageD,
      })

    try {
      const res2 = await MessageApi.postDirMess(messageD);
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


const handleChannelNameChange = (event: FormEvent) => {
  setChannelName(event.target.value);
};

const [channels, setChannelName] = useState([]);

const createNewChannel = async (event: FormEvent) => {
  event.preventDefault();
  const response = await fetch(`http://localhost:3000/chatroom2/create_channel`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${authCtx.token}`
    },
    body: JSON.stringify({name: channels}),
  });
  const data = await response.json();
  console.log(data);
};

const [showPopUp, setShowPopUp] = useState(false);

return (
<>
{" "}

<div className="messenger">
  <div className="chatMenu">
	<div className="chatMenuW">
	  <div>
		  <form onSubmit={createNewChannel}>
        <label>
        New channel name:
        <input type="text" value={channels} onChange={handleChannelNameChange} />
        </label>
        <button type="submit" onClick={() => setShowPopUp(true)}>Create new channel</button>
        {showPopUp ? (
            <PopUp
            title="Creation d'un nouveau Channel"
            message="Choisissez les options de votre channel"
            onConfirm={() => setShowPopUp(false)}
        />
        ) : null}
		  </form>
		</div>
	  <input placeholder="Search for Chatrooms" className="chatMenuInput" />
		{ conversations.map((c) => (
		  <div onClick= {() => {setCurrentChat(c); setCurrentDirect(null)}} >
			<Conversation conversation={c}/>
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
			  <div ref={scrollRef}>
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
			  <div ref={scrollRef}>
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
				SendROOM
			  </button>
			</>
			:
			<>
			  <button className="chatSubmitButton" onClick={handleSubmitD}>
				SendFriend
			  </button>
			</>
		  }
		</div>
	  </>
		: <span className="noConversationText" > Open  </span>
	  }
	</div>
  </div>
  <div className="chatOnline">
	<div className="chatOnlineW">
<div className="chatOnline">
{ onlineUsers ? onlineUsers?.map((o) => (
  +o?.userId.userId !== +id ?
  <>
  <div className="chatOnlineFriend" onClick={()=> {setCurrentDirect(o?.userId); setCurrentChat(null)}} >
	<div className="chatOnlineImgContainer">
	  <img  className="chatOnlineImg"
		src={ o?.userId.avatar ? o?.avatar : "http://localhost:8080/public/images/no-avatar.png"}
		alt=""
	  />
	  <div className="chatOnlineBadge"></div>
	</div>
	<span className="chatOnlineName"> {o?.userId.username} </span>
  </div>
  </>
  : null
)) : <span className="noConversationText2" > Nobody online. </span>}
</div>
	</div>
  </div>
</div>
</>
)
}

export default Chat;