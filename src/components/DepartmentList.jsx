import { motion, AnimatePresence } from 'framer-motion';
import { Users, ChevronUp, ChevronDown, Star } from 'lucide-react';

const DepartmentList = ({ departments, expandedTeam, toggleTeam, getTeamColor }) => {
  return (
    <div className="space-y-4">
      {Object.keys(departments).map((teamKey, index) => (
        <div
          key={teamKey}
          className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl overflow-hidden border border-gray-700"
        >
          <button
            onClick={() => toggleTeam(teamKey)}
            className="w-full p-6 flex justify-between items-center hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getTeamColor(index)} flex items-center justify-center`}>
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                {teamKey.replace('team', 'Team ')}
              </h3>
            </div>
            {expandedTeam === teamKey ? (
              <ChevronUp className="w-6 h-6 text-gray-400" />
            ) : (
              <ChevronDown className="w-6 h-6 text-gray-400" />
            )}
          </button>
          <AnimatePresence>
            {expandedTeam === teamKey && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="px-6 pb-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {departments[teamKey].map((dept, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-gray-300"
                    >
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{dept}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default DepartmentList;
