import "./conversation.css"

export default function Conversation({conversation}) {
  return (
   <div className="conversation">
     {/* <img className='avatar-img' src={conversation.avatar} alt="avatar"></img> */}
      {/* <img
        className="conversationImg"
        src={conversation.avatar ? conversation.avatar : "http://localhost:8080/public/images/no-avatar.png"}
        alt=""
      /> */}
      <span className="conversationName"  > {conversation.name} </span>
    </div>
  );

}
