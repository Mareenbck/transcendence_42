import ConversationDto from "./conversation/conversation.dto"

export class ConversationApi {
  static async getAll() : Promise<ConversationDto[]> {
    try {
      const resp = await fetch("http://localhost:3000/chatroom", {method: "GET"})
      const data = await resp.json();
          return data;
    }
    catch (err) {
      console.log(err);
    }

  };
}

export default ConversationApi;
