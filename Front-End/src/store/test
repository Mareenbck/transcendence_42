import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import React, { useState } from 'react';
import { back_url } from '@/config.json';
import { InfoBoxContext, InfoType } from './InfoBoxContext';

interface IUserContext {
	auth: {
		logged: boolean;
		setLogged: (logged: boolean) => void;
		creating: boolean;
		setCreating: (creating: boolean) => void;
		setAccessToken: (access_token: string) => void;
		updating: boolean;
		setUpdating: (updating: boolean) => void;
		creatingUser: {
			login: string;
			name: string;
			profile_picture: string;
		};
		setCreatingUser: (user: any) => void;
		changeName: (name: string) => void;
		twoFaStatus: boolean | null;
		setTwoFaStatus: (status: boolean) => void;
	};
	updateUser: () => Promise<string>;
	getAccessToken: () => Promise<string>;
	logout: () => void;
	user: {
		id: number;
		name: string;
		profile_picture: string;
	};
	setUser: (user: any) => void;
}

export const UserContext = React.createContext<IUserContext>(
	{} as IUserContext,
);

function UserContextProvider(props: any) {
	const [logged, setLogged] = useState(false);
	const [creating, setCreating] = useState(false);
	const [updating, setUpdating] = useState(true);
	const [access_token, setAccessToken] = useState('');
	const [user, setUser] = useState({ id: -1, name: '', profile_picture: '' });
	const [creatingUser, setCreatingUser] = useState({
		login: '',
		name: '',
		profile_picture: '',
	});
	const [twoFaStatus, setTwoFaStatus] = useState<boolean | null>(null);
	const infoBoxContext = React.useContext(InfoBoxContext);

	async function refreshToken(): Promise<string> {
		const refresh_token = Cookies.get('transcendance_session_cookie');
		if (!refresh_token) {
			return '';
		} else {
			return fetch(back_url + '/auth/refresh', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					refresh_token: refresh_token,
				}),
			})
				.then((res) => {
					if (!res.ok) {
						throw new Error('Network response was not ok');
					}
					return res.json();
				})
				.then((data) => {
					if (data.access_token) {
						setAccessToken(data.access_token.token);
						let decode: any = jwtDecode(data.access_token.token);
						setUser({
							id: decode.user.id,
							name: decode.user.name,
							profile_picture: decode.user.profile_picture,
						});
						setLogged(true);
						Cookies.remove('transcendance_session_cookie');
						Cookies.set(
							'transcendance_session_cookie',
							data.refresh_token.token,
							{
								expires: 7 * 24 * 60 * 60,
							},
						);
					} else {
						Cookies.remove('transcendance_session_cookie');
						return '';
					}
					return data.access_token.token;
				})
				.catch((err) => {
					return '';
				});
		}
	}

	async function updateUser() {
		setUpdating(true);
		let token = access_token;
		if (access_token === '') {
			token = await refreshToken();
			if (token === '') {
				setLogged(false);
				setUser({ id: -1, name: '', profile_picture: '' });
				setAccessToken('');
				setUpdating(false);
				return '';
			}
		} else {
			let decode: any = jwtDecode(access_token);
			if (decode.exp < Date.now() / 1000) {
				token = await refreshToken();
				if (token === '') {
					setLogged(false);
					setUser({ id: -1, name: '', profile_picture: '' });
					setAccessToken('');
					setUpdating(false);
					return '';
				}
			}
			if (user.id !== decode.user.id && decode.user.id !== undefined) {
				setUser({
					id: decode.user.id,
					name: decode.user.name,
					profile_picture: decode.user.profile_picture,
				});
			}
		}
		setUpdating(false);
		return token;
	}

	async function getAccessToken() {
		const token = await updateUser();
		return token;
	}

	function changeName(name: string) {
		setCreatingUser({ ...creatingUser, name: name });
	}

	async function logout() {
		const cookie = Cookies.get('transcendance_session_cookie');
		const access_token = await getAccessToken();
		fetch(back_url + '/auth/logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + access_token,
			},
			body: JSON.stringify({
				refresh_token: cookie,
			}),
		}).then((res) => {
			if (!res.ok) {
				infoBoxContext.addInfo({
					type: InfoType.ERROR,
					message: 'Error while logging out',
				});
			}
		});

		Cookies.remove('transcendance_session_cookie');
		setLogged(false);
		setUser({ id: -1, name: '', profile_picture: '' });
		setAccessToken('');
	}

	return (
		<UserContext.Provider
			value={{
				auth: {
					logged,
					setLogged,
					creating,
					setCreating,
					setAccessToken,
					updating,
					setUpdating,
					creatingUser,
					setCreatingUser,
					changeName,
					twoFaStatus,
					setTwoFaStatus,
				},
				logout,
				updateUser,
				getAccessToken,
				user: user,
				setUser,
			}}
		>
			{props.children}
		</UserContext.Provider>
	);
}

export default UserContextProvider;
