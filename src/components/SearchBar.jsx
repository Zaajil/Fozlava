import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = React.memo(({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search events or participants..."
        className="w-full px-6 py-4 bg-white/10 backdrop-blur-lg border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
      />
      <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
  );
});

export default SearchBar;
