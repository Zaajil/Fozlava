import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to handle menu visibility

  return (
    <nav className="bg-darkAccent text-lightAccent fixed w-full top-0 shadow-lg h-16 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold  text-lightAccent">
          FOZLAVA
        </Link>

        {/* Hamburger Icon */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="block md:hidden focus:outline-none text-lightAccent"
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        {/* Links for Larger Screens */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-accent">Home</Link>
          <Link to="/results" className="hover:text-accent">Results</Link>
          <Link to="/register" className="hover:text-accent">Register</Link>
          <Link to="/gallery" className="hover:text-accent">Gallery</Link>
        </div>
      </div>

      {/* Full-Screen Overlay for Small Screens */}
      {isOpen && (
        <div className="fixed inset-0 bg-lightAccent text-secondary flex flex-col items-center justify-items-start z-50">
          {/* Close Button */}
          <div className="absolute top-4 right-4 flex items-center">
            <div className="transform -translate-x-20 ">
            <h1 className="text-2xl font-bold text-secondary mr-4">FOZLAVA</h1>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="focus:outline-none"
            >
              <svg
                className="w-8 h-8"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex flex-col space-y-6 mt-24 w-3/4">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="bg-primary text-white px-6 py-3 rounded-lg text-center font-semibold hover:bg-secondary"
            >
              Home
            </Link>
            <Link
              to="/results"
              onClick={() => setIsOpen(false)}
              className="bg-primary text-white px-6 py-3 rounded-lg text-center font-semibold hover:bg-secondary"
            >
              Results
            </Link>
            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="bg-primary text-white px-6 py-3 rounded-lg text-center font-semibold hover:bg-secondary"
            >
              Register
            </Link>
            <Link
              to="/gallery"
              onClick={() => setIsOpen(false)}
              className="bg-primary text-white px-6 py-3 rounded-lg text-center font-semibold hover:bg-secondary"
            >
              Gallery
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
