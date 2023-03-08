import './message.css'
//import {format} from 'timeago.js'  {format(message2.createdAt)}

export default function Message2({ message2, own }) {

  return (
    <div className= {own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg"
          alt="" />
        <p className="messageText">
         {message2.content}
        </p>
      </div>
      <div className="messageBottom" > {(message2.createdAt)} </div>
    </div>

  );
}
