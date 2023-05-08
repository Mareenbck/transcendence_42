import React, { useContext, useEffect, useState } from 'react';
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthContext from '../../../store/AuthContext';
import Fetch from '../../../interfaces/Fetch';
import useSocket from '../../../service/socket';

const DirectMessageInfo = (props: any) => {
	const authCtx = useContext(AuthContext)
	const [latestMessage, setLatestMessage] = useState<any>({});
	const [lastReceivedMessage, setLastReceivedMessage] = useState<any>({});
	const [lastEmittedMessage, setLastEmittedMessage] = useState<any>({});
	const [status, setStatus] = useState<string>('');
	const [sendMessage, addListener] = useSocket();
	const [latestMessageCurrent, setLatestMessageCurrent] = useState<any>(null);
	const isDirectMsg = (props.currentDirect?.id ?? false) && props.userWithDM.id === props.currentDirect.id
	const isCurrentUser = parseInt(authCtx.userId) === props.userWithDM.id;

	useEffect(() => {
		if (!isDirectMsg && !isCurrentUser && props.userWithDM.dirMessReceived.length) {
			setLastReceivedMessage(props.userWithDM.dirMessReceived[0]);
		}
		if (!isDirectMsg && !isCurrentUser && props.userWithDM.dirMessEmited.length) {
			setLastEmittedMessage(props.userWithDM.dirMessEmited[0]);
		}
		if (isCurrentUser) {
			setLastReceivedMessage(latestMessageCurrent);
		}
		if (props.userWithDM.status === 'ONLINE') {
			setStatus('online')
		} else if (props.userWithDM.status === 'OFFLINE') {
			setStatus('offline')
		} else {
			setStatus('playing')
		}
	}, [props.userWithDM]);


	const fetchUserWithDirectMessages = async () => {
	  const response = await Fetch.fetch(authCtx.token, "GET", `dir-mess/getMessages/`);
		setLatestMessageCurrent(response.dirMessReceived[0]);
	};

	  useEffect(() => {
		addListener("getMessageDirect", data => {
			setLatestMessageCurrent(data);
		});
		if (isCurrentUser) {
		  fetchUserWithDirectMessages();
		}
	  }, [addListener]);

	  useEffect(() => {
		console.log("latestMessage changed:", latestMessage);
	  }, [latestMessage]);

	  useEffect(() => {
		if (lastReceivedMessage && lastEmittedMessage) {
		  if (lastReceivedMessage.id > lastEmittedMessage.id) {
			setLatestMessage(lastReceivedMessage);
		  } else {
			setLatestMessage(lastEmittedMessage);
		  }
		} else if (lastReceivedMessage) {
		  setLatestMessage(lastReceivedMessage);
		} else if (lastEmittedMessage) {
		  setLatestMessage(lastEmittedMessage);
		}
	  }, [lastReceivedMessage, lastEmittedMessage]);

	// useEffect(() => {
	// 	let lastReceivedMessageDate;
	// 	let lastEmittedMessageDate;
	// 	if (lastReceivedMessage) {
	// 		lastReceivedMessageDate = new Date(lastReceivedMessage.createdAt);
	// 	}
	// 	if (lastEmittedMessage) {
	// 		lastEmittedMessageDate = new Date(lastEmittedMessage.createdAt);
	// 	}
	// 	if (lastReceivedMessageDate && lastEmittedMessageDate) {
	// 		if (lastReceivedMessageDate > lastEmittedMessageDate) {
	// 			setLatestMessage(lastReceivedMessage);
	// 		} else {
	// 			setLatestMessage(lastEmittedMessage);
	// 		}
	// 	} else if (lastReceivedMessageDate && !lastEmittedMessageDate) {
	// 		setLatestMessage(lastReceivedMessage);
	// 	} else if (!lastReceivedMessageDate && lastEmittedMessageDate) {
	// 		setLatestMessage(lastEmittedMessage);
	// 	}
	// }, [lastReceivedMessage, lastEmittedMessage, isCurrentUser]);

	const formattedTime = latestMessage.createdAt
	? new Date(latestMessage.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
	: "";

	return (
		<>
		{ props.type === 'status' ? (
			<div className='directMess-info'>
				<p>{formattedTime}</p>
				<FontAwesomeIcon icon={faCircle} className={`statusChat-${status}`}/>
			</div>
			) : (
				<div className='msg-content'>{latestMessage.content}</div>
			)
		}
		</>
	);
}

export default DirectMessageInfo;
