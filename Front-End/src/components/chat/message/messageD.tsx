import './message.css'
import {format} from 'timeago.js'

  export default function MessageD({ messageD, own }) {

  return (
    <div className= {own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg"
          alt="" />
        <p className="messageText">
          {messageD.content}
        </p>
      </div>
      <div className="messageBottom" > {format(messageD.createdAt)}</div>
    </div>

  );

}
