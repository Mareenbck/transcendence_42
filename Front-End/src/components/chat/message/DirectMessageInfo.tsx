import React, { useEffect, useState } from 'react';
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const DirectMessageInfo = (props: any) => {
	const [latestMessage, setLatestMessage] = useState<any>({});
	const [lastReceivedMessage, setLastReceivedMessage] = useState<any>({});
	const [lastEmittedMessage, setLastEmittedMessage] = useState<any>({});
	const [status, setStatus] = useState<string>('');

	console.log("props de direct mesgae ifo ")
	console.log(props)
	// console.log(props.userWithDM.dirMessReceived)
	useEffect(() => {
		if (props.userWithDM.dirMessReceived.length) {
			setLastReceivedMessage( props.userWithDM.dirMessReceived[props.userWithDM.dirMessReceived.length - 1]);
		}
		if (props.userWithDM.dirMessEmited.length) {
			setLastEmittedMessage(props.userWithDM.dirMessEmited[props.userWithDM.dirMessEmited.length - 1]);
		}
		if (props.userWithDM.status === 'ONLINE') {
			setStatus('online')
		} else if (props.userWithDM.status === 'OFFLINE') {
			setStatus('offline')
		} else {
			setStatus('playing')
		}
	}, [props.userWithDM]);

	useEffect(() => {
		const lastReceivedMessageDate = new Date(lastReceivedMessage.createdAt);
		const lastEmittedMessageDate = new Date(lastEmittedMessage.createdAt);

		if (lastReceivedMessageDate > lastEmittedMessageDate) {
		  setLatestMessage(lastReceivedMessage);
		} else {
		  setLatestMessage(lastEmittedMessage);
		}
	}, [lastReceivedMessage, lastEmittedMessage]);

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
