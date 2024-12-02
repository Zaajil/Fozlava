import { useState, useEffect, useMemo } from 'react';

export const useEventResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbxu0ehjZKgAxTq4REiMrfdZlE5eZ5IhyURpggvW0AJEA8ikdzqOaRrbeg3_2Ag5jIXJGg/exec"
        );
        const data = await response.json();
        console.log(data);

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
          console.log(combinedResults); // Add this after combining results



          const groupedResults = combinedResults.reduce((acc, result) => {
            if (!acc[result.item]) {
              acc[result.item] = { ...result, first: [], second: [], third: [] };
            }
  
            if (result.first) acc[result.item].first.push(result.first);
            if (result.second) acc[result.item].second.push(result.second);
            if (result.third) acc[result.item].third.push(result.third);
  
            return acc;
          }, {});

        setResults(Object.values(groupedResults));
      } catch (error) {
        setError("Failed to fetch results");
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return { results, loading, error };
};

export const useFilteredResults = (
  results,
  searchTerm,
  selectedCategory
) => {
  return useMemo(() => {
    return results.filter((result) => {
      const matchesSearch = 
        result.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.first.some((w) => JSON.stringify(w).toLowerCase().includes(searchTerm.toLowerCase())) ||
        result.second.some((w) => JSON.stringify(w).toLowerCase().includes(searchTerm.toLowerCase())) ||
        result.third.some((w) => JSON.stringify(w).toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = 
        selectedCategory === "all" || 
        result.type === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [results, searchTerm, selectedCategory]);
};
