import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // React Router for navigation
import { motion } from "framer-motion"; // Framer Motion for animations
import { Loader2, ArrowRight } from "lucide-react"; // Icons
import "../index.css"; // Custom CSS for additional Tailwind styles

const HomePage = () => {
  const navigate = useNavigate(); // Use React Router's navigate
  const [pointsTable, setPointsTable] = useState([]);
  const [loading, setLoading] = useState(true);

  // Departments for each team
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
    <div className="min-h-screen bg-gradient-to-b from-primary/50 to-secondary/20 pt-12">
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
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : pointsTable.length === 0 ? (
            <div className="text-center text-red-500">No data available</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-left border-collapse border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 border border-gray-300 text-center">Rank</th>
                    <th className="px-4 py-2 border border-gray-300 text-center">Team</th>
                    <th className="px-4 py-2 border border-gray-300 text-center">
                      Total Points
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pointsTable.map((team, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border border-gray-300 text-center">
                        {index === 0}
                        {index + 1}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-center">{team.team}</td>
                      <td className="px-4 py-2 border border-gray-300 text-center">
                        {team.totalPoints}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Display team departments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-8"
        >
          <div className="pb-6">
            <button
              onClick={() => navigate("/register")}
              className="bg-primary text-white text-lg px-6 py-3 rounded-lg flex items-center justify-center mx-auto"
            >
              Registration
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
          <button
            onClick={() => navigate("/results")}
            className="bg-primary text-white text-lg px-6 py-3 rounded-lg flex items-center justify-center mx-auto"
          >
            View Individual Results
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>

          {/* Departments List */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-secondary mb-4">Departments in Each Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {Object.keys(departments).map((teamKey, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-medium text-primary mb-2">
                    {teamKey.charAt(0).toUpperCase() + teamKey.slice(1).replace('team', 'Team ')}
                  </h3>
                  <ul className="list-disc pl-6">
                    {departments[teamKey].map((dept, idx) => (
                      <li key={idx} className="text-sm text-gray-700">{dept}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
