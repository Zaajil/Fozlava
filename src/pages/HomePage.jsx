import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Trophy, Users } from "lucide-react";
import Footer from "../components/Footer";
import TeamCard from "../components/TeamCard";
import DepartmentList from "../components/DepartmentList";

const HomePage = () => {
  const navigate = useNavigate();
  const [pointsTable, setPointsTable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTeam, setExpandedTeam] = useState(null);

  const departments = {
    teamA: [
      "Maths",
      "Statistics",
      "Management Studies",
      "Geology",
      "History",
      "English (Aided)",
      "Library Science",
    ],
    teamB: [
      "Physics",
      "Chemistry",
      "Computer Science",
      "B.Voc IT",
      "Malayalam",
      "Functional English",
      "English (SF)",
    ],
    teamC: [
      "Psychology (SF)",
      "Psychology (Aided)",
      "Commerce",
      "Zoology",
      "Botany",
      "Sociology",
    ],
    teamD: ["BCom CA", "Arabic", "Economics", "BMMC", "B.Voc Auto", "MCJ"],
  };

  const fetchPointsTable = useCallback(async () => {
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
        setPointsTable(
          formattedTable.sort((a, b) => b.totalPoints - a.totalPoints)
        );
      }
    } catch (error) {
      console.error("Error fetching total points:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPointsTable();
  }, [fetchPointsTable]);

  const toggleTeam = useCallback(
    (teamKey) => {
      setExpandedTeam(expandedTeam === teamKey ? null : teamKey);
    },
    [expandedTeam]
  );

  const getTeamColor = useCallback((index) => {
    const colors = [
      "from-yellow-400 to-orange-500",
      "from-blue-400 to-indigo-500",
      "from-green-400 to-emerald-500",
      "from-purple-400 to-pink-500",
    ];
    return colors[index] || colors[0];
  }, []);

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
              FOZLAVA
            </h1>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {pointsTable.map((team, index) => (
                <TeamCard
                  key={team.team}
                  team={team}
                  index={index}
                  color={getTeamColor(index)}
                />
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 space-y-6 text-center"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                onClick={() => navigate("/register")}
              >
                <Users className="w-5 h-5" />
                Registration
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
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
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              Team Departments
            </h2>
            <DepartmentList
              departments={departments}
              expandedTeam={expandedTeam}
              toggleTeam={toggleTeam}
              getTeamColor={getTeamColor}
            />
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
