import React, { FormEvent, useContext, useEffect, useRef, useState } from 'react';
import AuthContext from '../../store/AuthContext';

// import 'Friend.css'

const Friends = () => {

	const username = localStorage.getItem('username');


	return (
		<div>Friends page - Voici la liste d'amis : </div>
	)
}

export default Friends
