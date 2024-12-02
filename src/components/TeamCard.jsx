import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

const TeamCard = ({ team, index, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-1`}
      layout
    >
      <div className="bg-gray-900 rounded-xl p-6 h-full">
        <div className="absolute inset-0 flex items-center right-12 mb-4 justify-end text-lightAccent text-opacity-30 font-bold text-[150px] select-none">
          {index + 1}
        </div>
        {index === 0 && (
          <div className="absolute top-4 right-4">
            <Trophy className="w-8 h-8 text-yellow-400" />
          </div>
        )}
        <h2 className="text-2xl font-bold text-white mb-2">{team.team}</h2>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-white">{team.totalPoints}</span>
          <span className="text-gray-400 text-sm">points</span>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamCard;
