import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { Download, Share2 } from 'lucide-react';
import Firstbadge from '../assets/1st.png';
import Secondbadge from '../assets/2nd.png';
import Thirdbadge from '../assets/3rd.png';
import Logo from '../assets/logo.png';
import Congrats from '../assets/cngrts.png';
import Background from '../assets/onstage.jpg';

const ResultCard = ({ item, type, first, second, third, index }) => {
  const [loading, setLoading] = useState(false);
  const posterRef = useRef(null);

  const calculateFontSize = (totalWinners) => {
    if (totalWinners <= 3) return 'text-lg sm:text-xl';
    if (totalWinners <= 6) return 'text-md sm:text-lg';
    if (totalWinners <= 9) return 'text-sm sm:text-md';
    if (totalWinners <= 12) return 'text-xs sm:text-sm';
    return 'text-[10px] sm:text-xs';
  };

  const renderWinner = (winner, fontSize) => (
    <div className={`flex items-center ${fontSize}`}>
      {type === 'individual' ? (
        <div className="flex flex-col items-start ">
          <p className="font-medium text-black dark:text-black">{winner.name}</p>
          {winner.department && winner.year && (
            <p className="text-xs sm:text-sm text-black dark:text-black">
              {winner.department}, {winner.year}
            </p>
          )}
          {winner.group && (
            <p className="text-xs sm:text-sm text-black dark:text-black">{winner.group}</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-start">
          <p className="font-medium text-black dark:text-black">{winner}</p>
        </div>
      )}
    </div>
  );

  const renderBadge = (winnerArray, badgeSrc, position) => {
    if (type === 'individual') {
      const validWinners = winnerArray.filter(winner => winner.name && winner.name.trim() !== '');
      if (validWinners.length > 0) {
        return (
          <div className="flex items-start relative left-8 space-x-2 sm:space-x-4 mb-2 sm:mb-4">
            <img src={badgeSrc} alt={`${position} Badge`} className="w-6 sm:w-8 h-auto" />
            <div className={`flex flex-col ${calculateFontSize(validWinners.length)}`}
            style={{ minHeight: '2.5rem', // Fixed height to avoid layout shifts
              lineHeight: '1.5',   // Ensure consistent line height
            }}
            >
              {validWinners.map((winner, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {renderWinner(winner, calculateFontSize(validWinners.length))}
                </motion.div>
              ))}
            </div>
          </div>
        );
      }
    } else if (type === 'group') {
      const validGroup = winnerArray.filter(group => typeof group === 'string' && group.trim() !== '');
      if (validGroup.length > 0) {
        return (
          <div className="flex justify-center items-center space-x-2 sm:space-x-4 mb-2 sm:mb-4">
            <img src={badgeSrc} alt={`${position} Badge`} className="w-6 sm:w-8 h-auto" />
            <div className={`flex flex-col ${calculateFontSize(validGroup.length)}`}
            style={{ minHeight: '2.5rem', // Fixed height to avoid layout shifts
              lineHeight: '1.5',   // Ensure consistent line height
            }}
            >
              {validGroup.map((group, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {renderWinner(group, calculateFontSize(validGroup.length))}
                </motion.div>
              ))}
            </div>
          </div>
        );
      }
    }
    return null;
  };

  const getPosterHeight = () => {
    const getValidWinnerCount = (winnerArray) => {
      if (type === 'individual') {
        return winnerArray.filter(winner => winner.name && winner.name.trim() !== '').length;
      } else if (type === 'group') {
        return winnerArray.filter(group => typeof group === 'string' && group.trim() !== '').length;
      }
      return 0;
    };
  
    const firstCount = Array.isArray(first) ? getValidWinnerCount(first) : 0;
    const secondCount = Array.isArray(second) ? getValidWinnerCount(second) : 0;
    const thirdCount = Array.isArray(third) ? getValidWinnerCount(third) : 0;
  
    const totalWinners = firstCount + secondCount + thirdCount;
    
    if (totalWinners <= 3) {
      return 'h-[400px] sm:h-[500px]';
    } else if (totalWinners <= 5) {
      return 'h-[430px] sm:h-[550px]';
    } else if (totalWinners <= 9) {
      return 'h-[600px] sm:h-[700px]';
    } else {
      return 'h-[750px] sm:h-[850px]';
    }
  };

  const downloadPoster = async () => {
    try {
      setLoading(true);
      await document.fonts.ready; // Wait for fonts to load fully
  
      const canvas = await html2canvas(posterRef.current, {
        scale: 5,
        useCORS: true,
        logging: false,
        onclone: (clonedDoc) => {
          // Disable animations and transitions in the cloned DOM
          clonedDoc.querySelectorAll('*').forEach((el) => {
            el.style.animation = 'none';
            el.style.transition = 'none';
          });
  
          // Ensure layout stability
          const clonedPoster = clonedDoc.querySelector('#poster-content');
          if (clonedPoster) {
            clonedPoster.style.transform = 'none';
          }
        },
      });
  
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `${item}-poster.jpg`;
      link.click();
    } catch (error) {
      console.error('Error generating the poster:', error);
      alert('An error occurred while downloading the poster. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sharePoster = async () => {
    try {
      setLoading(true);
      const canvas = await html2canvas(posterRef.current, {
        scale: 5,
        useCORS: true,
        logging: false,
        onclone: (clonedDoc) => {
          const clonedPoster = clonedDoc.querySelector('#poster-content');
          if (clonedPoster) {
            clonedPoster.style.transform = 'none';
          }
        }
      });
      canvas.toBlob((blob) => {
        const file = new File([blob], `${item}-poster.jpg`, { type: 'image/jpeg' });
        if (navigator.share) {
          navigator.share({
            title: `${item} Poster`,
            text: `Check out the results for ${item}`,
            files: [file],
          }).catch(console.error);
        } else {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(file);
          link.download = `${item}-poster.jpg`;
          link.click();
        }
      }, 'image/jpeg');
    } catch (error) {
      console.error("Error sharing the poster:", error);
      alert("An error occurred while sharing the poster. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative group w-full mb-6"
    >
      <div className="relative w-full flex justify-center items-center">
        <div
          ref={posterRef}
          className={`w-full max-w-[320px] sm:max-w-[400px] p-4 shadow-xl bg-cover bg-center ${getPosterHeight()}`}
          style={{
            backgroundImage: `url(${Background})`,
          }}
        >
          <div id="poster-content" className="flex flex-col items-center space-y-2 sm:space-y-4">
            <div className="relative w-24 sm:w-32 h-auto mb-1 sm:mb-2">
              <img src={Logo} alt="Logo" className="w-full h-auto mx-auto" />
            </div>
            <div className="font-bold uppercase text-center text-xs sm:text-sm">{item}</div>
            <div className="bg-white/70 p-2 sm:p-4 rounded-2xl items-center justify-center gap-1 sm:gap-2 space-y-2 sm:space-y-4 w-full">
              {renderBadge(first, Firstbadge, 'First')}
              {renderBadge(second, Secondbadge, 'Second')}
              {renderBadge(third, Thirdbadge, 'Third')}
            </div>
            <div className="mt-1 sm:mt-2">
              <img src={Congrats} alt="Congratulations" className="w-36 sm:w-36 mx-auto" />
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-900 z-10">
          <div className="animate-spin rounded-full border-t-4 border-blue-500 w-16 h-16"></div>
        </div>
      )}

      <div className="mt-4 flex space-x-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={downloadPoster}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md shadow-md hover:shadow-lg transition duration-200 flex items-center space-x-2"
        >
          <Download size={18} />
          <span>Download</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={sharePoster}
          className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md shadow-md hover:shadow-lg transition duration-200 flex items-center space-x-2"
        >
          <Share2 size={18} />
          <span>Share</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default React.memo(ResultCard);

