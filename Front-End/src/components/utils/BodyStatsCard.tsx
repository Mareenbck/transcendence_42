import React, { useEffect, useState } from "react";
import '../../style/Profile.css'

const BodyStatsCard = (props: any) => {

	const [icon, setIcon] = useState<string>("");

	useEffect(() => {
		if (props.icon === 'rank') {
			setIcon("fa-solid fa-bolt");
		} else if (props.icon === 'level') {
			setIcon("fa-solid fa-trophy");
		}
	}, [props.icon])

	return (
		<>
		<div className='flex'>
			<div className='background-icon'>
				<div className='font'>
					<i className={icon}></i>
				</div>
			</div>
			<h2>#12</h2>
		</div>
		</>
	)
}

export default BodyStatsCard;
