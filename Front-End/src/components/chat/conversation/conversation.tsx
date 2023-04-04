import "./conversation.css"

export default function Conversation({conversation}) {
  return (
   <div className="conversation">
      <span className="conversationName"  > {conversation.name} </span>
    </div>
  );

}
