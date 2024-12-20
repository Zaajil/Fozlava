import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Users } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import ResultCard from '../components/ResultCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import { useEventResults, useFilteredResults } from '../ui/useEventResults';
import Footer from '../components/Footer';
import '../index.css'
import Navbar from "../components/Navbar";

function EventResults() {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleResults, setVisibleResults] = useState(12);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [ref, inView] = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  const { results, loading, error } = useEventResults();
  const filteredResults = useFilteredResults(results, searchTerm, selectedCategory);

  const calculateTotalWinners = (result) => {
    const { first = [], second = [], third = [], type } = result;

    const countValidEntries = (entries) => {
      if (type === 'individual') {
        return entries.filter((entry) => entry.name && entry.name.trim() !== '').length;
      }
      if (type === 'group') {
        return entries.filter((entry) => typeof entry === 'string' && entry.trim() !== '').length;
      }
      return 0;
    };

    return countValidEntries(first) + countValidEntries(second) + countValidEntries(third);
  };

  // Sort filtered results by poster size (ascending)
  const sortedResults = filteredResults.sort(
    (a, b) => calculateTotalWinners(a) - calculateTotalWinners(b)
  );

  const resultsToDisplay = sortedResults.slice(0, visibleResults);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    setVisibleResults(12);
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
    setVisibleResults(12);
  }, []);

  useEffect(() => {
    if (inView) {
      setVisibleResults((prev) => prev + 12);
    }
  }, [inView]);


  return (
    <div>
      <Navbar/>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 py-12">
      
        <div className="absolute inset-0 opacity-10 bg-cover bg-center" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-600 mb-4">
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
            <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
            <CategoryFilter 
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </motion.div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
              <p className="text-gray-400">Loading results...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
              layout
            >
              {resultsToDisplay.map((result, index) => {
                return (
                  <ResultCard
                    key={result.item}
                    {...result}
                    index={index}
                  />
                );
              })}
            </motion.div>
          )}

          {!loading && filteredResults.length > visibleResults && (
            <div ref={ref} className="flex justify-center mt-12">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default EventResults;
