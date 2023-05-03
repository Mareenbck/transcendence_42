import React, { FormEvent, useContext, useEffect, useState } from "react";
import Demand from '../../interfaces/IFriendship'
import BadgeUnstyled from '@mui/base/BadgeUnstyled';
import { FriendContext } from "../../store/FriendshipContext";
import useSocket from "../../service/socket";
import AuthContext from "../../store/AuthContext";

const NotificationDemands = (props: any) => {
	const [sendMessage, addListener] = useSocket();
	const friendCtx = useContext(FriendContext);
	const authCtx = useContext(AuthContext);

	useEffect(() => {
		addListener('pendingDemands', (pendingDemands: any[]) => {
		  const receiverDemands = pendingDemands.filter(
			(demand: Demand) => demand.receiverId === parseInt(authCtx.userId)
		  );
		  friendCtx.setPendingDemandsCount(receiverDemands.filter((demand: Demand) => demand.status === 'PENDING').length);
		});
	  }, [addListener, authCtx.userId, friendCtx.setPendingDemandsCount]);

	return (
		<>
			<BadgeUnstyled>
			{friendCtx.pendingDemandsCount > 0 && (
				<span className="badge-notification">{friendCtx.pendingDemandsCount}</span>
			)}
			</BadgeUnstyled>
		</>
	)
}

export default NotificationDemands;
