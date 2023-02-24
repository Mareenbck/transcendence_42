import { useEffect, useState } from 'react'
// import './App.css'
import io, { Socket } from "socket.io-client"
import MessagesInput from "./MessagesInput"
import Messages from "./Messages"
import Conversation from "./conversation/conversation"
import Message2 from "./message/message"
import ChatOnline from "./chatOnline/chatOnline"

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
  return (
    <>
      {" "}

      <MessagesInput send={send} />
      <Messages messages={messages} />

  <div className="messenger">
        <div className="chatMenu">
            <div className="chatMenuW">
              <input placeholder="Search for friends" className="chatMenuInput"/>
              <Conversation/>
              <Conversation/>
              <Conversation/>
            </div>
        </div>

        <div className="chatBox">
           <div className="chatBoxW">
               <div className="chatBoxTop">
                 <Message2 />
                 <Message2 own={true}/>
                 <Message2 />
               </div>

                <div className="chatBoxBottom">
                  <textarea className="chatMessageInput" palceholder="write somejthing..."></textarea>
                  <button className="chatSubmitButton">Send</button>
               </div>


            </div>

        </div>
        <div className="chatOnLine">
          <div className="chatOnLineW">On Line
            <Messages messages={messages} />
            <MessagesInput send={send} />
          </div>
        </div>
      </div>


    </>
  )

}
export default Chat;
