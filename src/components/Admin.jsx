import { useState, useEffect } from 'react';
import { Search, ChevronDown, Download, Loader2, Users, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from "jspdf";
import "jspdf-autotable";

import Footer from './Footer';

const DownloadButton = ({ onClick, isLoading, disabled }) => (
  <motion.button
    onClick={onClick}
    disabled={isLoading || disabled}
    className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-white rounded-lg bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95"
    whileHover={{ boxShadow: "0 0 20px rgba(236, 72, 153, 0.5)" }}
    whileTap={{ scale: 0.95 }}
  >
    <span className="relative flex items-center gap-2">
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Download className="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
      )}
      {isLoading ? 'Generating PDF...' : 'Download PDF'}
    </span>
  </motion.button>
);

const EmptyState = ({ message }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex flex-col items-center justify-center py-12 space-y-4"
  >
    <Users className="h-12 w-12 text-gray-400" />
    <p className="text-gray-300">{message}</p>
  </motion.div>
);

const LoadingState = ({ message }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex flex-col items-center justify-center py-12 space-y-4"
  >
    <Loader2 className="h-12 w-12 text-pink-500 animate-spin" />
    <p className="text-gray-300">{message}</p>
  </motion.div>
);

const ErrorState = ({ message }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex flex-col items-center justify-center py-12 space-y-4"
  >
    <AlertCircle className="h-12 w-12 text-red-500" />
    <p className="text-gray-300">{message}</p>
  </motion.div>
);

const ParticipantsTable = ({ participants }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="relative overflow-x-auto rounded-lg"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2 text-gray-300">
        <span>{participants.length} participants</span>
      </div>
    </div>

    <table className="w-full text-left">
      <thead className="bg-gradient-to-r from-pink-500 to-violet-500 text-white">
        <tr>
          <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider">Registration Number</th>
          <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider">Name</th>
          <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider">Department</th>
          <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider">Roll Number</th>
          <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider">Group</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/10">
        {participants.map((reg, index) => (
          <motion.tr
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
            className="bg-white/5 hover:bg-white/10 transition-colors duration-200"
          >
            <td className="px-6 py-4 text-sm text-gray-300">{reg.regNum}</td>
            <td className="px-6 py-4 text-sm text-gray-300">{reg.name}</td>
            <td className="px-6 py-4 text-sm text-gray-300">{reg.department}</td>
            <td className="px-6 py-4 text-sm text-gray-300">{reg.rollNo}</td>
            <td className="px-6 py-4 text-sm text-gray-300">{reg.group || '-'}</td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  </motion.div>
);

const Admin = () => {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingPDF, setLoadingPDF] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          'https://script.google.com/macros/s/AKfycbzE0jNvKGLm0Sn3EEqhZdpioRIXGnK2fyb9zRPJ3nqWIHKBdOpEvYD9qNoT_mfbB6D6yA/exec'
        );
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError('Failed to load events. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const fetchRegistrations = async (event) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://script.google.com/macros/s/AKfycbzxzB61OITDNFIdKpk_eYKUbz59p-504uIukXZT7qOw2yuD55YldAmTfmmdGpVM6HM/exec?event=${encodeURIComponent(event)}`
      );
      if (!response.ok) throw new Error('Failed to fetch registrations');
      const data = await response.json();
      setRegistrations(data);
    } catch (error) {
      console.error("Error fetching registrations data:", error);
      setError('Failed to load registrations. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventChange = (e) => {
    const event = e.target.value;
    setSelectedEvent(event);
    if (event) fetchRegistrations(event);
    else setRegistrations([]);
  };

  useEffect(() => {
    if (selectedEvent && registrations.length > 0) {
      const filtered = registrations.filter((reg) => reg.event === selectedEvent);
      setFilteredRegistrations(filtered);
    } else {
      setFilteredRegistrations([]);
    }
  }, [selectedEvent, registrations]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredBySearch = filteredRegistrations.filter((reg) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      reg.name.toLowerCase().includes(searchTerm) ||
      reg.department.toLowerCase().includes(searchTerm) ||
      reg.regNum.toLowerCase().includes(searchTerm) ||
      (reg.group && reg.group.toLowerCase().includes(searchTerm))
    );
  });

  const downloadPDF = () => {
    setLoadingPDF(true);
    
    const doc = new jsPDF();
    
    const addTitle = () => {
      doc.setFontSize(20);
      const title = selectedEvent || "Event";
      const titleWidth = doc.getTextWidth(title);
      const centerX = (doc.internal.pageSize.width - titleWidth) / 2;
      doc.text(title, centerX, 20);
    };
    
    addTitle();
    
    const tableColumn = ["Registration Number", "Name", "Department", "Roll Number", "Group"];
    const tableRows = filteredBySearch.map((reg) => [
      reg.regNum,
      reg.name,
      reg.department,
      reg.rollNo,
      reg.group || "-",
    ]);
    
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });
    
    doc.save(`${selectedEvent || "Event"}.pdf`);
    setLoadingPDF(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="text-center mb-12 will-change-transform"
        >
          <h1 className="text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            Registered Participants
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="backdrop-blur-lg bg-white/10 rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
        >
          <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Event
                </label>
                <div className="relative">
                  <select
                    value={selectedEvent}
                    onChange={handleEventChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-4 pr-10 py-2.5 text-white appearance-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 will-change-transform"
                    disabled={isLoading}
                  >
                    <option value="" className="bg-gray-900">Select Event</option>
                    {events.map((event, index) => (
                      <option key={index} value={event.event} className="bg-gray-900">
                        {event.event}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none h-5 w-5" />
                </div>
              </div>

              {selectedEvent && (
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Search Participants
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search by name, department, or registration number"
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <DownloadButton
                onClick={downloadPDF}
                isLoading={loadingPDF}
                disabled={!selectedEvent || filteredBySearch.length === 0}
              />
            </div>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <LoadingState message="Loading participants..." />
              ) : error ? (
                <ErrorState message={error} />
              ) : selectedEvent && filteredBySearch.length > 0 ? (
                <ParticipantsTable participants={filteredBySearch} />
              ) : selectedEvent ? (
                <EmptyState message="No registrations found for this event." />
              ) : (
                <EmptyState message="Please select an event to view registrations." />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;