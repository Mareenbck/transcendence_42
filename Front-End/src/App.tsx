import './App.css'
import React from "react";
// import Login from "./components/Login";
import Signup from './components/Signup'
import { BrowserRouter, Route, Routes} from 'react-router-dom';
// import Nav from './components/Nav'
import Chat from './components/chat/Chat'
import Home from './pages/Home'
import Profile from './components/Profile';
import AuthForm from './components/auth/AuthForm';

function App() {
	return (
		// <AuthForm />
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/chat/message' element={<Chat />} />
				{/* <Route path='/auth/signin' element={<Login />} /> */}
				<Route path='/auth/signin' element={<AuthForm />} />
				<Route path='/auth/signup' element={<Signup />}/>
				<Route path='/users/profile' element={<Profile />}/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
