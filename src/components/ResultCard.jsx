import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';

const WinnerItem = React.memo(({ winner, type, index }) => {
  if (!winner) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center space-x-3"
    >
      {type === "individual" ? (
        typeof winner === "object" ? (
          <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {winner.name}
            </p>
            {winner.department && winner.year && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {winner.department}, {winner.year}
              </p>
            )}
          </div>
        ) : (
          <p className="flex-1 text-gray-900 dark:text-gray-100">{winner}</p>
        )
      ) : (
        <p className="flex-1 text-gray-900 dark:text-gray-100">{winner}</p>
      )}
    </motion.div>
  );
});

const ResultCard = React.memo(({ item, first, second, third, type, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative group"
      layout
    >
      <div className="absolute inset-0 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
      <div className="relative bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 bg-gray-800/50 border-b border-gray-700">
          <div className="flex items-center justify-center">
            <h3 className="text-lg font-semibold text-white">{item}</h3>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {first.length > 0 && (
            <div className="space-x-10">
              <div className="flex items-center space-x-2 text-yellow-500">
                <Trophy className="w-5 h-5" />
                <h4 className="font-medium">First Place</h4>
              </div>
              {first.map((winner, idx) => (
                <WinnerItem key={idx} winner={winner} type={type} index={idx} />
              ))}
            </div>
          )}
          {second.length > 0 && (
            <div className="space-x-10">
              <div className="flex items-center space-x-2 text-gray-400">
                <Medal className="w-5 h-5" />
                <h4 className="font-medium">Second Place</h4>
              </div>
              {second.map((winner, idx) => (
                <WinnerItem key={idx} winner={winner} type={type} index={idx} />
              ))}
            </div>
          )}
          {third.length > 0 && (
            <div className="space-x-10">
              <div className="flex items-center space-x-2 text-orange-600">
                <Award className="w-5 h-5" />
                <h4 className="font-medium">Third Place</h4>
              </div>
              {third.map((winner, idx) => (
                <WinnerItem key={idx} winner={winner} type={type} index={idx} />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

export default ResultCard;
