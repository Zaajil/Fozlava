import React, { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { Calendar } from "lucide-react";

const Admin = () => {
  const [events, setEvents] = useState([]);
  const [eventStatuses, setEventStatuses] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch events from Google Sheets
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzszZ4Cuxy-HICD2taE8g0GKl1OZXEjBq6VYJUISPRDxV_sZ3dlVDqRKKkMowIG3q1vnQ/exec"
      );
      const data = await response.json();

      // Initialize events and statuses
      setEvents(data);
      
      // Initialize the event statuses from the fetched data
      const initialStatuses = data.reduce((acc, event) => {
        acc[event.Event] = event.Status === "TRUE"; // Check if Status is TRUE
        return acc;
      }, {});
      setEventStatuses(initialStatuses);
    } catch (error) {
      console.error("Error fetching events:", error);
      alert("Failed to fetch events. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle toggle change
  const handleStatusChange = (eventName) => {
    setEventStatuses((prevStatuses) => {
      const newStatuses = {
        ...prevStatuses,
        [eventName]: !prevStatuses[eventName], // Flip the status
      };
      return newStatuses;
    });
  };

  // Save changes to Google Sheets
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const updatedStatuses = events.map((event) => ({
        Event: event.Event,
        Status: eventStatuses[event.Event] ? "TRUE" : "FALSE", // Map to "TRUE" or "FALSE"
      }));

      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzszZ4Cuxy-HICD2taE8g0GKl1OZXEjBq6VYJUISPRDxV_sZ3dlVDqRKKkMowIG3q1vnQ/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedStatuses),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        alert(`Failed to update statuses: ${errorText}`);
        return;
      }

      alert("Event statuses updated successfully!");
    } catch (error) {
      console.error("Error saving event statuses:", error);
      alert("An error occurred while saving changes.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center mt-12">Loading events...</div>;
  }

  return (
    <div className="bg-gradient-to-b from-primary/50 to-secondary/20 min-h-screen pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-darkAccent text-center mb-12">
          Admin - Manage Event Registrations
        </h1>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            Manage Event Registration Status
          </h2>

          <ul className="space-y-4">
            {events.map((event) => (
              <li
                key={event.Event}
                className="flex items-center justify-between border-b border-gray-200 pb-4 last:pb-0"
              >
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="font-semibold text-darkAccent">{event.Event}</span>
                </div>

                <Switch
                  checked={eventStatuses[event.Event]} // Controlled by the event status
                  onChange={() => handleStatusChange(event.Event)} // Toggle status onChange
                  className={`${
                    eventStatuses[event.Event] ? "bg-green-500" : "bg-gray-300"
                  } relative inline-flex items-center h-6 rounded-full w-11`}
                >
                  <span className="sr-only">Enable registration</span>
                  <span
                    className={`${
                      eventStatuses[event.Event] ? "translate-x-5" : "translate-x-0"
                    } inline-block w-4 h-4 transform bg-white rounded-full transition`}
                  />
                </Switch>
              </li>
            ))}
          </ul>

          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className={`mt-6 px-4 py-2 rounded-md transition-colors duration-300 ${
              isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-primary text-white hover:bg-secondary"
            }`}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
