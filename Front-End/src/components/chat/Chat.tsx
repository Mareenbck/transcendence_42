import { useEffect, useContext, useState, useRef } from 'react'
import AuthContext from '../../store/AuthContext';
import io, { Socket } from "socket.io-client";
import MessagesInput from "./MessagesInput"
import Conversation from "./conversation/conversation"
import ConversationApi from "./conversation/conversation.api"
import MessageApi from "./message/message.api"
import Message2 from "./message/message"
import MessageD from "./message/messageD"
import ConversationDto from "./conversation/conversation.dto"
import MessageDto from "./message/message.dto"
import './Chat.css'

function Chat() {
  const socket = useRef();
  const [messages, setMessages] = useState<string[]>([]);
  const user = useContext(AuthContext);
  const isLoggedIn = user.isLoggedIn;
  const id = user.userId;
  const [onlineUsers, setOnlineUsers] = useState<UserDto[]> ([]);
  const [AMessageD, setAMessageD] = useState (null);
  const [AMessageChat, setAMessageChat] = useState (null);
  const [conversations, setConversations] = useState<ConversationDto[]> ([]);
  const [currentChat, setCurrentChat] = useState (null);
  const [currentDirect, setCurrentDirect] = useState (null);
  const [messages2, setMessages2] = useState<MessageDto[]> ([]);
  const [messagesD, setMessagesD] = useState<MessageDto[]> ([]);
  const [newMessage2, setNewMessage2] = useState ("");
  const [newMessageD, setNewMessageD] = useState ("");
  const scrollRef = useRef();

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
    console.log(data);
      setAMessageD({
        content: data.content,
        author: data.author,
        receiver: data.receiver,
        createdAt: Date.now(),
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

      socket?.current.emit("sendMChat", {
        authorId: +id,
        chatroomId: +currentChat?.id,
        content: newMessage2,
      })

    try {
      const res = await MessageApi.postMess(message2);
      setMessages2([...messages2, res]);
      setNewMessage2("");
    } catch(err) {console.log(err)}
  }

  const handleSubmitD = async (e)=> {
    e.preventDefault();
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

  useEffect(() => {
    scrollRef.current?.scrollIntoView({behaviour: "smooth"})
  }, [conversations]);

  const handleChannelNameChange = (e: FormEvent) => {
    setNewConversation(e.target.value);
  };

  const [newConversation, setNewConversation] = useState([]);

  const createNewConv = async (e: FormEvent) => {
    e.preventDefault();
    const newConv = {
      name: newConversation,
      avatar: ""
    };
    try {
      const res = await ConversationApi.postRoom(user, newConv);
      setConversations([...conversations, res]);
      setNewConversation("");
    } catch(err) {console.log(err)}
  };


  return (
    <>
      {" "}


      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuW">
            <form onSubmit={createNewConv}>
              <label>
                New channel name:
                <input type="text" value={newConversation} onChange={handleChannelNameChange} />
              </label>
              <button type="submit">Create new channel</button>
            </form>
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
              : <span className="noConversationText" > Open a Room or choose a friend to start a chat. </span>
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
