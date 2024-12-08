import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';

const SponsorCard = () => {
  const [displayMode, setDisplayMode] = useState('popup'); // 'popup', 'banner', or 'hidden'
  const [showInitialPopup, setShowInitialPopup] = useState(true);

  useEffect(() => {
    // Show initial popup
    const timer = setTimeout(() => {
      setShowInitialPopup(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShowInitialPopup(false);
    setDisplayMode('banner');
  };

  if (displayMode === 'banner') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className=" top-16 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-violet-300 text-sm font-medium">Special Offer from our Sponsor!</span>
              <img
                src="image.png"
                alt="Sponsor"
                className="h-8 w-auto object-contain rounded"
              />
            </div>
            <motion.a
              href="https://www.aifer.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-violet-300 hover:text-violet-200 text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
              <ExternalLink className="w-4 h-4" />
            </motion.a>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      {showInitialPopup && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            className="absolute inset-0 bg-black/60 "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          
          <motion.div
            className="relative bg-black/95 rounded-lg shadow-xl max-w-md w-full mx-4"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            exit={{ y: 50 }}
          >
            <div className="p-6">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-violet-300 hover:text-violet-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <span className="text-violet-300 text-xs font-medium uppercase tracking-wider">
                  Sponsored
                </span>
                
                <img
                  src="image.png"
                  alt="Sponsor Advertisement"
                  className="w-full object-cover rounded-md shadow-md"
                />
                
                <div className="space-y-2">
                  <h3 className="text-white font-medium text-xl">Special Offer!</h3>
                  <p className="text-violet-200 text-sm leading-relaxed">
                    Discover amazing deals from our sponsor. Limited time offer!
                  </p>
                </div>

                <motion.a
                  href="https://www.aifer.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-violet-600 hover:bg-violet-700 text-white py-3 px-4 rounded-md transition-colors text-sm font-medium shadow-sm hover:shadow-md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Learn More
                  <ExternalLink className="w-4 h-4" />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SponsorCard;