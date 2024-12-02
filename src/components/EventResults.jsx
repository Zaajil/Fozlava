import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Award, Medal, Trophy, Loader2, Users } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import Footer from './Footer'

const EventResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleResults, setVisibleResults] = useState(12);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [ref, inView] = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbxu0ehjZKgAxTq4REiMrfdZlE5eZ5IhyURpggvW0AJEA8ikdzqOaRrbeg3_2Ag5jIXJGg/exec"
        );
        const data = await response.json();

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
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  useEffect(() => {
    if (inView) {
      setVisibleResults((prev) => prev + 12);
    }
  }, [inView]);

  const renderWinner = (winner, index, type) => {
    if (!winner) return null;

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className="flex items-center space-x-3"
      >
        {type === "individual" ? (
          typeof winner === "object" ? (
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {winner.name}
              </p>
              {winner.department && winner.year && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {winner.department}, {winner.year}
                </p>
              )}
            </div>
          ) : (
            <p className="flex-1 text-gray-900 dark:text-gray-100">{winner}</p>
          )
        ) : (
          <p className="flex-1 text-gray-900 dark:text-gray-100">{winner}</p>
        )}
      </motion.div>
    );
  };

  const filteredResults = useMemo(() => {
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

  const resultsToDisplay = filteredResults.slice(0, visibleResults);

  return (
    <div>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-24 pb-12">
      <div className="absolute inset-0 opacity-10 bg-cover bg-center" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
            Event Results
          </h1>
          <p className="text-gray-400 text-xl">
            Discover the achievements of our talented participants
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mb-12 space-y-4"
        >
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events or participants..."
              className="w-full px-6 py-4 bg-white/10 backdrop-blur-lg border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
            <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === "all"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setSelectedCategory("individual")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === "individual"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Individual
            </button>
            <button
              onClick={() => setSelectedCategory("group")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === "group"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Group
            </button>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
            <p className="text-gray-400">Loading results...</p>
          </div>
        ) : resultsToDisplay.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-400">No results found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {resultsToDisplay.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0  rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
                <div className="relative bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                  <div className="px-6 py-4 bg-gray-800/50 border-b border-gray-700">
                    <div className="flex items-center justify-center">
                      <h3 className="text-lg font-semibold text-white">
                        {result.item}
                      </h3>
                    </div>
                  </div>
                  <div className="p-6 space-y-6 ">
                    {result.first.length > 0 && (
                      <div className="space-x-10">
                        <div className="flex items-center space-x-2 text-yellow-500">
                          <Trophy className="w-5 h-5" />
                          <h4 className="font-medium">First Place</h4>
                        </div>
                        {result.first.map((winner, idx) => renderWinner(winner, idx, result.type))}
                      </div>
                    )}
                    {result.second.length > 0 && (
                      <div className="space-x-10">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Medal className="w-5 h-5" />
                          <h4 className="font-medium">Second Place</h4>
                        </div>
                        {result.second.map((winner, idx) => renderWinner(winner, idx, result.type))}
                      </div>
                    )}
                    {result.third.length > 0 && (
                      <div className="space-x-10">
                        <div className="flex items-center space-x-2 text-orange-600">
                          <Award className="w-5 h-5" />
                          <h4 className="font-medium">Third Place</h4>
                        </div>
                        {result.third.map((winner, idx) => renderWinner(winner, idx, result.type))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && filteredResults.length > visibleResults && (
          <div ref={ref} className="flex justify-center mt-12">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
    <Footer/>
    </div>
  );
  
};

export default EventResults;