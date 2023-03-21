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

	const createNewChannel = async (event: FormEvent) => {
		event.preventDefault();
		const response = await fetch(`http://localhost:3000/chatroom2/create_channel`,
		  {
			method: "POST",
			headers: {
			  "Content-type": "application/json",
			  Authorization: `Bearer ${authCtx.token}`
			},
			body: JSON.stringify({name: "new"}),
		  }
		)
		console.log("DATA------>")
		const data = await response.json();
		console.log(data);
	  };

 return (
   <div>
	<form onSubmit={createNewChannel}>
		<button type="submit">Create new channel</button>
	</form>
   </div>
  );
 }

export default Chat;
