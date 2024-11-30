import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OffStageRegistration = () => {
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [event, setEvent] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [phone, setPhone] = useState("");
  const [registrations, setRegistrations] = useState([]); // State for storing registration data from Google Sheets
  const [todayEvents, setTodayEvents] = useState([]); // State for storing today's events fetched from Google Sheets
  const [isLoading, setIsLoading] = useState(false); // Loading state for the registration process
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Function to fetch registration data from Google Sheets
  const fetchRegistrationData = async () => {
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzxzB61OITDNFIdKpk_eYKUbz59p-504uIukXZT7qOw2yuD55YldAmTfmmdGpVM6HM/exec"
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
        "https://script.google.com/macros/s/AKfycbzE0jNvKGLm0Sn3EEqhZdpioRIXGnK2fyb9zRPJ3nqWIHKBdOpEvYD9qNoT_mfbB6D6yA/exec"
      );
      const data = await response.json();
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
    // Check for missing fields and mark them
    const errors = {};

    // Check for missing fields
    if (!name) errors.name = "Name is required.";
    if (!event) errors.event = "Event is required.";
    if (!department) errors.department = "Department is required.";
    if (!year) errors.year = "Year is required.";
    if (!rollNo) errors.rollNo = "Roll number is required.";
    if (!phone) errors.phone = "Phone number is required.";

  
    // Ensure each field is properly checked for missing values
    if (phone && !/^\d{10}$/.test(phone)) {
      errors.phone = "Phone number must be exactly 10 digits.";
    }

    setErrors(errors); // Update the errors state

    // If there are errors, don't proceed with form submission
    if (Object.keys(errors).length > 0) return;

    setIsLoading(true); // Start the loading process

    const googleScriptURL =
      "https://script.google.com/macros/s/AKfycbzxzB61OITDNFIdKpk_eYKUbz59p-504uIukXZT7qOw2yuD55YldAmTfmmdGpVM6HM/exec";

    const formData = new FormData();
    formData.append("event", event);
    formData.append("name", name);
    formData.append("department", department);
    formData.append("year", year);
    formData.append("rollNo", rollNo);
    formData.append("phone", phone);

    try {
      const response = await fetch(googleScriptURL, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.status === "success") {
        setRegistrationNumber(data.regNum);
        fetchRegistrationData(); // Refresh registration list after successful submission
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }

    setIsLoading(false); // Stop the loading process

    // Clear the form
    setEvent("");
    setName("");
    setDepartment("");
    setYear("");
    setRollNo("");
    setPhone("");
  };

  const handleViewRegistrations = () => {
    navigate("/registered-list", { state: { event, registrations } }); // Pass the current event and registrations to the next page
  };

  return (
    <div className="bg-lightAccent min-h-screen pt-12 pb-10">
      {/* Today's Offstage Events Section */}
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-darkAccent text-center mb-6">
          Today's Offstage Items
        </h2>
        <div className="overflow-x-auto rounded-xl">
          <table className="table-auto w-full bg-white shadow-lg rounded-xl mb-8">
            <thead className="bg-primary text-white rounded-t-xl">
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
                    <tr key={index} className="border-t-2 border-accent">
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
      </div>

      {/* Registration Form */}
      <div className="max-w-md mx-auto  p-6 bg-white shadow-lg rounded-lg mt-0">
        <h2 className="text-2xl font-bold text-darkAccent text-center mb-6">
          Registration Form
        </h2>

        {/* Form fields */}
        <div className="mb-4">
          <label className="block mb-2 font-medium text-darkAccent">Event</label>
          <select
            id="event"
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
          {errors.event && <p className="text-red-500 text-sm">{errors.event}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium text-darkAccent">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-accent px-4 py-2 rounded-lg"
            placeholder="Enter your full name"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-darkAccent">Department</label>
          <select
  id="department"
  value={department}
  onChange={(e) => setDepartment(e.target.value)}
  className="w-full border border-accent px-4 py-2 rounded-lg"
>
  <option value="">-- Select Department --</option>
  <option value="Arabic">Arabic</option>
  <option value="B.Voc Auto">B.Voc Auto</option>
  <option value="B.Voc IT">B.Voc IT</option>
  <option value="BCom CA">BCom CA</option>
  <option value="BMMC">BMMC</option>
  <option value="Botany">Botany</option>
  <option value="Chemistry">Chemistry</option>
  <option value="Commerce">Commerce</option>
  <option value="Computer Science">Computer Science</option>
  <option value="Economics">Economics</option>
  <option value="English (Aided)">English (Aided)</option>
  <option value="English (SF)">English (SF)</option>
  <option value="Functional English">Functional English</option>
  <option value="Geology">Geology</option>
  <option value="History">History</option>
  <option value="Library Science">Library Science</option>
  <option value="Malayalam">Malayalam</option>
  <option value="Management Studies">Management Studies</option>
  <option value="Maths">Maths</option>
  <option value="MCJ">MCJ</option>
  <option value="Physics">Physics</option>
  <option value="Psychology (Aided)">Psychology (Aided)</option>
  <option value="Psychology (SF)">Psychology (SF)</option>
  <option value="Sociology">Sociology</option>
  <option value="Statistics">Statistics</option>
  <option value="Zoology">Zoology</option>
</select>

          {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-darkAccent">Year</label>
          <select
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full border border-accent px-4 py-2 rounded-lg"
          >
            <option value="">-- Select Year --</option>
            <option value="UG 1st Year">UG 1st Year</option>
            <option value="UG 2nd Year">UG 2nd Year</option>
            <option value="UG 3rd Year">UG 3rd Year</option>
            <option value="PG 1st Year">PG 1st Year</option>
            <option value="PG 2nd Year">PG 2nd Year</option>
          </select>
          {errors.year && <p className="text-red-500 text-sm">{errors.year}</p>}
        </div>

        
        <div className="mb-4">
          <label className="block mb-2 font-medium text-darkAccent">Roll No</label>
          <input
            id="rollNo"
            type="text"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            className="w-full border border-accent px-4 py-2 rounded-lg"
            placeholder="Enter your roll number"
          />
          {errors.rollNo && <p className="text-red-500 text-sm">{errors.rollNo}</p>}
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium text-darkAccent">Phone Number</label>
          <input
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-accent px-4 py-2 rounded-lg"
            placeholder="Enter your phone number"
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        </div>

        <button
          onClick={handleRegister}
          className="bg-primary text-white px-6 py-3 w-full rounded-lg shadow hover:bg-secondary"
        >
          {isLoading ? (
            <div className="flex justify-center items-center w-full h-full">
            <div className="spinner-border animate-spin text-center border-4 rounded-full w-6 h-6 border-t-transparent"></div>
          </div> // Show spinner while loading
          ) : (
            "Register"
          )}
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
