
import { useEffect, useState } from "react"
import UserApi from "./user.api"
import MessageApi from "./message/message.api"

import "./chatOnline.css";

export default function ChatOnline({onlineUsers, currentId, setCurrentChat}) {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  const handleClick = async (friend) => {
    try {
      const response = await MessageApi.getDirMess(currentId?.id, friend?.id);
      setMessagesD(response);
    } catch(err) {
      console.log(err);
    }
  };





  useEffect(()=>{
    const getFriends = async () => {
 //     const res = await UsersApi.getFriends();
//      setFriends(res.data);
    };
    getFriends();
  },[currentId]);

  console.log(onlineUsers);



return (
    <div className="chatOnline">
      { onlineUsers ? onlineUsers?.map((o) => (
        <div className="chatOnlineFriend" onclick={()=> handleClick(o)}}>
          <div className="chatOnlineImgContainer">
            <img  className="chatOnlineImg"
              src={ o?.userId.avatar ? o?.avatar : "http://localhost:8080/public/images/no-avatar.png"}
              alt=""
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName"> {o?.userId.username} </span>
        </div>
      )) : <span className="noConversationText2" > Nobody online. </span>}
    </div>
  );
}

