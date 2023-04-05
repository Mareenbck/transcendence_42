import './message.css'
import {format} from 'timeago.js'
import MyAvatar from '../../user/Avatar';

  export default function MessageD({ messageD, own, user, authCtx }) {
//console.log(messageD?.author)
      /*    className="messageImg"
          src={ avatar ? avatar : "http://localhost:8080/public/images/no-avatar.png"}
          alt="" />
*/
  return (
    <div className= {own ? "message own" : "message"}>
      <div className="messageTop">
        <MyAvatar authCtx={authCtx} id={user.id} style="xs" avatar={user.avatar} ftAvatar={user.ftAvatar}/>

        <p className="messageText">
          {messageD.content}
        </p>
      </div>
      <div className="messageBottom" > {user.username} - {format(messageD.createdAt)}</div>
    </div>

  );

}
