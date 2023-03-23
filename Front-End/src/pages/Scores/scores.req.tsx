//import JeuDto from "./scores.dto"

export class JeuReq {
  static async getJeux(roomId: number) {
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

export default JeuReq;
