import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-darkAccent text-lightAccent fixed w-full top-0 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-lightAccent">
          FOZLAVA
        </Link>
        <div className="flex space-x-6">
          <Link to="/" className="hover:text-accent">Home</Link>
          <Link to="/results" className="hover:text-accent">Results</Link>
          <Link to="/register" className="hover:text-accent">Register</Link>
          <Link to="/gallery" className="hover:text-accent">Gallery</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
