import { useContext } from "react";
import AuthContext from "../store/AuthContext";
import { io, Manager } from "socket.io-client";
import { useMemo } from "react";


//////////////////////////
// A SUPPRIMER QUAND TU SERAS PASS2E SUR USE SOCKET 
/////////////////////////
//export const socket = io( "ws://localhost:8001" );
//////////////////////////////



const manager = new Manager("ws://localhost:8001");

export default function useSocket() {

	const authCtx = useContext(AuthContext);
  const socket = useMemo(() => {
    if (authCtx.isLoggedIn) {
      return manager.socket('/', { auth: { token: authCtx.token }})
    }
    // return manager.socket('/');
  }, [authCtx])

  const addListener = useMemo<(signal: string, callback: (data: any) => void) => void>
  (() => (signal, message) => {
    if (socket)
      { socket.on(signal, message)} ;
  }, [socket])

  // const sendMessage = useMemo<(signal: string, message: any) => void>
  // (() => (signal, message) => {
  //   if (socket) {
  //   socket.emit(signal, message)};
  // }, [socket])

  const sendMessage = useMemo<(signal: string, message: any) => void>
  (() => {
      return (signal, message) => {
        if (socket) {
          socket.emit(signal, message);
        }
      };
    },
    [socket]
  );
  





  return [sendMessage, addListener];
} 