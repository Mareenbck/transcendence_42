import React, { createContext, useContext, useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import Demand from '../interfaces/IFriendship'
import Friend from '../interfaces/IFriendship'

const defaultValue = {
	demands: [] as Demand[],
	friends: [] as Friend[],
	createDemand: (receiverId: number, token: string, currentId: string) => { },
	getDemands: (token: string, currentId: string) => { },
	getFriends: (token: string, currentId: string) => { },
	removeFriend: (friendId: number, currentId: string, token: string) => { },
	updateDemand: (demandId: number, res: string, token: string) => { },
};

export const FriendContext = createContext(defaultValue);

export const FriendContextProvider = (props: any) => {
	const [demands, setDemands] = useState<Demand[]>([]);
	const [friends, setFriends] = useState<Friend[]>([]);

	const authCtx = useContext(AuthContext);

	useEffect (() => {
		getDemands(authCtx.token, authCtx.userId);
	}, []);

	useEffect (() => {
		getFriends(authCtx.token, authCtx.userId);
	}, []);

	console.log("friends DANS CTX")
	console.log(friends)
	const createDemand = async (receiverId: number, token: string, currentId: string) => {
		console.log("create demand dans context:")
		try {
			const response = await fetch(`http://localhost:3000/friendship/create`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ requesterId: currentId, receiverId: receiverId }),
			});
			await response.json();
			if (!response.ok) {
				console.log("POST error on /friendship/create");
				return "error";
			}
		} catch (error) {
			console.log("error", error);
		}
	}

	const getDemands = async (token: string, currentId: string) => {
		const response = await fetch(
			"http://localhost:3000/friendship/received", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ id: currentId }),
			}
		)
		const data = await response.json();
		setDemands(data);
	}


	const getFriends = async (token: string, currentId: string) => {
		const response = await fetch(
			"http://localhost:3000/friendship/friends", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ id: currentId }),
			}
		)
		const data = await response.json();
		setFriends(data);
	}

	const removeFriend = async (friendId: number, currentId: string, token: string) => {
		try {
			const response = await fetch(`http://localhost:3000/friendship/delete`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ friendId: friendId, currentId: currentId }),
			});
			await response.json();
			if (!response.ok) {
				console.log("POST error on /friendship/delete");
				return "error";
			}
		} catch (error) {
			console.log("error", error);
		}
	}

	const updateDemand = async (demandId: number, res: string, token: string) => {
		try {
			const response = await fetch(`http://localhost:3000/friendship/update`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ demandId: demandId, response: res }),
			});
			await response.json();
			if (!response.ok) {
				console.log("POST error on /friendship/validate");
				return "error";
			}
		} catch (error) {
			console.log("error", error);
		}
	}

	const contextValue = {
		demands,
		friends,
		createDemand,
		getDemands,
		getFriends,
		removeFriend,
		updateDemand,
	};

	return (
		<FriendContext.Provider value={contextValue} >
			{props.children}
		</FriendContext.Provider>
	)
}
