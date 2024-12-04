import { useState, useEffect, useMemo } from 'react';

export const useEventResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Fetching in parallel if there are multiple sources (for future expansion)
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbxu0ehjZKgAxTq4REiMrfdZlE5eZ5IhyURpggvW0AJEA8ikdzqOaRrbeg3_2Ag5jIXJGg/exec"
        );
        const data = await response.json();
        
        // Combine individual and group results
        const combinedResults = [
          ...data.individual.map((result) => ({
            type: "individual",
            item: result.item,
            first: result.first || [],
            second: result.second || [],
            third: result.third || [],
          })),
          ...data.group.map((result) => ({
            type: "group",
            item: result.item,
            first: result.first || [],
            second: result.second || [],
            third: result.third || [],
          })),
        ];

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
  }, []); // Run only once when component mounts

  return { results, loading, error };
};

export const useFilteredResults = (
  results,
  searchTerm,
  selectedCategory
) => {
  return useMemo(() => {
    return results.filter((result) => {
      // Lowercase search term to make search case-insensitive
      const searchLower = searchTerm.toLowerCase();

      const matchesSearch =
        result.item.toLowerCase().includes(searchLower) ||
        result.first.some((w) => JSON.stringify(w).toLowerCase().includes(searchLower)) ||
        result.second.some((w) => JSON.stringify(w).toLowerCase().includes(searchLower)) ||
        result.third.some((w) => JSON.stringify(w).toLowerCase().includes(searchLower));

      const matchesCategory = selectedCategory === "all" || result.type === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [results, searchTerm, selectedCategory]); // Only re-run if these values change
};
