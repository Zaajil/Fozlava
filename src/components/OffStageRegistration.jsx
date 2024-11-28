import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OffStageRegistration = () => {
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [event, setEvent] = useState("");
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [phone, setPhone] = useState("");
  const [group, setGroup] = useState("");
  const [registrations, setRegistrations] = useState([]); // State for storing registration data from Google Sheets
  const [todayEvents, setTodayEvents] = useState([]); // State for storing today's events fetched from Google Sheets

  // Function to fetch registration data from Google Sheets
  const fetchRegistrationData = async () => {
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwwew-PTvf-AQ9pKlOouudAcvusDNUs1BTBJdUx8Ih79ct34eoXX7awDMPIapoub00/exec"
      );
      const data = await response.json();
      setRegistrations(data); // Update state with fetched data
    } catch (error) {
      console.error("Error fetching registration data:", error);
    }
  };

  // Function to fetch today's events from Google Sheets
  const fetchTodayEvents = async () => {
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwD_PNBJYI4dne1pLa2xFWAIHspp6rD-9Ja9zf7rMu5XxXrCAt6_84uZsikRr-21CjO/exec"
      );
      const data = await response.json();
      console.log("Fetched Today Events:", data); // Debugging log
      setTodayEvents(data); // Update state with today's event data
    } catch (error) {
      console.error("Error fetching today's events:", error);
    }
  };

  // Fetch registration data and today's events when the component mounts
  useEffect(() => {
    fetchRegistrationData();
    fetchTodayEvents();
  }, []); // Empty array means it runs once when the component mounts

  const formatDateTime = (dateString, timeString) => {
    const date = new Date(dateString);
    const formattedDate = isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleDateString("en-GB");

    const time = new Date(timeString);
    let formattedTime = "Invalid Time";

    if (!isNaN(time.getTime())) {
      if (timeString !== "1899-12-30T00:00:00.000Z") {
        const hour = time.getHours();
        const options = { hour: "2-digit", minute: "2-digit", hour12: true };
        const formatted = time.toLocaleTimeString("en-US", options);
        formattedTime = formatted.replace(
          "AM",
          hour >= 8 && hour < 12 ? "AM" : "PM"
        );
      } else {
        formattedTime = "No Time Available";
      }
    }

    return { date: formattedDate, time: formattedTime };
  };

  // Filter today's events
  const getTodaysEvents = () => {
    const currentDate = new Date().toLocaleDateString("en-GB"); // Get today's date in "dd/mm/yyyy" format

    return todayEvents.filter((item) => {
      const { date } = formatDateTime(item.date, item.time);
      return date === currentDate; // Only include items that match today's date
    });
  };

  const handleRegister = async () => {
    if (name && event && department && year && rollNo && phone && group) {
      const googleScriptURL =
        "https://script.google.com/macros/s/AKfycbwwew-PTvf-AQ9pKlOouudAcvusDNUs1BTBJdUx8Ih79ct34eoXX7awDMPIapoub00/exec";

      const formData = new FormData();
      formData.append("event", event);
      formData.append("name", name);
      formData.append("department", department);
      formData.append("year", year);
      formData.append("rollNo", rollNo);
      formData.append("phone", phone);
      formData.append("group", group);

      try {
        const response = await fetch(googleScriptURL, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (data.status === "success") {
          setRegistrationNumber(data.regNum);
          alert("Registration successful!");
          fetchRegistrationData(); // Refresh registration list after successful submission
        } else {
          alert("Error submitting form.");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Error submitting form. Please try again.");
      }

      // Clear the form
      setEvent("");
      setName("");
      setDepartment("");
      setYear("");
      setRollNo("");
      setPhone("");
      setGroup("");
    } else {
      alert("Please fill in all fields.");
    }
  };
  const handleViewRegistrations = () => {
    navigate("/registered-list", { state: { event, registrations } }); // Pass the current event and registrations to the next page
  };

  return (
    <div className="bg-lightAccent min-h-screen pt-16">
      {/* Today's Offstage Events Section */}
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-darkAccent text-center mb-6">
          Today's Offstage Items
        </h2>
        <table className="table-auto w-full bg-white shadow-lg rounded-lg mb-8">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-4 py-2">Item Name</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Venue</th>
            </tr>
          </thead>
          <tbody>
            {getTodaysEvents().length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No events today.
                </td>
              </tr>
            ) : (
              getTodaysEvents().map((item, index) => {
                const { date, time } = formatDateTime(item.date, item.time); // Destructure the formatted date and time
                return (
                  <tr key={index} className="border-t border-accent">
                    <td className="px-4 py-2 text-center">{item.event}</td>
                    <td className="px-4 py-2 text-center">{date}</td>{" "}
                    {/* Display formatted date */}
                    <td className="px-4 py-2 text-center">{time}</td>{" "}
                    {/* Display formatted time */}
                    <td className="px-4 py-2 text-center">{item.venue}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Registration Form */}
      <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
        <h2 className="text-2xl font-bold text-darkAccent text-center mb-6">
          Register for Offstage Events
        </h2>

        {/* Form fields */}
        <div className="mb-4">
          <label className="block mb-2 font-medium text-darkAccent">
            Event
          </label>
          <select
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            className="w-full border border-accent px-4 py-2 rounded-lg"
          >
            <option value="">-- Select Event --</option>
            {getTodaysEvents().map((item, index) => (
              <option key={index} value={item.event}>
                {item.event}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium text-darkAccent">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-accent px-4 py-2 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-darkAccent">
            Department
          </label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full border border-accent px-4 py-2 rounded-lg"
          >
            <option value="">-- Select Department --</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-darkAccent">Year</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full border border-accent px-4 py-2 rounded-lg"
          >
            <option value="">-- Select Year --</option>
            <option value="1st Year">UG 1st Year</option>
            <option value="2nd Year">UG 2nd Year</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-darkAccent">
            Roll No
          </label>
          <input
            type="text"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            className="w-full border border-accent px-4 py-2 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-darkAccent">
            Phone Number
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-accent px-4 py-2 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-darkAccent">
            Group
          </label>
          <select
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className="w-full border border-accent px-4 py-2 rounded-lg"
          >
            <option value="">-- Select Group --</option>
            <option value="Boys Hostel">Boys Hostel</option>
            <option value="Day Scholars">Day Scholars</option>
          </select>
        </div>

        <button
          onClick={handleRegister}
          className="bg-primary text-white px-6 py-3 w-full rounded-lg shadow hover:bg-secondary"
        >
          Register
        </button>

        {registrationNumber && (
          <div className="mt-4 text-center text-darkAccent">
            Registration Successful! Your Number:{" "}
            <span className="font-bold">{registrationNumber}</span>
          </div>
        )}

        {/* Display fetched registrations */}
        <button
          onClick={handleViewRegistrations}
          className="bg-secondary text-white px-6 py-3 w-full mt-4 rounded-lg shadow hover:bg-primary"
        >
          View Registered Participants
        </button>
      </div>
    </div>
  );
};

export default OffStageRegistration;
