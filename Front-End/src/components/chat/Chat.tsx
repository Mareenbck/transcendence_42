import { useEffect, useContext, useState, useRef } from 'react'
import AuthContext from '../../store/AuthContext';
import io, { Socket } from "socket.io-client"
import MessagesInput from "./MessagesInput"
import Messages from "./Messages"
import Conversation from "./conversation/conversation"
import ConversationApi from "./conversation/conversation.api"
import MessageApi from "./message/message.api"
import Message2 from "./message/message"
import ChatOnline from "./chatOnline/chatOnline"
import ConversationDto from "./conversation/conversation.dto"
import MessageDto from "./message/message.dto"
import './Chat.css'

function Chat() {
  const [socket, setSocket] = useState<Socket>(null)
  const [messages, setMessages] = useState<string[]>([])
  const send = (value: string) => {
    socket?.emit("message", value)
  }
  useEffect(() => {
    const newSocket = io("http://localhost:8001")
    setSocket(newSocket)
  }, [setSocket])

  const messageListener = (message: string) => {
    setMessages([...messages, message])
  }
  useEffect(() => {
    socket?.on("message", messageListener)
    return () => {
      socket?.off("message", messageListener)
    }
  }, [messageListener])

  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const id = authCtx.userId;
  const [conversations, setConversations] = useState<ConversationDto[]> ([]);
  const [currentChat, setCurrentChat] = useState (null);
  const [messages2, setMessages2] = useState<MessageDto[]> ([]);
  const [newMessage2, setNewMessage2] = useState ("");
  const scrollRef = useRef();

  useEffect(() => {
    async function getAllConv() {
      const response = await ConversationApi.getAll();
      setConversations(response);
     };
    getAllConv();
  }, []);

  useEffect(() => {
    async function getMess() {
      try {
        const response = await MessageApi.getMess(currentChat?.id);
        setMessages2(response);
      } catch(err) {
        console.log(err);
      }
     };
    getMess();
  }, [currentChat]);

  const handleSubmit = async (e)=> {
    e.preventDefault();
    const message2 = {
      authorId: +id,
      content: newMessage2,
      chatroomId: currentChat.id,
    };
    try {
      const res = await MessageApi.postMess(message2);
      setMessages2([...messages2, res]);
      setNewMessage2("");
    } catch(err) {console.log(err)}
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({behaviour: "smooth"})
  }, [messages2]);


  return (
    <>
      {" "}

      <MessagesInput send={send} />
      <Messages messages={messages} />

      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuW">
            <input placeholder="Search for Chatrooms" className="chatMenuInput" />
              { conversations.map((c) => (
                <div onClick= {() => setCurrentChat(c)} >
                  <Conversation conversation={c}/>
                </div>
              ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxW">
          {
            currentChat ? <>
            <div className="chatBoxTop">
              { messages2.length ?
                  messages2.map((m) => (
                    <div ref={scrollRef}>
                    {console.log("ttttt")}
                    {console.log(id)}
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
            </> : <span className="noConversationText" > Open a Room or choose a friend to start a chat. </span>
          }
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineW">
             <ChatOnline/>
            <ChatOnline/>
            <ChatOnline/>
            <ChatOnline/>
          </div>
        </div>
      </div>
</>
  )

}
export default Chat;
