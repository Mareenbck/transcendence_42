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

	const createDemand = async (receiverId: number, token: string, currentId: string) => {
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
					// Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ id: currentId }),
			}
		)
		const data = await response.json();
		const updatedDemands = await Promise.all(data.map(async (demand: Demand) => {
			const avatar = await fetchAvatar(demand.requester.id);
			return { ...demand, requester: {...demand.requester, avatar }};
		}));
		setDemands(updatedDemands);
	}

	const getFriends = async (token: string, currentId: string) => {
		const response = await fetch(
			"http://localhost:3000/friendship/friends", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					// Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ id: currentId }),
			}
		)
		const data = await response.json();

		// For each friend in the data array, fetch their avatar
		const updatedFriends = await Promise.all(data.map(async (friend: Friend) => {
			const avatar = await fetchAvatar(friend.id);
			return { ...friend, avatar };
		}));
		setFriends(updatedFriends);
	}

	const fetchAvatar = async (userId: number) => {
		try {
			const response = await fetch(`http://localhost:3000/friendship/${userId}/avatar`, {
				method: 'GET',
			});
			if (response.ok) {
				const blob = await response.blob();
				return (URL.createObjectURL(blob));
			}
		} catch (error) {
			return console.log("error", error);
		}
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