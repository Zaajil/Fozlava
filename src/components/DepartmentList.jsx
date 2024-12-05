import { motion, AnimatePresence } from 'framer-motion';
import { Users, ChevronUp, ChevronDown, Bookmark } from 'lucide-react';

export default function DepartmentList({ departments, expandedTeam, toggleTeam, getTeamColor }) {
  return (
    <div className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-purple-900/10 to-black/0" />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <h2 className="text-4xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          TEAM DEPARTMENTS
        </h2>
        
        <div className="grid gap-6">
          {Object.entries(departments).map(([teamKey, depts], index) => (
            <motion.div
              key={teamKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className={`relative rounded-2xl bg-gradient-to-r ${getTeamColor(index)} p-0.5`}>
                <div className="bg-gray-900/95 rounded-2xl">
                  <button
                    onClick={() => toggleTeam(teamKey)}
                    className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors rounded-t-2xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">
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
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 pt-0">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {depts.map((dept, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="flex items-center gap-3 bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors"
                              >
                                <Bookmark className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-200">{dept}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}