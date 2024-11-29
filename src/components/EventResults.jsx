import React, { useState, useEffect } from "react";

const EventResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        console.log("Fetching results...");
        const response = await fetch("https://script.google.com/macros/s/AKfycbzQBL_VMonLkrvp1wlaNzHBaNgAVbr5bcbrmn1iKe6ELm-R6hKFLoxOZPFGSn757-g/exec");
        const data = await response.json();

        // Combine individual and group results into one array
        const combinedResults = [
          ...data.individual.map((result) => ({
            type: "individual",
            item: result.item,
            first: result.first || null,
            second: result.second || null,
            third: result.third || null,
          })),
          ...data.group.map((result) => ({
            type: "group",
            item: result.item,
            first: result.first || null,
            second: result.second || null,
            third: result.third || null,
          })),
        ];

        // Group the results by event item (name)
        const groupedResults = combinedResults.reduce((acc, result) => {
          if (!acc[result.item]) {
            acc[result.item] = { ...result, first: [], second: [], third: [] };
          }

          // Collect the winners for each prize
          if (result.first) acc[result.item].first.push(result.first);
          if (result.second) acc[result.item].second.push(result.second);
          if (result.third) acc[result.item].third.push(result.third);

          return acc;
        }, {});

        // Convert grouped object into an array to render
        setResults(Object.values(groupedResults));
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    

    fetchResults();
  }, []);

  const renderPrize = (prize, prizeLabel, type) => {
    if (!prize || prize.length === 0) return null;

    // Check if the prize is valid (for both individuals and groups)
    const isValidPrize = prize.some((winner) =>
      type === "individual"
        ? typeof winner === "object" &&
          (winner.name || winner.department || winner.year || winner.group)
        : typeof winner === "string" && winner
    );

    if (!isValidPrize) return null;

    return (
      <div
        className={`p-4 rounded-lg shadow-sm ${
          prizeLabel === "1st"
            ? "bg-primary"
            : prizeLabel === "2nd"
            ? "bg-secondary"
            : "bg-accent"
        }`}
      >
        <h4 className="font-bold">{prizeLabel} Prize</h4>
        {(Array.isArray(prize) ? prize : [prize]).map((winner, idx) => (
          <div key={idx}>
            {type === "individual" ? (
              typeof winner === "object" ? (
                <>
                  {winner.name && <p><strong>{winner.name}</strong></p>}
                  {winner.department && winner.year && (
                    <p>
                      <span>{winner.department}</span> <span>{winner.year}</span>
                    </p>
                  )}
                  {winner.group && <p>{winner.group}</p>}
                </>
              ) : (
                <p>{winner}</p>
              )
            ) : (
              // For group results, just display the group name
              <p>{winner}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-lightAccent min-h-screen pt-16">
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-darkAccent text-center mb-6">
          Event Results
        </h2>
        {loading ? (
          <div className="text-center text-primary">Loading results...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result, index) => {
              // Check if there is at least one valid result (for any prize)
              const hasValidResults =
                (result.first && result.first.length > 0) ||
                (result.second && result.second.length > 0) ||
                (result.third && result.third.length > 0);

              if (!hasValidResults) return null; // Skip if no valid results

              return (
                <div key={index} className="bg-white shadow-lg rounded-lg p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-2xl font-bold text-darkAccent">
                      {result.item}
                    </h3>
                    {/* Divider below item name */}
                    <div className="border-t-2 border-darkAccent my-2"></div>
                  </div>

                  <div className="space-y-6">
                    {/* Render 1st Prize only if data exists */}
                    {renderPrize(result.first, "1st", result.type)}

                    {/* Render 2nd Prize only if valid data exists */}
                    {renderPrize(result.second, "2nd", result.type)}

                    {/* Render 3rd Prize only if data exists */}
                    {renderPrize(result.third, "3rd", result.type)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventResults;
