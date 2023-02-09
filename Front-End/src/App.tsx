import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import io, { Socket } from "socket.io-client"
import MessagesInput from "./MessagesInput"
import Messages from "./Messages"
import Login from "./components/Login";
import Signup from './components/Signup'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from './components/Nav'
import Home from './components/Home'

function App() {
	// const [socket, setSocket] = useState<Socket>()
	// const [messages, setMessages] = useState<string[]>([])
	// const send = (value: string) => {
	// 	socket?.emit("message", value)
	// }
	// useEffect(() => {
	// 	const newSocket = io("http://localhost:8080")
	// 	setSocket(newSocket)
	// }, [setSocket])

	// const messageListener = (message: string) => {
	// 	setMessages([...messages, message])
	// }
	// useEffect(() => {
	// 	socket?.on("message", messageListener)
	// 	return () => {
	// 		socket?.off("message", messageListener)
	// 	}
	// }, [messageListener])
	// return (
	// 	<>
	// 		{" "}

	// 		<MessagesInput send={send} />
	// 		<Messages messages={messages} />
	// 	</>
	// )
	const [name, setName] = useState<String>('React');
	return (
		<BrowserRouter>
			<Nav/>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/signin' element={<Login />} />
				<Route path='/signup' element={<Signup />}/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
