import ConversationDf from "./conversation.df"

export class ConversationReq {
  static async getAll() : Promise<ConversationDf[]> {
    try {
      const resp = await fetch("http://localhost:3000/chatroom2", {method: "GET"})
      const data = await resp.json();
          return data;
    }
    catch (err) {
      console.log(err);
    }

  };

  static async postRoom(user, newConv) {
    try {
      const resp = await fetch(`http://localhost:3000/chatroom2`, {
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
      // console.log("RESPONSE = ")
      // console.log(resp)
      // const respClone = resp.clone(); // créer une copie de la réponse
      const data = await resp.json(); // lire le corps de la copie de la réponse
      console.log("DATA")
      console.log(data)
      return data;
    } catch (err) {
      console.log("EST DANS LE ERROR DU CONVERSATION REQ");
      console.log(err);
    }
  };

  
}

export default ConversationReq;
