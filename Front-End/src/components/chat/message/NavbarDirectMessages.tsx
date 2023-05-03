import React from "react";
import { useContext, useEffect, useState } from "react";
import Avatar from '@mui/material/Avatar';
import '../../../style/NavbarChannel.css';
import { FriendContext } from "../../../store/FriendshipContext";



export function NavbarChannel(props: any) {
	const friendCtx = useContext(FriendContext);
	const [icon, setIcon] = useState<any>();

	const fetchAvatar = async (id: string) => {
		const avat: any = await friendCtx.fetchAvatar(parseInt(id));
		if (avat) {
			setIcon(avat);
		}
	};

	useEffect(() => {
		if (props.currentDirect.ftAvatar) {
			setIcon(props.currentDirect.ftAvatar);
		} else {
			fetchAvatar((props.currentDirect.id))
		}
	}, [props.currentDirect])


	console.log("props.currentDirect ----> ")
	console.log(props.currentDirect)

	return (
		<div className="navbar-channel">
			<Avatar variant="rounded" className="channel-avatar-navbar"  src={icon} />
			<div className="name-channel">
				<h4>{props.currentDirect.username}</h4>
				<p>{props.currentDirect.status}</p>
			</div>

			{/* {isAdmin === 'ADMIN' &&
				<div className="btn-admin-channel">
					<SelectDialog
						onSelect={(userId: string) => setSelectedUser(userId)}
						onInvite={handleInviteUser}
						onAddAdmin={handleAddAdmin}
						type="invite-admin"
						/>
					{props.chatroom.visibility === 'PRIVATE' &&
						<SelectDialog
						onSelect={(userId: string) => setSelectedUser(userId)}
						onInvite={handleInviteUser}
						onAddAdmin={handleAddAdmin}
						type="invite-user"
						/>
					}
					{props.chatroom.visibility === 'PWD_PROTECTED' &&
						<ChannelsSettings role={isAdmin} onOpenModal={handleOpenModal} />
					}
				</div>
			} */}
			{/* <FontAwesomeIcon onClick={() => leaveChannel(props.chatroom.id)} icon={faArrowRightFromBracket} className="btn-dialog-navbar-leave"/> */}
			 {/* <Button onClick={() => leaveChannel(props.chatroom.id)}>Leave Channel</Button> */}
		</div>
	);
}
export default NavbarChannel;
