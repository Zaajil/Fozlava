import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import EventResults from "./pages/EventResults";
import OffStageRegistration from "./pages/OffStageRegistration";
import RegisteredList from "./components/RegisteredList";
import Admin from "./components/Admin";

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
            <Route path="/registered-list" element={<RegisteredList />} />
            <Route path="/registered-list/admin" element={<Admin />} />
          </Routes>
        </main>

        {/* Footer at the bottom */}
      </div>
    </Router>
  );
};

export default App;
