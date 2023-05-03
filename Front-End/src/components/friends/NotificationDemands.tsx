import React, { FormEvent, useContext, useEffect, useState } from "react";
import Demand from '../../interfaces/IFriendship'
import BadgeUnstyled from '@mui/base/BadgeUnstyled';
import Face2Icon from '@mui/icons-material/Face2';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { FriendContext } from "../../store/FriendshipContext";
import useSocket from "../../service/socket";
import AuthContext from "../../store/AuthContext";

const NotificationDemands = (props: any) => {
	const [sendMessage, addListener] = useSocket();
	const friendCtx = useContext(FriendContext);
	const authCtx = useContext(AuthContext);
	const [badgeCount, setBadgeCount] = useState(friendCtx.pendingDemandsCount);

	useEffect(() => {
	  setBadgeCount(friendCtx.pendingDemandsCount)
	}, [friendCtx.pendingDemandsCount]);

	useEffect(() => {
		addListener('pendingDemands', (pendingDemands: any[]) => {
			const receiverDemands = pendingDemands.filter(
				(demand: Demand) => demand.receiverId === parseInt(authCtx.userId)
			);
			setBadgeCount(receiverDemands.filter((demand: Demand) => demand.status === 'PENDING').length);
		});
	}, [addListener]);

	return (
		<>
			<BadgeUnstyled>
				{badgeCount > 0 && (
					<span className="badge-notification">{badgeCount}</span>
				)}
			</BadgeUnstyled>
		</>
	)
}

export default NotificationDemands;
