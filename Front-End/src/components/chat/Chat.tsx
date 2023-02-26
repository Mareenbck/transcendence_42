import { useEffect, useContext, useState } from 'react'
import AuthContext from '../../store/AuthContext';
import io, { Socket } from "socket.io-client"
import MessagesInput from "./MessagesInput"
import Messages from "./Messages"
import Conversation from "./conversation/conversation"
import ConversationApi from "./conversation/conversation.api"
import Message2 from "./message/message"
import ChatOnline from "./chatOnline/chatOnline"
import ConversationDto from "./conversation/conversation.dto"
import './Chat.css'

function Chat() {
  const [socket, setSocket] = useState<Socket>()
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

  useEffect(() => {
    async function getAllConv() {
      const response = await ConversationApi.getAll();
      setConversations(response);
     };
    getAllConv();
  }, []);

  return (
    <>
      {" "}

      <MessagesInput send={send} />
      <Messages messages={messages} />

      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuW">
            <input placeholder="Search for Chatrooms" className="chatMenuInput" />
              { conversations.map((c) => ( <Conversation conversation={c}/> ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxW">
            <div className="chatBoxTop">
              <Message2/>
              <Message2 own = {true}/>
              <Message2/>
              <Message2 own = {true}/>
              <Message2/>
              <Message2 own = {true}/>
              <Message2/>
              <Message2 own = {true}/>
              <Message2/>
            </div>
            <div className="chatBoxBottom">
              <textarea
                    className="chatMessageInput"
                    placeholder="write something...">
              </textarea>
                  <button className="chatSubmitButton" >
                    Send
                  </button>
            </div>

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
