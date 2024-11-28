import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const pointsTable = [
    { team: "IDB & Zahira Hostel", points: 120 },
    { team: "SS & WW Hostel", points: 110 },
    { team: "Day Scholars - 1 (UG-I & III Years)", points: 95 },
    { team: "President's Hostel", points: 85 },
    { team: "Day Scholars - 2 (UG-II & PG)", points: 80 },
    { team: "Boys Hostel", points: 75 },
  ];

  return (
    <div className="bg-white min-h-screen pt-16">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-darkAccent text-center mb-8">
          Fozlava Points Table
        </h1>
        <table className="table-auto w-full bg-white shadow-lg rounded-lg">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-4 py-2">Team</th>
              <th className="px-4 py-2">Points</th>
            </tr>
          </thead>
          <tbody>
            {pointsTable.map((team, index) => (
              <tr key={index} className="border-t border-accent">
                <td className="px-4 py-2">{team.team}</td>
                <td className="px-4 py-2">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
