import './message.css'

export default function Message2({ message, own }) {
  return (
    <div className= {own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg"
          alt="" />
        <p className="messageText">
          lorem ipsum erthyertherth trqscqscqsc  azazdxaz xz hrthserth
        </p>
      </div>
      <div className="messageBottom" > 1h ago </div>
    </div>

  );
}
