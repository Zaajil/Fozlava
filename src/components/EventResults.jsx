import React, { useState, useEffect } from "react";

const EventResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await new Promise((resolve) =>
          setTimeout(() => {
            resolve([
              { id: 1, event: "Painting", winner: "Alice", position: "1st" },
              { id: 2, event: "Singing", winner: "Bob", position: "2nd" },
              { id: 3, event: "Photography", winner: "Charlie", position: "1st" },
            ]);
          }, 1500)
        );
        setResults(response);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="bg-lightAccent min-h-screen pt-16">
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-darkAccent text-center mb-6">
          Event Results
        </h2>
        {loading ? (
          <div className="text-center text-primary">Loading results...</div>
        ) : results.length > 0 ? (
          <table className="table-auto w-full bg-white shadow-lg rounded-lg">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-4 py-2">Event</th>
                <th className="px-4 py-2">Winner</th>
                <th className="px-4 py-2">Position</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.id} className="border-t border-accent">
                  <td className="px-4 py-2">{result.event}</td>
                  <td className="px-4 py-2">{result.winner}</td>
                  <td className="px-4 py-2">{result.position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-secondary">
            No results available.
          </div>
        )}
      </div>
    </div>
  );
};

export default EventResults;
