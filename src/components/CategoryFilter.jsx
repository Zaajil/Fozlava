import React from 'react';


const CategoryFilter = React.memo(({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="flex justify-center gap-4">
      <button
        onClick={() => onCategoryChange("all")}
        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
          selectedCategory === "all"
            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
        }`}
      >
        All Events
      </button>
      <button
        onClick={() => onCategoryChange("individual")}
        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
          selectedCategory === "individual"
            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
        }`}
      >
        Individual
      </button>
      <button
        onClick={() => onCategoryChange("group")}
        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
          selectedCategory === "group"
            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
        }`}
      >
        Group
      </button>
    </div>
  );
});

export default CategoryFilter;
