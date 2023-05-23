import AuthContext from '../store/AuthContext';

export class Fetch {

	static async fetch(token: string, method: string, endPoint: string, par? : string | number, par2? :string | number) {
		try {
			if (par2 !== undefined && par !== undefined) { par = par + '\/' + par2; }
			if (par !== undefined) { endPoint = endPoint + '\/' + par; }
			const resp = await fetch("http://" + window.location.hostname + ':3000'  + `/${endPoint}`, {
				method: method,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				}
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

	static async postBlock(token: string, him: number, me: number) {
		try {
			const resp = await fetch("http://" + window.location.hostname + ':3000'  + `/users/block`, {
				method: "POST",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({blockFrom: me, blockTo: him}),
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

	static async postUnblock(token: string, him: number, me: number) {
		try {
			const resp = await fetch("http://" + window.location.hostname + ':3000'  + `/users/unblock`, {
				method: "POST",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({blockFrom: me, unblockTo: him}),
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
}

export default Fetch;

