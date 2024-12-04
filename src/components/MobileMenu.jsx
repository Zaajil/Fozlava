import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import NavLink from './NavLink';
import Logo from './Logo';

const MobileMenu = React.memo(({ isOpen, onClose, navItems, currentPath }) => {
  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.15,
        ease: "easeIn",
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: 50 },
    open: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={menuVariants}
      className="fixed inset-0 z-50 md:hidden will-change-transform"
    >
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-gray-900 shadow-xl"
        variants={menuVariants}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
          <Logo onClick={onClose} isMobile />
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-6 h-6 text-gray-900 dark:text-gray-100" />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-3">
            {navItems.map((item) => (
              <motion.li key={item.name} variants={itemVariants}>
                <NavLink
                  to={item.path}
                  isActive={currentPath === item.path}
                  onClick={onClose}
                  isMobile
                >
                  {item.name}
                </NavLink>
              </motion.li>
            ))}
          </ul>
        </nav>
      </motion.div>
    </motion.div>
  );
});

export default MobileMenu;
