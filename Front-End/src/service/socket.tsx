import { useContext, useEffect, useState } from "react";
import AuthContext from "../store/AuthContext";
import { io, Manager } from "socket.io-client";
import { useMemo } from "react";

const manager = new Manager("ws://" + window.location.hostname + ':3000'
	, );


export default function useSocket() {

	const authCtx = useContext(AuthContext);
	const socket = useMemo(() => {
		if (authCtx.isLoggedIn) {
			return manager.socket('/', { auth: { token: authCtx.token }})
		}
	}, [authCtx.isLoggedIn, authCtx.token])

	const addListener = useMemo<(signal: string, callback: (data: any) => void) => void>
	(() => (signal:any, message:any) => {
		if (socket)
			{ socket.on(signal, message)} ;
	}, [socket])

	const sendMessage = useMemo<(signal: string, message: any) => void>(() => {
		return (signal: string, message: any) => {
			if (socket) {
			socket.emit(signal, message);
			}
		};
	}, [socket]);

  return [sendMessage, addListener];
}
