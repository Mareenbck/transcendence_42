import './App.css'
import React, { useContext } from "react";
import Signup from './components/auth/Signup'
import { Route, Routes} from 'react-router-dom';
import Game from './components/game/Game'
import Chat from './components/chat/Chat'
import Home from './pages/Home'
import Profile from './pages/Profile';
import AuthContext from './store/AuthContext';
import Login from './components/auth/Login';
import Menu from './pages/Menu';
import TwoFaForm from './components/auth/TwoFA';

function App() {
	const authCtx = useContext(AuthContext);

	const isLoggedIn = authCtx.isLoggedIn;
	return (
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path='/game/play' element={<Game />} />
			<Route path='/chat/message' element={<Chat />} />
			<Route path='/auth/signin' element={<Login />} />
			<Route path='/auth/2fa' element={<TwoFaForm />} />
			<Route path='/auth/signup' element={<Signup />} />
			<Route path='/menu' element={<Menu />} />
			<Route path='/users/profile/:id' element={<Profile />} />
		</Routes>
	);
}

export default App;
