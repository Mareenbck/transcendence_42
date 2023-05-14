import AuthContext from '../../../store/AuthContext';
import { back_url } from '../../../config.json';

export class ConversationReq {



  static async getAll(user: any) {
    try {
      const resp = await fetch(back_url + "/chatroom2",
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
			const resp = await fetch(back_url + `/chatroom2`, {
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
