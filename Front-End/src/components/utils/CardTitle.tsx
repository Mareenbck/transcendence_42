import React, { useEffect, useState } from "react";
import '../../style/Profile.css'

const TitleCard = (props: any) => {

	const styles = {
		background: props.color,
	  };

	return (
		<>
		<div className="title">
			<div className="status" style={styles}></div>
			<h5>{props.title}</h5>
		</div>
		</>
	)
}

export default TitleCard;
