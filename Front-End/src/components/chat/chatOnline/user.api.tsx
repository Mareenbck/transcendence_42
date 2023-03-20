import UserDto from "./user.dto"

export class UserApi {
  static async getFriends(userId: number){
    try {
      const resp = await fetch(`http://localhost:3000/user/friends/${userId}`)
      const data = await resp.json();
          return data;
    }
    catch (err) {
      console.log(err);
    }

  };
}

export default UserApi;
