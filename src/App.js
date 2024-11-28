import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import EventResults from "./components/EventResults";
import OffStageRegistration from "./components/OffStageRegistration";
import Gallery from "./components/Gallery";
import RegisteredList from './components/RegisteredList';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navbar at the top */}
        <Navbar />

        {/* Main content */}
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/results" element={<EventResults />} />
            <Route path="/register" element={<OffStageRegistration />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/registered-list" element={<RegisteredList />} />
          </Routes>
        </main>

        {/* Footer at the bottom */}
        
      </div>
    </Router>
  );
};

export default App;
