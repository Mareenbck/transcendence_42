import AuthContext from '../../store/AuthContext';

export class ChatReq {

  static async getAllUsersWithBlocked(user: AuthContext) {
    try {
      const resp = await fetch(`http://localhost:3000/users/block/users`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        }
      });
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

  static async postBlock(user: AuthContext, userId: number) {
    try {
      const resp = await fetch(`http://localhost:3000/users/block`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({blockFrom: user.userId, blockTo: userId}),
      });

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

  static async postUnblock(user: AuthContext, userId: number) {
    try {
      const resp = await fetch(`http://localhost:3000/users/unblock`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({blockFrom: user.userId, unblockTo: userId}),
      });

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

export default ChatReq;

