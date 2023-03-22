import React, { useContext, useState, useEffect } from "react";
import '../../style/Sidebar.css'
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../../store/AuthContext";


const Sidebar = (props: any) => {

    const authCtx = useContext(AuthContext);
    const [activeLink, setActiveLink] = useState('');
    const location = useLocation();

    const links = [
        { name: "Play Games", path: "/game/play" },
        { name: "Chat", path: "/chat/message" },
        { name: "Profile", path: `/users/profile/${authCtx.userId}` },
        { name: "Settings", path: "/settings" },
        { name: "Scores", path: "/scores" },
        { name: "Show users", path: `/friends` },
      ];

      useEffect(() => {
        setActiveLink(location.pathname);
      }, [location.pathname]);

      const handleLinkClick = (path: string) => {
        setActiveLink(path);
      };

    return (
        <div className="sidebar">
            <h4>{props.title}</h4>
            <button onClick={authCtx.logout}>LogOut</button>
            <div className="links">
                <ul>
                    {links.map((link) => (
                        <li key={link.path}>
                            <div className="li">
                                <div className="hexa">
                                    <span className="bi bi-hexagon-fill"></span>
                                    <span className="bi bi-hexagon" id="bord"></span>
                                </div>
                                <Link to={link.path} onClick={() => handleLinkClick(link.path)}
                                    className={activeLink === link.path ? "active" : ""}> {link.name}
                                </Link>
                            </div>
                            <br />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Sidebar;
