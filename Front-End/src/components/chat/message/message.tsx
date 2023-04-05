import './message.css'
import {format} from 'timeago.js'

export default function Message2({ message2, own, avatar, nameA }) {

 // console.log(message2);

  return (
    <div className= {own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src={ avatar ? avatar : "http://localhost:8080/public/images/no-avatar.png"}
          alt="" />
        <p className="messageText">
         {message2.content}
        </p>
      </div>
      <div className="messageBottom" > {nameA} - {format(message2.createdAt)}</div>
    </div>

  );

}

