import React, { FormEvent, useContext } from "react";
import { FriendContext } from "../../store/FriendshipContext";
import Demand from '../../interfaces/IFriendship'


const FriendsDemands = (props: any) => {
	const friendCtx = props.context;
	const prendingDemands = friendCtx.demands.filter((demand: Demand) => demand.status === 'PENDING');

	const handleUpdate = async (event: FormEvent, demandId: number, res: string) => {
		event.preventDefault();
		friendCtx.updateDemand(demandId, res, props.token)
	}

	return (
		<>
		{/* <style>{customStyles}</style> */}
		<ul>
			{prendingDemands.map((demand: Demand) => (
				<li key={demand.id} className='friend'>
					{demand.requester.avatar ? <img className='avatar-img' src={demand.requester.avatar} alt={"avatar"} /> : <img className='avatar-img' src={demand.requester.ftAvatar} alt={"ftAvatar"} />}
					<span className='friend-username'>{demand.requester.username}</span>
					<form onSubmit={(event) => {handleUpdate(event, demand.id, 'ACCEPTED')}} className='accept'>
						<button type="submit" className='add-friend'><i className="fa-regular fa-circle-check"></i></button>
					</form>
					<form onSubmit={(event) => {handleUpdate(event, demand.id, 'REFUSED')}} className='deny'>
						<button type="submit" className='add-friend'><i className="fa-solid fa-xmark"></i></button>
					</form>
				</li>
			))}
		</ul>
		</>
	)
}

export default FriendsDemands;
