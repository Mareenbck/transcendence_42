import React, { FormEvent, RefObject, useContext, useEffect, useRef, useState } from "react";
import Fetch from "../../../interfaces/Fetch";
import { DirectMessage, UserChat } from "../../../interfaces/iChat";
import useSocket from "../../../service/socket";
import AuthContext from "../../../store/AuthContext";
import MessageReq from "../message/message.req";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import '../../../style/UsersOnChannel.css'
import MessageD from "./messageD";
import NavbarDirectMessages from "./NavbarDirectMessages";

export default function CurrentDirectMessages(props: any) {
	const currentDirect = props.currentDirect;
	const authCtx = useContext(AuthContext);
	const currentId = parseInt(authCtx.userId);
	const [sendMessage, addListener] = useSocket();
	const [newMessageD, setNewMessageD] = useState<string> ("");
	const [AMessageD, setAMessageD] = useState<DirectMessage | null> (null);
	const [messagesD, setMessagesD] = useState<DirectMessage[]> ([]);
	const scrollRef: RefObject<HTMLDivElement> = useRef(null);

	const getUser = (userId: number): UserChat | null => {
		const author = props.allUsers.find((user: any) => +user?.id === +userId);
		if (author !== undefined) { return (author) }
		return (null);
	};

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" })
	}, [messagesD]);

	useEffect(() => {
		AMessageD && currentDirect && +currentDirect?.id === +AMessageD.author &&
		setMessagesD(prev => {
			const isDuplicate = prev.some(message => (message.createdAt === AMessageD.createdAt && message.content === AMessageD.content));
			if (!isDuplicate) {
			return [...prev, AMessageD];
			}
			return prev;
		});
	},[AMessageD, currentDirect])

	useEffect(() => {
		addListener("getMessageDirect", (data)=> setAMessageD({
			content: data.content,
			author: data.author,
			receiver: data.receiver,
			createdAt: new Date(Date.now()),
		}));
	});

	async function getDirMess() {
		try {
			setMessagesD(await Fetch.fetch(authCtx.token, "GET", `dir-mess`, currentId, currentDirect?.id));
		} catch(err) {
			console.log(err);
		}
	};

	useEffect(() => {
		if (currentDirect) {
			getDirMess()
		}
	}, [currentDirect]);



	const handleSubmitD = async (e: FormEvent)=> {
		e.preventDefault();
		if (currentDirect?.id)
		{
		  const messageD = {
		  author: +currentId,
		  content: newMessageD,
		  receiver: currentDirect?.id,
		  };
			sendMessage("sendMessageDirect", {
			author: +currentId,
			receiver: +currentDirect?.id,
			content: newMessageD,
		  } as any)
		  try {
			const res2 = await MessageReq.postDirMess(authCtx, messageD);
			setMessagesD([...messagesD, res2]);
			setNewMessageD("");
		  } catch(err) {console.log(err)}
		}
	  }

	  return (
		<>
			<NavbarDirectMessages currentDirect={currentDirect} />
			<div className="chatBoxTop">
				{ messagesD.length ? (
					messagesD.map((m) => (
						<div key={m?.createdAt instanceof Date ? m.createdAt.getTime() : m.createdAt } ref={scrollRef}>
							<MessageD messageD={m} user={getUser(m.author)} authCtx={authCtx} own={m?.author === +currentId} />
						</div>
					))) : <div className="box-msg"><span className="noConversationText2">No message in this room yet.</span></div>
				}
			</div>
			<div className="chatBoxBottom">
				<textarea
					className="chatMessageInput"
					placeholder="write something..."
					onChange={(e) => setNewMessageD(e.target.value)}
					value={newMessageD}
				></textarea>
				<FontAwesomeIcon
					icon={faPaperPlane}
					onClick={handleSubmitD}
					className={`send-btn-chat`} // ajouter la classe 'muted' si l'utilisateur est mute
					// disabled={isMuted} // désactiver le bouton d'envoi si l'utilisateur est mute
				/>
			</div>
		</>
	);

}
