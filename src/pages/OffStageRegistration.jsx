import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, User } from "lucide-react";
import Footer from "../components/Footer";
import EventCard from "../components/EventCard";
import RegistrationForm from "../components/RegistrationForm";

const OffStageRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    event: "",
    name: "",
    department: "",
    year: "",
    rollNo: "",
    phone: "",
  });
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [todayEvents, setTodayEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchRegistrationData = useCallback(async () => {
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzxzB61OITDNFIdKpk_eYKUbz59p-504uIukXZT7qOw2yuD55YldAmTfmmdGpVM6HM/exec"
      );
      const data = await response.json();
      setRegistrations(data);
    } catch (error) {
      console.error("Error fetching registration data:", error);
    }
  }, []);

  const fetchTodayEvents = useCallback(async () => {
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzE0jNvKGLm0Sn3EEqhZdpioRIXGnK2fyb9zRPJ3nqWIHKBdOpEvYD9qNoT_mfbB6D6yA/exec"
      );
      const data = await response.json();
      setTodayEvents(data);
    } catch (error) {
      console.error("Error fetching today's events:", error);
    }
  }, []);

  useEffect(() => {
    fetchRegistrationData();
    fetchTodayEvents();
  }, [fetchRegistrationData, fetchTodayEvents]);

  const formatDateTime = useCallback((dateString, timeString) => {
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
  }, []);

  const getTodaysEvents = useCallback(() => {
    const currentDate = new Date().toLocaleDateString("en-GB");
    return todayEvents.filter((item) => {
      const { date } = formatDateTime(item.date, item.time);
      return date === currentDate;
    });
  }, [todayEvents, formatDateTime]);

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.name) errors.name = "Name is required.";
    if (!formData.event) errors.event = "Event is required.";
    if (!formData.department) errors.department = "Department is required.";
    if (!formData.year) errors.year = "Year is required.";
    if (!formData.rollNo) errors.rollNo = "Roll number is required.";
    if (!formData.phone) errors.phone = "Phone number is required.";
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Phone number must be exactly 10 digits.";
    }

    setErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);

    const formDataObj = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataObj.append(key, value);
    });

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzxzB61OITDNFIdKpk_eYKUbz59p-504uIukXZT7qOw2yuD55YldAmTfmmdGpVM6HM/exec",
        {
          method: "POST",
          body: formDataObj,
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        setRegistrationNumber(data.regNum);
        fetchRegistrationData();
        setFormData({
          event: "",
          name: "",
          department: "",
          year: "",
          rollNo: "",
          phone: "",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewRegistrations = () => {
    navigate("/registered-list", {
      state: { event: formData.event, registrations },
    });
  };

  const todaysEventsList = getTodaysEvents();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            Off-Stage Events
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="backdrop-blur-lg bg-white/10 rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
          >
            <div className="bg-gradient-to-r from-pink-500 to-violet-500 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                Today's Events
              </h2>
            </div>

            <div className="p-6">
              {todaysEventsList.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-300">No events scheduled for today</p>
                </div>
              ) : (
                <ul className="space-y-6">
                  {todaysEventsList.map((item, index) => {
                    const { date, time } = formatDateTime(item.date, item.time);
                    return (
                      <EventCard
                        key={index}
                        event={{ ...item, date, time }}
                        index={index}
                      />
                    );
                  })}
                </ul>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="backdrop-blur-lg bg-white/10 rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
          >
            <div className="bg-gradient-to-r from-violet-500 to-pink-500 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <User className="w-6 h-6" />
                Registration Form
              </h2>
            </div>

            <div className="p-6">
              <RegistrationForm
                formData={formData}
                errors={errors}
                isLoading={isLoading}
                registrationNumber={registrationNumber}
                todayEvents={todaysEventsList}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                handleViewRegistrations={handleViewRegistrations}
              />
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OffStageRegistration;
