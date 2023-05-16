import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { AuthContextProvider } from './store/AuthContext'
import { FriendContextProvider } from './store/FriendshipContext'
import path from 'path';
import dotenv from 'dotenv';

// import * as path from 'path';

// require = require('esm')(module);

// dotenv.config({ path: path.resolve(__dirname, '../.env') });
// dotenv.config({ path: '../.env' });
// console.log("OLA ", process.env.REACT_APP_BACKEND_URL)
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<AuthContextProvider>
			<FriendContextProvider>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</FriendContextProvider>
		</AuthContextProvider>
	</React.StrictMode>,
)
