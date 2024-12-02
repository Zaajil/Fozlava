import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Trophy, Star, ChevronDown, ChevronUp, Users } from 'lucide-react';
import Footer from './Footer'

const HomePage = () => {
  const navigate = useNavigate();
  const [pointsTable, setPointsTable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTeam, setExpandedTeam] = useState(null);

  const departments = {
    teamA: [
      "Maths", "Statistics", "Management Studies", "Geology", "History", "English (Aided)", "Library Science"
    ],
    teamB: [
      "Physics", "Chemistry", "Computer Science", "B.Voc IT", "Malayalam", "Functional English", "English (SF)"
    ],
    teamC: [
      "Psychology (SF)", "Psychology (Aided)", "Commerce", "Zoology", "Botany", "Sociology"
    ],
    teamD: [
      "BCom CA", "Arabic", "Economics", "BMMC", "B.Voc Auto", "MCJ"
    ]
  };

  useEffect(() => {
    const fetchPointsTable = async () => {
      try {
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbxu0ehjZKgAxTq4REiMrfdZlE5eZ5IhyURpggvW0AJEA8ikdzqOaRrbeg3_2Ag5jIXJGg/exec"
        );
        const data = await response.json();

        if (data && data.totalPoints) {
          const formattedTable = data.totalPoints.map((row) => ({
            team: row.team || "Unknown Team",
            totalPoints: row.totalPoints || 0,
          }));
          const sortedTable = formattedTable.sort((a, b) => b.totalPoints - a.totalPoints);
          setPointsTable(sortedTable);
        }
      } catch (error) {
        console.error("Error fetching total points:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPointsTable();
  }, []);

  const toggleTeam = (teamKey) => {
    setExpandedTeam(expandedTeam === teamKey ? null : teamKey);
  };

  const getTeamColor = (index) => {
    const colors = [
      "from-yellow-400 to-orange-500",
      "from-blue-400 to-indigo-500",
      "from-green-400 to-emerald-500",
      "from-purple-400 to-pink-500"
    ];
    return colors[index] || colors[0];
  };

  return (
    <div>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="absolute inset-0  opacity-10 bg-cover bg-center" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.h1
            className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            FOZLAVA
          </motion.h1>
          <motion.p
            className="text-gray-300 text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
          </motion.p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {pointsTable.map((team, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${getTeamColor(index)} p-1`}
                >
                  <div className="bg-gray-900 rounded-xl p-6 h-full">
                  <div className="absolute inset-0 flex items-center right-12 mb-4 justify-end text-lightAccent text-opacity-30 font-bold text-[150px] select-none">
                        {index + 1}
                      </div>
                    <div className="absolute top-4 right-4">
                      {index === 0 && <Trophy className="w-8 h-8 text-yellow-400" />}
                      {index === 1}
                      {index === 2}
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">{team.team}</h2>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">{team.totalPoints}</span>
                      <span className="text-gray-400 text-sm">points</span>
                    </div>
                    <div>
                      
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 space-y-6 text-center"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
              onClick={() => navigate("/register")}
            >
              <Users className="w-5 h-5" />
              Registration
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full text-white font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
              onClick={() => navigate("/results")}
            >
              <Trophy className="w-5 h-5" />
              View Individual Results
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-24"
        >
          <h2 className="text-3xl font-bold text-center text-white mb-12">Team Departments</h2>
          <div className="space-y-4">
            {Object.keys(departments).map((teamKey, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl overflow-hidden border border-gray-700"
              >
                <motion.button
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
                </motion.button>
                <AnimatePresence>
                  {expandedTeam === teamKey && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {departments[teamKey].map((dept, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-center gap-2 text-gray-300"
                          >
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>{dept}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default HomePage;
