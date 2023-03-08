import MessageDto from "./message.dto"

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


}

export default MessageApi;

