import MessageDf from "./message.df"
import MessageDDf from "./messageD.df"

export class MessageReq {
  static async getMess(roomId: number) : Promise<MessageDf[]> {
    try {
      const resp = await fetch(`http://localhost:3000/chat-mess/room/${roomId}`)
      const data = await resp.json();
      return data;
    }
    catch (err) {
      console.log(err);
    }

  };

  static async postMess(message2) : Promise<MessageDf[]> {
    try {
      console.log(message2);
      const resp = await fetch(`http://localhost:3000/chat-mess`,
      {
        method: "post",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(message2),
      },);

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

  static async getDirMess(me: number, friend: number) : Promise<MessageDDf[]> {
    try {
      const resp = await fetch(`http://localhost:3000/dir-mess/${me}/${friend}`)
      const data = await resp.json();
      return data;
    }
    catch (err) {
      console.log(err);
    }
  };

  static async postDirMess(messageD) : Promise<MessageDDf[]> {
    try {
      const resp = await fetch(`http://localhost:3000/dir-mess`,
      {
        method: "post",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(messageD),
      },);

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

