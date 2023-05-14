import React, { useContext, useState, useEffect } from "react";
import '../style/Sidebar.css'
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../store/AuthContext";
import MyAccountMenu from "./AccountMenu";


const Sidebar = (props: any) => {
    const authCtx = useContext(AuthContext);
    const [activeLink, setActiveLink] = useState('');
    const location = useLocation();
    const [username, setUsername] = useState(authCtx.username)

    const links = [
        { name: "Game", path: "/game" },
        { name: "Chat", path: "/chat/message" },
        { name: "Scores", path: "/scores" },
      ];

      useEffect(() => {
        setActiveLink(location.pathname);
      }, [location.pathname]);

      useEffect(() => {
        setUsername(authCtx.username);
      }, [authCtx.username]);

      const handleLinkClick = (path: string) => {
        setActiveLink(path);
      };

    return (
        <div className="sidebar">
            <div className="title">
                <MyAccountMenu authCtx={authCtx}></MyAccountMenu>
                <h4>{username}</h4>
            </div>
            <br />
            <br />
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
                            <br />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Sidebar;
