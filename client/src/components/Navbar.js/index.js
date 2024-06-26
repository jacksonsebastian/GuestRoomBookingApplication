import React from "react";
import { Link } from "react-router-dom";
import CustomButton from "../Button.js";

const Navbar = ({ username, onLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)", borderBottom: "1px solid #ddd" }}>
      <div className="container">
        <Link className="navbar-brand" to="/dashboard">
          Dashboard
        </Link>
        {username && <span className="navbar-text me-2">Hello, {username}</span>}
        <CustomButton text="Logout" onClick={onLogout} />
      </div>
    </nav>
  );
};

export default Navbar;
