import "./conversation.css"

export default function Conversation() {
  return (


   <div className="conversation">
      <img
        className="conversationImg"
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg"

//        src={
//          user?.profilePicture
//            ? PF + user.profilePicture
 //           : PF + "https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg"
   //     }
        alt=""
      />
      <span className="conversationName">John</span>
    </div>
  );

}
