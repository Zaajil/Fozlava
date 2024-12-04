import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const NavLink = React.memo(({ to, isActive, onClick, children, isMobile }) => {
  if (isMobile) {
    return (
      <Link
        to={to}
        onClick={onClick}
        className={`flex items-center space-x-2 w-full p-3 rounded-lg transition-colors ${
          isActive
            ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
            : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
        }`}
      >
        <span>{children}</span>
        <ExternalLink className="w-4 h-4" />
      </Link>
    );
  }

  return (
    <Link
      to={to}
      className={`relative px-6 py-2 rounded-full text-sm font-medium transition-colors ${
        isActive
          ? "text-white"
          : "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
      }`}
    >
      {isActive && (
        <motion.div
          layoutId="navbar-indicator"
          className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full -z-10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      {children}
    </Link>
  );
});

export default NavLink;

