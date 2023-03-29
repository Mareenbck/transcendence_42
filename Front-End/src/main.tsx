import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { AuthContextProvider } from './store/AuthContext'
import { FriendContextProvider } from './store/FriendshipContext'

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
