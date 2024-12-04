import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Logo = React.memo(({ onClick, isMobile }) => {
  if (isMobile) {
    return (
      <Link to="/" className="flex items-center space-x-2" onClick={onClick}>
        <span className="text-xl font-bold text-gray-900 dark:text-white">FOZLAVA</span>
      </Link>
    );
  }

  return (
    <Link to="/" className="flex items-center space-x-2 group">
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="relative w-8 h-8"
      >
        
      </motion.div>
      <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
        FOZLAVA
      </span>
    </Link>
  );
});

export default Logo;

