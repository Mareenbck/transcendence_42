import React from "react";
import '../../style/Profile.css'

const ScoresMatch = (props: any) => {

	const formattedDate = (dateString :string) => {
		const date = new Date(dateString);
		const dateStr = date.toLocaleString('en-US',  { day: 'numeric', month: 'long' });
		const day = date.getDate();
		const suffix = day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th';
		return `${day}${suffix} ${dateStr.split(' ')[0]} `;
	};

	return (
		<>
			<div className="score-history">
				<div className="scores-container">
					<span>{props.score1}</span>
					<span className="score">-</span>
					<span>{props.score2}</span>
				</div>
				{(props.date) && <div className="date">
					{formattedDate(props.date)}
				</div>}
			</div>
		</>
	)
}

export default ScoresMatch;
