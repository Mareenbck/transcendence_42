import { useEffect, useState } from 'react'
import './App.css'
import io, { Socket } from "socket.io-client"
import MessagesInput from "./components/chat/MessagesInput"
import Messages from "./components/chat/Messages"
import Login from "./components/Login";
import Signup from './components/Signup'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from './components/Nav'
import Chat from './components/chat/Chat'
import Home from './components/Home'

function App() {
	return (
		<BrowserRouter>
			<Nav/>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/chat/message' element={<Chat />} />
				<Route path='/auth/signin' element={<Login />} />
				<Route path='/auth/signup' element={<Signup />}/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
