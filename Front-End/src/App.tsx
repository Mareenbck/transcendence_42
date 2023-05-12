import './App.css';
import React, { useContext, useEffect, useState } from "react";
import Signup from './components/auth/Signup'
import { Route, Routes} from 'react-router-dom';

import Game from './components/game/Game';
import Chat from './components/chat/Chat'
import Home from './pages/Home'
import Profile from './pages/Profile';
import Callback42 from './components/auth/Callback42';
import Friends from './components/friends/FriendsDrawer';
import Login from './components/auth/Login';
import Menu from './pages/Menu';
import TwoFaForm from './components/auth/TwoFA';
import Setting from './pages/Setting';
import Scores from'./components/scores/Scores';
import NotFound from './pages/404';
// import { fab } from '@fortawesome/free-brands-svg-icons'
import useSocket from './service/socket';
import { UserChat} from "./interfaces/iChat";
import PopupChallenge from './components/chat/PopupChallenge';
import AuthContext from './store/AuthContext';





function App() {

	const [invited, setInvited] = useState<UserChat | null> (null);
	const [sendMessage, addListener] = useSocket();
	const [allUsers, setAllUsers] = useState <UserChat[]> ([]);
	const user = useContext(AuthContext);
	const id = user.userId;


	useEffect(() => {
		addListener("wasInvited", data => {
		  setInvited(data);
		  
		});
	  });

	const getUser  = (userId: number): UserChat | null => {
		const a = allUsers.find(user => +user?.id === +userId);
		if (a !== undefined)
			{ return(a)}
		return (null);
	};

	
	return (
		<>
		<PopupChallenge trigger={invited} setTrigger={setInvited} sendMessage={sendMessage} player={(getUser(+id))} > </PopupChallenge>

		<Routes>
			<Route path='/' element={<Home />} />
			<Route path='/game' element={<Game />} />
			<Route path='/chat/message' element={<Chat />} />
			<Route path='/friends' element={<Friends />} />
			<Route path='/auth/signin' element={<Login />} />
			<Route path='/auth/2fa' element={<TwoFaForm />} />
			<Route path='/auth/signup' element={<Signup />} />
			<Route path="/auth/42/callback" element={<Callback42 />} />
			<Route path='/menu' element={<Menu />} />
			<Route path='/settings' element={<Setting />} />
			<Route path='/scores' element={<Scores />} />
			<Route path='/*' element={<NotFound />} />			
			<Route path={`/users/profile/:id`} element={<Profile />} />
		</Routes>
		</>
	);
}
{/* <Route path={`/users/profile/uploads`} element={<Profile />} /> */}

export default App;
