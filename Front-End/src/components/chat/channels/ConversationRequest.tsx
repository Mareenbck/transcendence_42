import AuthContext from '../../../store/AuthContext';

export class ConversationReq {

	
	
	static async getAll(user: any) {
		try {
			const env = process.env.BACKEND_URL
			const resp = await fetch(env + "/chatroom2",
      { method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        }
      });
      const data = await resp.json();
          return data;
    }
    catch (err) {
      console.log(err);
    }
  };

	static async postRoom(user: any, newConv: any) {
		try {
			const env = process.env.BACKEND_URL
			const resp = await fetch(env + `/chatroom2`, {
				method: "POST",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${user.token}`,
				},
				body: JSON.stringify(newConv),
			});
			if (!resp.ok) {
				const message = `An error has occurred: ${resp.status} - ${resp.statusText}`;
				throw new Error(message);
			}
			const data = await resp.json();
			return data;
		} catch (err) {
			console.log(err);
		}
	};
}

export default ConversationReq;
