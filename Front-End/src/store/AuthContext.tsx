import React, { createContext, useEffect, useState } from "react";
import useSocket from '../service/socket';
import { back_url } from '../config.json';

const defaultValue = {
	token: '',
	userId: '',
	username: '',
	isLoggedIn: false,
	avatar: '',
	ftAvatar: '',
	email: '',
	is2FA: false,
	updateAvatar: (avatarUrl: string) => {},
	updateUsername: (newUsername: string) => {},
	fetchAvatar: async (userId: string) => {},
	login: async (token: string, userId: string, refreshToken: string) => {},
	logout: () => { }
};

export const AuthContext = createContext(defaultValue);
//controle de la presence du token dans local storage
const usernameLocalStorage = localStorage.getItem("username");
const ftAvatarLocalStorage = localStorage.getItem("ftAvatar");
const RtokenLocalStorage = localStorage.getItem("Rtoken");

export const AuthContextProvider = (props: any) => {
	const [refreshToken, setRefreshToken] = useState<string | null>(RtokenLocalStorage);

	const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
	const [userId, setUserId] = useState<string | null>(localStorage.getItem("userId"));
	const [username, setUsername] = useState<string | null>(usernameLocalStorage);
	const [avatar, setAvatar] = useState<string | null>('');
	const [email, setEmail] = useState<string | null>('');
	const [ftAvatar, setftAvatar] = useState<string | null>(ftAvatarLocalStorage);
	const [is2FA, setIs2FA] = useState<boolean>();
	const [sendMessage, addListener] = useSocket()

	useEffect(() => {
		if (userId) {
			fetchHandler(userId);
		}
	}, [username])

	useEffect(() => {
		if (userId) {
			fetchAvatar(userId);
		}
	}, [])

	useEffect(() => {
		if (userIsLoggedIn) {
			const intervalId = setInterval(() => {
				refreshHandler();
			}, 10 * 60 * 1000); // Refresh every 10 minutes
			return () => clearInterval(intervalId);
		}
	}, [refreshToken]);

	const updateAvatar = (avatarUrl: string) => {
		if (avatarUrl) {
			const timestamp = new Date().getTime();
			setAvatar(`${avatarUrl}?v=${timestamp}`);
		} else {
			setAvatar('');
		}
	  };

	const updateUsername = (newUsername: string) => {
		if (newUsername) {
			setUsername(newUsername);
		}
	};

	const fetchAvatar = async (userId: string) => {
		if (!userId) {
			return ;
		}
		try {
			const response = await fetch(back_url + `/users/${userId}/avatar`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.ok) {
				if (response.status === 204) {
					return null
				}
				const blob = await response.blob();
				setAvatar(URL.createObjectURL(blob));
			}
			return "success";
		} catch (error) {
			return console.log("error", error);
		}
	}

	const fetchHandler = async (userId: string) => {
		try {
			const response = await fetch(back_url + `/users/profile/${userId}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			const data = await response.json();
			setUserId(data.id);
			setUsername(data.username);
			setftAvatar(data.ftAvatar);
			setEmail(data.email);
			localStorage.setItem('username', data.username);
			return data
		} catch (error) {
			console.log(error);
		}
	};

	const refreshHandler = async () => {
		if (userIsLoggedIn) {
			try {
				const response = await fetch(back_url + '/auth/refresh', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						// Authorization: `Bearer ${token}`
					},
					body: JSON.stringify({ refresh_token: refreshToken, access_token: token}),
				});
				const data = await response.json();
				if (response.ok) {
					setToken(data.access_token);
				setRefreshToken(data.refresh_token);
				localStorage.setItem('token', data.access_token);
				localStorage.setItem('Rtoken', data.refresh_token);
			}
			return "success";
		} catch (error) {
			return console.log("error", error);
		}
	}
	};

	const fetchLogout = async () => {
		localStorage.clear();
		try {
			const response = await fetch(back_url + '/auth/logout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
			});
			const data = await response.json();
			console.log("DATA DANS LGOUT", data)
			sendMessage("showUsersList", data);
			sendMessage("logout", data);
			if (response.ok) {
				setToken("");
				setUserId("");
				setUsername("");
				setAvatar("");
				setEmail("");
				localStorage.clear();
				return data;
			}
		} catch (error) {
			return console.log("error", error);
		}
	};

	const loginHandler = async (token: string, userId: string, refreshToken: string) => {
		setToken(token);
		setRefreshToken(refreshToken);
		localStorage.setItem('token', token);
		localStorage.setItem('Rtoken', refreshToken);
		const data = await fetchHandler(userId);
		setIs2FA(data.twoFA);
		return data.twoFA;
	};

	const logoutHandler = async () => {
		await fetchLogout();
		sendMessage("login", userId)
	};

	//si presence du token -> logged
	const userIsLoggedIn = !!token;
	console.log("CONTEXT >>userIsLoggedIn---->");
	console.log(userIsLoggedIn);
	const contextValue = {
		token: token,
		userId: userId,
		username: username,
		avatar: avatar,
		ftAvatar: ftAvatar,
		email: email,
		isLoggedIn: userIsLoggedIn,
		setAvatar: setAvatar,
		is2FA: is2FA,
		login: loginHandler,
		logout: fetchLogout,
		fetchHandler: fetchHandler,
		fetchAvatar: fetchAvatar,
		updateAvatar: updateAvatar,
		updateUsername: updateUsername,
	};

	return (
		<AuthContext.Provider value={contextValue} >
			{props.children}
		</AuthContext.Provider>
	)
}

export default AuthContext;

