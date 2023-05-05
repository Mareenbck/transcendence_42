import { useContext, useEffect, useState } from "react";
import AuthContext from "../store/AuthContext";
import { io, Manager } from "socket.io-client";
import { useMemo } from "react";

const manager = new Manager("ws://localhost:8001");

export default function useSocket() {

	///////////////////////////////////////////////////
	// PARTIE JUDLIN
		const authCtx = useContext(AuthContext);
	  const socket = useMemo(() => {
	    if (authCtx.isLoggedIn) {
	      return manager.socket('/', { auth: { token: authCtx.token }})
	    }
	    // return manager.socket('/');
	  }, [authCtx])

	  const addListener = useMemo<(signal: string, callback: (data: any) => void) => void>
	  (() => (signal:any, message:any) => {
	    if (socket)
	      { socket.on(signal, message)} ;
	  }, [socket])
	//
	// // const sendMessage = useMemo<(signal: string, message: any) => void>
	// // (() => (signal, message) => {
	// //   if (socket) {
	// //   socket.emit(signal, message)};
	// // }, [socket])

	  const sendMessage = useMemo<(signal: string, message: any) => void>
	  (() => {
	      return (signal:any, message:any) => {
	        if (socket) {
	          socket.emit(signal, message);
	        }
	      };
	    },
	    [socket]
	  );
	////////////////////////////////////////////////////

// export default function useSocket() {

	// const authCtx = useContext(AuthContext);
	// const [socket, setSocket] = useState(null);

	// useEffect(() => {
	// 	if (authCtx.isLoggedIn) {
	// 		const newSocket = manager.socket('/', { auth: { token: authCtx.token } });
	// 		setSocket(newSocket);
	// 		return () => {
	// 			newSocket.disconnect();
	// 		};
	// 	}
	// }, [authCtx]);

// 	const addListener = useMemo(() => {
// 		return (signal: string, callback: (data: any[]) => void ) => {
// 			if (socket) {
// 				socket.on(signal, callback);
// 			}
// 		};
// 	}, [socket]);
	// const addListener = useMemo(() => {
	// 	return (signal: string, callback: (data: any) => void) => {
	// 		if (socket) {
	// 			socket.on(signal, callback);
	// 		}
	// 	};
	// }, [socket]);

	// const sendMessage = useMemo(() => {
	// 	return (signal: string, message: any) => {
	// 		if (socket) {
	// 			socket.emit(signal, message);
	// 		}
	// 	};
	// }, [socket]);

  return [sendMessage, addListener];
}
