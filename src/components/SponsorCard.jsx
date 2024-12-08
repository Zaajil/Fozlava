import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MinusSquare, Maximize2, ExternalLink } from 'lucide-react';

const SponsorCard = () => {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed sm:bottom-8 sm:right-8 bottom-0 right-0 z-50"
    >
      <AnimatePresence mode="wait">
        {isMinimized ? (
          <motion.div
            key="minimized"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-black backdrop-blur-sm p-2 rounded-full shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
            onClick={() => setIsMinimized(false)}
          >
            <Maximize2 className="w-6 h-6 text-violet-300" />
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-black backdrop-blur-sm sm:p-4 p-3 sm:rounded-lg rounded-none shadow-lg sm:max-w-xs w-full sm:w-auto"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-violet-300 text-xs font-medium uppercase tracking-wider">Sponsored</span>
              <button
                onClick={() => setIsMinimized(true)}
                className="text-violet-300 hover:text-violet-200 transition-colors"
              >
                <MinusSquare className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <img
                src="image.png"
                alt="Sponsor Advertisement"
                className="w-full h-32 object-cover rounded-md shadow-md"
              />
              
              <div className="space-y-2">
                <h3 className="text-white font-medium text-lg">Special Offer!</h3>
                <p className="text-violet-200 text-sm leading-relaxed">
                  Discover amazing deals from our sponsor. Limited time offer!
                </p>
              </div>

              <motion.a
                href="https://www.aifer.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-violet-600 hover:bg-violet-700 text-white py-2.5 px-4 rounded-md transition-colors text-sm font-medium shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Learn More
                <ExternalLink className="w-4 h-4" />
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SponsorCard;