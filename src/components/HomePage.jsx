import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // React Router for navigation
import { motion } from "framer-motion"; // Framer Motion for animations
import { Loader2, Trophy, ArrowRight } from "lucide-react"; // Icons
import "../index.css"; // Custom CSS for additional Tailwind styles

const HomePage = () => {
  const navigate = useNavigate(); // Use React Router's navigate
  const [pointsTable, setPointsTable] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-secondary/10 pt-12">
      <div className="max-w-5xl mx-auto p-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-extrabold text-secondary text-center mb-8"
        >
          Fozlava Point Table
        </motion.h1>
        <div className="bg-white shadow-md rounded-lg mt-8 p-6">
          <h2 className="text-2xl font-bold text-center mb-4">Team Rankings</h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : pointsTable.length === 0 ? (
            <div className="text-center text-red-500">No data available</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-left border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border border-gray-300">Rank</th>
                    <th className="px-4 py-2 border border-gray-300">Team</th>
                    <th className="px-4 py-2 border border-gray-300 text-right">
                      Total Points
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pointsTable.map((team, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border border-gray-300">
                        {index === 0 && <Trophy className="inline-block mr-2 text-yellow-500" />}
                        {index + 1}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">{team.team}</td>
                      <td className="px-4 py-2 border border-gray-300 text-right">
                        {team.totalPoints}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-8"
        >
          <button
            onClick={() => navigate("/results")}
            className="bg-primary text-white text-lg px-6 py-3 rounded-lg flex items-center justify-center mx-auto"
          >
            View Individual Results
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
