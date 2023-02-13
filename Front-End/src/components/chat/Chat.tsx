import { useEffect, useState } from 'react'
// import './App.css'
import io, { Socket } from "socket.io-client"
import MessagesInput from "./MessagesInput"
import Messages from "./Messages"

function Chat() {
	const [socket, setSocket] = useState<Socket>()
	const [messages, setMessages] = useState<string[]>([])
	const send = (value: string) => {
		socket?.emit("message", value)
	}
	useEffect(() => {
		const newSocket = io("http://localhost:8080")
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
		</>
	)

}
export default Chat;
