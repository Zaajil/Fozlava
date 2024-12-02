import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight, Trophy,  Star, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import "../index.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [pointsTable, setPointsTable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
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
        console.log("Fetching total points...");
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbxu0ehjZKgAxTq4REiMrfdZlE5eZ5IhyURpggvW0AJEA8ikdzqOaRrbeg3_2Ag5jIXJGg/exec"
        );
        const data = await response.json();
        console.log("Fetched data: ", data);

        if (data && data.totalPoints) {
          const formattedTable = data.totalPoints.map((row) => ({
            team: row.team || "Unknown Team",
            totalPoints: row.totalPoints || 0,
          }));
          const sortedTable = formattedTable.sort((a, b) => b.totalPoints - a.totalPoints);
          setPointsTable(sortedTable);
          setShowConfetti(true);
        } else {
          console.error("No total points data available");
        }
      } catch (error) {
        console.error("Error fetching total points:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPointsTable();
  }, []);

  {/*useEffect(() => {
    if (showConfetti) {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 }
      });
    }
  }, [showConfetti]);*/}


  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  const titleVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const toggleTeam = (teamKey) => {
    setExpandedTeam(expandedTeam === teamKey ? null : teamKey);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-primary pt-12 pb-20">
      <div className="max-w-6xl mx-auto p-6">
        <motion.h1
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          className="text-6xl font-extrabold text-lightAccent text-center mb-12 relative"
        >
          <span className="relative z-10">Fozlava Point Table</span>
          {/*<motion.span
            className="absolute inset-0 z-0"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
          <Sparkles className="w-12 h-12 text-lightAccent absolute -top-6 -left-6" />
            <Sparkles className="w-12 h-12 text-lightAccent absolute -bottom-6 -right-6" />
          </motion.span>*/}
        </motion.h1>
        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-12 h-12 animate-spin text-lightAccent" />
            </div>
          ) : pointsTable.length === 0 ? (
            <div className="text-center text-lightAccent text-xl">No data available</div>
          ) : (
            <AnimatePresence>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {pointsTable.map((team, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    variants={cardVariants}
                    className="bg-lightAccent bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 h-48"
                  >
                    <div className="relative h-full">
                      <div className="absolute inset-0 flex items-center justify-center text-lightAccent text-opacity-30 font-bold text-[150px] select-none">
                        {index + 1}
                      </div>
                      <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                        <div>
                          <h2 className="text-2xl font-semibold text-lightAccent mb-2">
                            {team.team}
                          </h2>
                          {index === 0 && (
                            <div className="absolute  right-8">
                              <Trophy className="w-12 h-12 text-yellow-400" />
                            </div>
                          )}
                          <p className="text-4xl font-bold text-lightAccent">
                            {team.totalPoints}
                          </p>
                          <p className="text-sm text-lightAccent">points</p>
                        </div>
                        
                        {index === 0 && (
                          <div className="absolute top-0 left-0 w-full h-full border-4 border-secondary/100 rounded-2xl"></div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-16"
        >
          <div className="space-y-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/register")}
              className="bg-lightAccent text-primary text-lg px-8 py-4 rounded-full flex items-center justify-center mx-auto hover:bg-opacity-90 transition-colors duration-200 shadow-lg"
            >
              Registration
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/results")}
              className="bg-lightAccent text-primary text-lg px-8 py-4 rounded-full flex items-center justify-center mx-auto hover:bg-opacity-90 transition-colors duration-200 shadow-lg"
            >
              View Individual Results
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-20"
          >
            <h2 className="text-3xl font-semibold text-lightAccent mb-8 text-center">Departments in Each Team</h2>
            <div className="space-y-4">
              {Object.keys(departments).map((teamKey, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="bg-lightAccent bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden"
                >
                  <motion.button
                    onClick={() => toggleTeam(teamKey)}
                    className="w-full p-6 flex justify-between items-center text-center"
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  >
                    <h3 className="text-2xl font-medium text-lightAccent">
                      {teamKey.charAt(0).toUpperCase() + teamKey.slice(1).replace('team', 'Team ')}
                    </h3>
                    {expandedTeam === teamKey ? (
                      <ChevronUp className="w-6 h-6 text-lightAccent" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-lightAccent" />
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
                        <ul className="grid grid-cols-2 gap-4">
                          {departments[teamKey].map((dept, idx) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="text-sm text-gray-200 flex items-center"
                            >
                              <Star className="w-4 h-4 mr-2 text-lightAccent flex-shrink-0" />
                              <span>{dept}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;

