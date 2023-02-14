import './App.css'
import React from "react";
import MessagesInput from "./components/chat/MessagesInput"
import Messages from "./components/chat/Messages"
import Login from "./components/Login";
import Signup from './components/Signup'
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import Nav from './components/Nav'
import Chat from './components/chat/Chat'
import Home from './components/Home'
import Profile from './components/Profile';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/chat/message' element={<Chat />} />
				<Route path='/auth/signin' element={<Login />} />
				<Route path='/auth/signup' element={<Signup />}/>
				<Route path='/users/profile' element={<Profile />}/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
