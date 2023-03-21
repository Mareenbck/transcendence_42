import './message.css'
import {format} from 'timeago.js'

  export default function MessageD({ messageD, own }) {
//console.log(messageD?.author)
  return (
    <div className= {own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
       //   src={ messageD?.author.avatar ? messageD?.author.avatar : "http://localhost:8080/public/images/no-avatar.png"}
          alt="" />
        <p className="messageText">
          {messageD.content}
        </p>
      </div>
      <div className="messageBottom" > {format(messageD.createdAt)}</div>
    </div>

  );

}
