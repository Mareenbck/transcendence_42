import React, { createContext, useState } from "react";

//creation du context pour auth
//pour stocker les  data user
const defaultValue = {
	token: '',
	userId: '',
	username: '',
	isLoggedIn: false,
	avatar: '',
	ftAvatar: '',
	is2FA: false,
	updateAvatar: (avatarUrl: string) => {},
	fetchAvatar: async (userId: string) => {},
	login: async (token: string, userId: string) => {},
	logout: () => { }
};

export const AuthContext = createContext(defaultValue);
//controle de la presence du token dans local storage
const usernameLocalStorage = localStorage.getItem("username");
const ftAvatarLocalStorage = localStorage.getItem("ftAvatar");

export const AuthContextProvider = (props: any) => {

	const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
	const [userId, setUserId] = useState<string | null>(localStorage.getItem("userId"));
	const [username, setUsername] = useState<string | null>(usernameLocalStorage);
	const [avatar, setAvatar] = useState<string | null>('');
	const [ftAvatar, setftAvatar] = useState<string | null>(ftAvatarLocalStorage);
	const [is2FA, setIs2FA] = useState<boolean>(false);

	const updateAvatar = (avatarUrl: string) => {
		if (avatarUrl) {
			const timestamp = new Date().getTime();
			setAvatar(`${avatarUrl}?v=${timestamp}`);
		} else {
			setAvatar('');
		}
	  };

	  const fetchAvatar = async (userId: string) => {
		  try {
			  const response = await fetch(`http://localhost:3000/users/${userId}/avatar`, {
				  method: 'GET',
				  headers: {
					  Authorization: `Bearer ${token}`,
				  },
			  });
			  if (response.ok) {
				  const blob = await response.blob();
				  setAvatar(URL.createObjectURL(blob));
			  }
			  return "success";
		  } catch (error) {
			  return console.log("error", error);
		  }
	  }

	const fetchHandler = async (token: string, userId: string) => {
		try {
			const response = await fetch(`http://localhost:3000/users/profile/${userId}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			const data = await response.json();
			console.log(data);
			setUserId(data.id);
			setUsername(data.username);
			setAvatar(data.avatar);
			setftAvatar(data.ftAvatar);
			localStorage.setItem('username', data.username);
			return data
		} catch (error) {
			console.log(error);
		}
	};


	const loginHandler = async (token: string, userId: string) => {
		setToken(token);
		const data = await fetchHandler(token, userId);
		return data.twoFA;
	};

	const logoutHandler = () => {
		setToken("");
		setUserId("");
		setUsername("");
		setAvatar("");
		localStorage.clear();
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
		isLoggedIn: userIsLoggedIn,
		setAvatar: setAvatar,
		is2FA: is2FA,
		login: loginHandler,
		logout: logoutHandler,
		fetchHandler: fetchHandler,
		fetchAvatar: fetchAvatar,
		updateAvatar: updateAvatar,
	};

	return (
		<AuthContext.Provider value={contextValue} >
			{props.children}
		</AuthContext.Provider>
	)
}

export default AuthContext;

