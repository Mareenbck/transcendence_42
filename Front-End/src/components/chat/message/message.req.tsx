import AuthContext from '../../../store/AuthContext';

export class MessageReq {
	static async getMess(user: any, roomId: number) {
		try {
			const env = process.env.BACKEND_URL
			const resp = await fetch(env + `/chat-mess/room/${roomId}`,{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.token}`
				}
			});
			const data = await resp.json();
			return data;
		} catch (err) {
			console.log(err);
		}
	};

	static async postMess(user: any, message2: any) {
		try {
			const env = process.env.BACKEND_URL
			const resp = await fetch(env + `/chat-mess`, {
				method: "post",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.token}`,
				},
				body: JSON.stringify(message2),
			});
			if (!resp.ok) {
				const message = `An error has occured: ${resp.status} - ${resp.statusText}`;
				throw new Error(message);
			}
			const data = await resp.json();
			return data;
		} catch (err) {
			console.log(err);
		}
	};

	static async getDirMess(user: any, me: number, friend: number) {
		try {
			const env = process.env.BACKEND_URL
			const resp = await fetch(env + `/dir-mess/${me}/${friend}`,{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.token}`
				}
			});
			const data = await resp.json();
			return data;
		} catch (err) {
			console.log(err);
		}
	};

	static async postDirMess(user: any, messageD: any) {
		try {
			const env = process.env.BACKEND_URL
			const resp = await fetch(env + `/dir-mess`, {
				method: "post",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.token}`,
				},
				body: JSON.stringify(messageD),
			});
			if (!resp.ok) {
				const messageD = `An error has occured: ${resp.status} - ${resp.statusText}`;
				throw new Error(messageD);
			}
			const data = await resp.json();
			return data;
		} catch (err) {
			console.log(err);
		}
	};
}

export default MessageReq;

