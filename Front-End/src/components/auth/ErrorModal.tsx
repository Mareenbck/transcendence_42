import React from 'react';
import '../../style/ErrorModal.css';

function ErrorModal(props: any) {
	return (
		<div className='back'>
			<div className="modal-contain">
				<header className="header-modal">
					<h2>{props.title}</h2>
				</header>
				<div className='content'>
					<p>{props.message}</p>
				</div>
				<footer className='actions'>
					<button onClick={props.onConfirm}>OK</button>
				</footer>
			</div>
		</div>
	)
}

export default ErrorModal;
