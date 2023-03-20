import MessageDto from "./message.dto"
import MessageDDto from "./messageD.dto"

export class MessageApi {
  static async getMess(roomId: number) : Promise<MessageDto[]> {
    try {
      const resp = await fetch(`http://localhost:3000/chat-mess/room/${roomId}`)
      const data = await resp.json();
      return data;
    }
    catch (err) {
      console.log(err);
    }

  };

  static async postMess(message2) : Promise<MessageDto[]> {
    try {
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

  static async getDirMess(me: number, friend: number) : Promise<MessageDDto[]> {
    try {
      const resp = await fetch(`http://localhost:3000/dir-mess/${me}/${friend}`)
      const data = await resp.json();
      return data;
    }
    catch (err) {
      console.log(err);
    }

  };

  static async postDirMess(messageD) : Promise<MessageDDto[]> {
//    console.log(messageD)
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

export default MessageApi;

