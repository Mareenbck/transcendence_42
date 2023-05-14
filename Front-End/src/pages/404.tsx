import React from "react";
import '../style/404.css';

export default function NotFound(props: any) {
    return (
      <div className="not-found-page">
        <div className="not-found">
          <iframe
            src="https://giphy.com/embed/sIIhZliB2McAo"
            width="480"
            height="304"
            className="giphy-embed"
            allowFullScreen
          ></iframe>
          <p>
            <a href="https://giphy.com/gifs/nyan-cat-sIIhZliB2McAo"></a>
          </p>
          <h1>404 not found</h1>
        </div>
      </div>
    );
  }
