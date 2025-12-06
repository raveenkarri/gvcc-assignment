import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./index.css";

function Header({ user, onLogout }) {
  return (
    <header className="header-root">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          <span className="header-logo-mark">GV</span>
          <span className="header-logo-text">Product Enquiry</span>
        </Link>
        <nav className="header-nav">
          <NavLink to="/" className={({ isActive }) => (isActive ? "header-link header-link-active" : "header-link")}>
            Home
          </NavLink>
          {user && (
            <NavLink
              to="/enquiries"
              className={({ isActive }) =>
                isActive ? "header-link header-link-active" : "header-link"
              }
            >
              Enquiries
            </NavLink>
          )}
        </nav>
        <div className="header-auth">
          {user ? (
            <>
              <span className="header-user">Hi, {user.name}</span>
              <button type="button" className="header-btn" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="header-btn header-btn-secondary">
                Login
              </Link>
              <Link to="/register" className="header-btn">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
