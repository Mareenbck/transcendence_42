import './Profile.css'
import '../App.tsx'
import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import { useNavigate, useParams } from 'react-router';

// export interface ProfileData {
// 	username: string;
// }

/**function Enter(propes) { */
const Profile = () =>  {
	// const [profile, setProfile] = useState<ProfileData | null>(null);
	const [user, setUser] = useState(null);
	// const [username, setUsername] = useState<String>("");
    /**const [showEvents, setShowEvents] = useState(true)*/

    /**const handelClick = () => {
	 console.log(titel)
	 setShowEvents(false)
    }*/
	useEffect(() => {
		fetch('http://localhost:3000/users/profile', {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`, // On envoie le token JWT dans les headers
			},
		})
			.then((response) => response.json())
			.then((data) => setUser(data))
			.catch((error) => console.error(error));
	}, []);


	// const { username } = useParams();
	// const token = localStorage.getItem('access_token');
	// console.log(token);
	// const decodeJwt = (token) => {
	// 	try {
	// 		const decoded = jwt.verify(token, 'yoursecretkey');
	// 		return decoded;
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// };

	// const getUsername = (token) => {
	// 	const decoded = decodeJwt(token);
	// 	return decoded.username;
	// };
	// const username = getUsername(token);
	if (!user) {
		return <div>Loading...</div>; // On peut afficher un loader ou un message d'attente si les données ne sont pas encore disponibles
	}

	return (
		<div>
			<h2>Profile</h2>
			<p>Welcome, {user.username}!</p> {/* Ici on affiche le nom d'utilisateur */}
			{/* Vous pouvez afficher d'autres informations de profil ici */}
		</div>
	);
}


export default Profile
