import "./conversation.css"

export default function Conversation({conversation}) {
  return (
   <div className="conversation">
      <img
        className="conversationImg"
        src={"http://localhost:8080/public/images/no-avatar.png"}
        alt=""
      />
      <span className="conversationName"  > {conversation.name} </span>
    </div>
  );

}
