
import { useEffect, useState } from "react";
import "./chatOnline.css";

export default function ChatOnline() {


return (
    <div className="chatOnline">
        <div className="chatOnlineFriend">
          <div className="chatOnlineImgContainer">
            <img  className="chatOnlineImg"  src="https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg"

//              className="chatOnlineImg"
  //            src={
    //            o?.profilePicture
      //            ? PF + o.profilePicture
        //          : PF + "person/noAvatar.png"
          //    }
              alt=""
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">CCCCC</span>
        </div>
    </div>
  );
}

