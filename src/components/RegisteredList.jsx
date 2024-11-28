import React, { useState, useEffect } from 'react';

const RegisteredList = () => {
  const [events, setEvents] = useState([]); // Store the list of events
  const [registrations, setRegistrations] = useState([]); // Store all participants
  const [selectedEvent, setSelectedEvent] = useState(""); // State to track selected event
  const [filteredRegistrations, setFilteredRegistrations] = useState([]); // Filtered list for selected event
  const [searchQuery, setSearchQuery] = useState(""); // State to track search query

  // Fetch event names from the first Google Sheet
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          'https://script.google.com/macros/s/AKfycbwD_PNBJYI4dne1pLa2xFWAIHspp6rD-9Ja9zf7rMu5XxXrCAt6_84uZsikRr-21CjO/exec'
        );
        const data = await response.json();
        setEvents(data); // Store the fetched events data
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  // Fetch participant data from the second Google Sheet based on the selected event
  const fetchRegistrations = async (event) => {
    try {
      const response = await fetch(
        `https://script.google.com/macros/s/AKfycbxpY1HcEEd4uAH4BvBqt4Gp_TFQv7w7VUkt1H_aOmS8bhI9b16pHkA6PR_A3zc7uzs/exec?event=${event}`
      );
      const data = await response.json();
      setRegistrations(data); // Store the fetched participant data
    } catch (error) {
      console.error("Error fetching registrations data:", error);
    }
  };

  // Handle event selection change
  const handleEventChange = (e) => {
    const event = e.target.value;
    setSelectedEvent(event);
    fetchRegistrations(event); // Fetch registrations when an event is selected
  };

  // Update filtered registrations when data is fetched or when selectedEvent changes
  useEffect(() => {
    if (selectedEvent && registrations.length > 0) {
      const filtered = registrations.filter((reg) => reg.event === selectedEvent);
      setFilteredRegistrations(filtered); // Set filtered registrations based on selected event
    } else {
      setFilteredRegistrations([]); // Reset when no event is selected
    }
  }, [selectedEvent, registrations]);

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search query state
  };

  // Filter registrations based on the search query
  const filteredBySearch = filteredRegistrations.filter((reg) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      reg.name.toLowerCase().includes(searchTerm) ||
      reg.department.toLowerCase().includes(searchTerm) ||
      reg.regNum.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="bg-lightAccent min-h-screen pt-12">
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-darkAccent text-center mb-6">
          View Registered Participants
        </h2>

        {/* Dropdown to select an event */}
        <div className="mb-4">
          <label className="block mb-2 font-medium text-darkAccent">Select Event</label>
          <select
            value={selectedEvent}
            onChange={handleEventChange}
            className="w-full border border-accent px-4 py-2 rounded-lg"
          >
            <option value="">-- Select Event --</option>
            {events.map((event, index) => (
              <option key={index} value={event.event}>
                {event.event}
              </option>
            ))}
          </select>
        </div>

        {/* Display search box when an event is selected */}
        {selectedEvent && (
          <div className="mb-4">
            <label className="block mb-2 font-medium text-darkAccent">Search Participants</label>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by name, department, or registration number"
              className="w-full border border-accent px-4 py-2 rounded-lg"
            />
          </div>
        )}

        {/* Display participants for selected event */}
        <div className="overflow-x-auto">
          {selectedEvent && filteredBySearch.length > 0 ? (
            <table className="table-auto w-full bg-white shadow-lg rounded-lg mt-4">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-4 py-2">Registration Number</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Department</th>
                  <th className="px-4 py-2">Roll Number</th>
                </tr>
              </thead>
              <tbody>
                {filteredBySearch.map((reg, index) => (
                  <tr key={index} className="border-t border-accent">
                    <td className="px-4 py-2 text-center">{reg.regNum}</td>
                    <td className="px-4 py-2 text-center">{reg.name}</td>
                    <td className="px-4 py-2 text-center">{reg.department}</td>
                    <td className="px-4 py-2 text-center">{reg.rollNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : selectedEvent ? (
            <div className="text-center text-darkAccent mt-4">
              No registrations found for this event.
            </div>
          ) : (
            <div className="text-center text-darkAccent mt-4">
              Please select an event to view registrations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisteredList;
