import './App.css'
import React, { useContext } from "react";
import Signup from './components/auth/Signup'
import { Route, Routes} from 'react-router-dom';
import Game from './components/game/Game'
import Friends from './components/friends/Friends';
import Chat from './components/chat/Chat'
import Home from './pages/Home'
import Profile from './pages/Profile';
import Callback42 from './components/auth/Callback42';
import AuthContext from './store/AuthContext';
import Login from './components/auth/Login';
import Menu from './pages/Menu';
import TwoFaForm from './components/auth/TwoFA';
import Setting from './pages/Setting';

function App() {
	const authCtx = useContext(AuthContext);

	const isLoggedIn = authCtx.isLoggedIn;
	authCtx.userId
	return (
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path='/friends' element={<Friends />} />
			<Route path='/game/play' element={<Game />} />
			<Route path='/chat/message' element={<Chat />} />
			<Route path='/auth/signin' element={<Login />} />
			<Route path='/auth/2fa' element={<TwoFaForm />} />
			<Route path='/auth/signup' element={<Signup />} />
			<Route path="/auth/42/callback" element={<Callback42 />} />
			<Route path='/menu' element={<Menu />} />
			<Route path='/settings' element={<Setting />} />
			{/* <Route path={`/users/profile/${authCtx.userId}`} element={<Profile />} /> */}
			<Route path={`/users/profile/:id`} element={<Profile />} />
		</Routes>
	);
}

export default App;
