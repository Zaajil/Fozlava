import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [pointsTable, setPointsTable] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPointsTable = async () => {
      try {
        console.log("Fetching total points...");
        // URL for the total points Google Sheets data (use your actual URL here)
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbxEPWn3eU43Buy71NxDOOQvhzYiH4KTLopcsTLXrwpReaSjK5H4uOC-60IL4D1gBw/exec"
        );
        const data = await response.json();
        console.log("Fetched data: ", data);

        if (data && data.totalPoints) {
          const totalPointsData = data.totalPoints;

          // Format the data to ensure correct values are displayed
          const formattedTable = totalPointsData.map((row) => ({
            team: row.team || "Unknown Team",  // Handle missing team name
            totalPoints: row.totalPoints || 0,  // Handle missing total points
          }));

          setPointsTable(formattedTable);
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
    <div className="bg-white min-h-screen pt-16">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-darkAccent text-center mb-8">
          Fozlava Points Table
        </h1>
        {loading ? (
          <div className="text-center text-primary">Loading total points...</div>
        ) : pointsTable.length === 0 ? (
          <div className="text-center text-red-500">No data available</div>
        ) : (
          <table className="table-auto w-full text-center bg-accent shadow-lg rounded-xl">
            <thead className="bg-primary rounded-xl text-white">
              <tr>
                <th className="px-4 py-2">Team</th>
                <th className="px-4 py-2">Total Points</th>
              </tr>
            </thead>
            <tbody>
              {pointsTable.map((team, index) => (
                <tr key={index} className="border-t-2 border-secondary">
                  <td className="px-4 py-2">{team.team}</td>
                  <td className="px-4 py-2">{team.totalPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/results")}
            className="bg-primary text-white px-6 py-3 rounded-full shadow hover:bg-secondary"
          >
            View Individual Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
