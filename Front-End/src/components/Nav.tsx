import React from "react";
import { Link } from "react-router-dom";

function Nav() {
	return (
		<header className="p-3 text-bg-dark">
			<div className="container">
				<div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
					<ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
						<li><Link to="/" className="nav-link px-2 text-white">Home</Link></li>
					</ul>
					<div className="text-end">
						<Link to="/signin" className="btn btn-outline-light me-2">Login</Link>
						<Link to="/signup" className="btn btn-outline-light me-2">Sign-up</Link>
					</div>
				</div>
			</div>
		</header>
	)
}

export default Nav;
