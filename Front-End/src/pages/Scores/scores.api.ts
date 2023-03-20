import JeuDto from "./scores.dto"

export class JeuApi {
  static async getJeux(roomId: number) : Promise<JeuDto[]> {
    try {
      const resp = await fetch(`http://localhost:3000/jeux`)
      const data = await resp.json();
      return data;
    }
    catch (err) {
      console.log(err);
    }
  };
}

export default JeuApi;
