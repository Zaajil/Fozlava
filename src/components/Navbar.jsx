import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; // Replace Next.js-specific imports
import { Menu, X } from "lucide-react"; // Icons

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation(); // React Router's useLocation to get the current path

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Results", path: "/results" },
    { name: "Register", path: "/register" },
    { name: "Gallery", path: "/gallery" },
  ];

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-lightAccent/50 shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">
              FOZLAVA
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
  {navItems.map((item) => (
    <Link
      key={item.name}
      to={item.path}
      className={`text-base font-semibold px-4 py-2 rounded-full transition-colors hover:bg-primary hover:text-white ${
        location.pathname === item.path
          ? "bg-primary text-white"
          : scrolled
          ? "text-gray-900"
          : "text-gray"
      }`}
    >
      {item.name}
    </Link>
  ))}
</div>


          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white ${
                scrolled ? "text-gray-900" : "text-gray"
              }`}
            >
              {isOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50">
            <div className="fixed inset-y-0 right-0 max-w-full flex flex-col w-full bg-white shadow-xl">
              <div className="flex items-center justify-between h-16 px-4 sm:px-6">
                <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center">
                  <span className="text-2xl font-bold text-primary">FOZLAVA</span>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 px-4 sm:px-6">
  <nav className="grid gap-y-6">
    {navItems.map((item) => (
      <Link
        key={item.name}
        to={item.path}
        onClick={() => setIsOpen(false)}
        className={`text-center text-lg font-medium px-6 py-3 rounded-full border transition-colors hover:bg-primary hover:text-white ${
          location.pathname === item.path
            ? "bg-primary text-white"
            : "text-gray-900 border-gray-300"
        }`}
      >
        {item.name}
      </Link>
    ))}
  </nav>
</div>

            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
