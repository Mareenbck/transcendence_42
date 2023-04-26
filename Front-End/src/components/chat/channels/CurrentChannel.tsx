import React, { FormEvent, RefObject, useContext, useEffect, useRef, useState } from "react";
import Fetch from "../../../interfaces/Fetch";
import { RoomMessage, UserChat } from "../../../interfaces/iChat";
import useSocket from "../../../service/socket";
import AuthContext from "../../../store/AuthContext";
import Message2 from "../message/message";
import MessageReq from "../message/message.req";
import NavbarChannel from "./NavbarChannel";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { IconButton, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function CurrentChannel(props: any) {
	const currentChatroom = props.currentChatroom;
	const authCtx = useContext(AuthContext);
	const currentId = parseInt(authCtx.userId);
	const [sendMessage, addListener] = useSocket();
	const [newMessage2, setNewMessage2] = useState<string>("");
	const [messages2, setMessages2] = useState<RoomMessage[]>([]);
	const scrollRef: RefObject<HTMLDivElement> = useRef(null);
	const [AMessageChat, setAMessageChat] = useState<RoomMessage | null>(null);
	const [isJoined, setIsJoined] = useState<boolean>(currentChatroom.participants.some((p: any)=> p.userId === parseInt(authCtx.userId)));
	const isBanned = currentChatroom.participants.some((p: any)=> p.userId === parseInt(authCtx.userId) && p.status === 'BAN');
	const [showPopUp, setShowPopUp] = useState(false);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const userJoined = currentChatroom.participants.some((p: any)=> p.userId === parseInt(authCtx.userId))

	const getUser = (userId: number): UserChat | null => {
		const author = props.allUsers.find((user: any) => +user?.id === +userId);
		if (author !== undefined) { return (author) }
		return (null);
	};

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" })
	}, [messages2]);

	useEffect(() => {
		AMessageChat && currentChatroom?.id === AMessageChat.chatroomId &&
			setMessages2(prev => {
				const isDuplicate = prev.some(message => (message.createdAt === AMessageChat.createdAt && message.content === AMessageChat.content));
				if (!isDuplicate) {
					return [...prev, AMessageChat];
				}
				return prev;
			});
		if (currentChatroom) {
			getMess();
		}
	}, [AMessageChat, currentChatroom])

	async function getMess() {
		try {
			if (currentChatroom) {
				const response = await Fetch.fetch(authCtx.token, "GET", `chat-mess\/room`, currentChatroom?.id);
				setMessages2(response);
				sendMessage("userRoom", {
					userId: +authCtx.userId,
					roomId: +currentChatroom.id,
				} as any)
			}
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		if (userJoined) {
			setIsJoined(true)
		} else {
			setIsJoined(false)
		}
	  }, [currentChatroom]);

	useEffect(() => {
		addListener("getMessageRoom", (data) => setAMessageChat({
			authorId: data.authorId,
			chatroomId: data.chatroomId,
			content: data.content,
			createdAt: new Date(Date.now()),
		}));
	}, []);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (currentChatroom.id) {
			const message2 = {
				authorId: currentId,
				content: newMessage2,
				chatroomId: currentChatroom.id,
			};
			sendMessage("sendMessageRoom", {
				authorId: currentId,
				chatroomId: +currentChatroom.id,
				content: newMessage2,
			} as any)
			try {
				const res = await MessageReq.postMess(authCtx, message2);
				setMessages2([...messages2, res]);
				setNewMessage2("");
			} catch (err) { console.log(err) }
		}
	}

	const handleFormSubmit = (e: FormEvent) => {
		e.preventDefault();
		setShowPopUp(true);
	};

	const handleLeaveChannel = () => {
		setIsJoined(false);
	  };

	  const handleCloseSnackbar = (e: FormEvent) => {
	  e.preventDefault();
	  
		setSnackbarOpen(false);
	  };
	  

	return (
		<>
		  {isJoined && !isBanned (
			<>
			  <NavbarChannel
				chatroom={currentChatroom}
				onCancel={() => setShowPopUp(false)}
				onClick={() => setShowPopUp(false)}
				onSubmit={handleFormSubmit} // Supprimez les accolades inutiles ici
				onLeaveChannel={handleLeaveChannel}
			  />
			  <div className="chatBoxTop">
				{messages2.length ? (
				  messages2.map((m, i) => ( // Ajoutez un index pour éviter l'avertissement de la console
					<div key={i} ref={scrollRef}> {/* Utilisez un index plutôt que la date pour éviter les problèmes */}
					  <Message2 message2={m} user={getUser(m?.authorId)} authCtx={authCtx} own={m?.authorId === currentId} />
					</div>
				  ))
				) : (
				  <div className="box-msg"><span className="noConversationText2">No message in this room yet.</span></div>
				)}
			  </div>
			  <div className="chatBoxBottom">
				<input
				  className="chatMessageInput"
				  placeholder="write something..."
				  onChange={(e) => setNewMessage2(e.target.value)}
				  value={newMessage2}
				></input>
				<FontAwesomeIcon
				  icon={faPaperPlane}
				  onClick={handleSubmit}
				  className="send-btn-chat"
				/>
			  </div>
			</>
		  )}
		
		{!isJoined && (
		<Snackbar
			anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			open={!isJoined} 
			autoHideDuration={5000}
			onClose={handleCloseSnackbar}
			message="You must join the channel to send message"
			action={
				<IconButton
				  size="small"
				  aria-label="close"
				  color="inherit"
				  onClick={(event) => {
					event.stopPropagation();
					handleCloseSnackbar(event, 'user');
				  }}
				>
				  <CloseIcon fontSize="small" />
				</IconButton>
			  }
			/>
			)}
		</>
	  );
	  
	  
}
