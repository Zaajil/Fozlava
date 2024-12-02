import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

const TeamCard = React.memo(({ team, index, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${color} p-1.5 transform hover:scale-[1.02] transition-transform duration-300`}
      layout
    >
      <div className="bg-gray-900 rounded-2xl p-8 h-full relative overflow-hidden">
      <div className="absolute inset-0 flex items-center right-8  mb-4 justify-end text-lightAccent text-opacity-30 font-bold text-[150px] select-none">
          {index + 1}
        </div>

        {index === 0 && (
          <motion.div
            initial={{ rotate: -15, scale: 0.5 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
              delay: 0.3,
            }}
            className="absolute top-6 right-6"
          >
            <Trophy className="w-10 h-10 text-yellow-400 drop-shadow-lg" />
          </motion.div>
        )}

        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            className="text-3xl font-bold text-white mb-4 leading-tight"
          >
            {team.team}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className="flex items-baseline gap-2"
          >
            <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              {team.totalPoints}
            </span>
            <span className="text-gray-400 text-lg font-medium">points</span>
          </motion.div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
});

export default TeamCard;
