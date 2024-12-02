import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, User, Briefcase, Phone, Hash, Sparkles } from 'lucide-react'
import Footer from './Footer'

const OffStageRegistration = () => {
  const [registrationNumber, setRegistrationNumber] = useState("")
  const [event, setEvent] = useState("")
  const [name, setName] = useState("")
  const [department, setDepartment] = useState("")
  const [year, setYear] = useState("")
  const [rollNo, setRollNo] = useState("")
  const [phone, setPhone] = useState("")
  const [registrations, setRegistrations] = useState([])
  const [todayEvents, setTodayEvents] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const fetchRegistrationData = async () => {
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzxzB61OITDNFIdKpk_eYKUbz59p-504uIukXZT7qOw2yuD55YldAmTfmmdGpVM6HM/exec"
      )
      const data = await response.json()
      setRegistrations(data)
    } catch (error) {
      console.error("Error fetching registration data:", error)
    }
  }

  const fetchTodayEvents = async () => {
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzE0jNvKGLm0Sn3EEqhZdpioRIXGnK2fyb9zRPJ3nqWIHKBdOpEvYD9qNoT_mfbB6D6yA/exec"
      )
      const data = await response.json()
      setTodayEvents(data)
    } catch (error) {
      console.error("Error fetching today's events:", error)
    }
  }

  useEffect(() => {
    fetchRegistrationData()
    fetchTodayEvents()
  }, [])

  const formatDateTime = (dateString, timeString) => {
    const date = new Date(dateString)
    const formattedDate = isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleDateString("en-GB")

    const time = new Date(timeString)
    let formattedTime = "Invalid Time"

    if (!isNaN(time.getTime())) {
      if (timeString !== "1899-12-30T00:00:00.000Z") {
        const hour = time.getHours()
        const options = { hour: "2-digit", minute: "2-digit", hour12: true }
        const formatted = time.toLocaleTimeString("en-US", options)
        formattedTime = formatted.replace(
          "AM",
          hour >= 8 && hour < 12 ? "AM" : "PM"
        )
      } else {
        formattedTime = "No Time Available"
      }
    }

    return { date: formattedDate, time: formattedTime }
  }

  const getTodaysEvents = () => {
    const currentDate = new Date().toLocaleDateString("en-GB")
    return todayEvents.filter((item) => {
      const { date } = formatDateTime(item.date, item.time)
      return date === currentDate
    })
  }

  const handleRegister = async () => {
    const errors = {}
    if (!name) errors.name = "Name is required."
    if (!event) errors.event = "Event is required."
    if (!department) errors.department = "Department is required."
    if (!year) errors.year = "Year is required."
    if (!rollNo) errors.rollNo = "Roll number is required."
    if (!phone) errors.phone = "Phone number is required."
    if (phone && !/^\d{10}$/.test(phone)) {
      errors.phone = "Phone number must be exactly 10 digits."
    }

    setErrors(errors)
    if (Object.keys(errors).length > 0) return

    setIsLoading(true)

    const googleScriptURL =
      "https://script.google.com/macros/s/AKfycbzxzB61OITDNFIdKpk_eYKUbz59p-504uIukXZT7qOw2yuD55YldAmTfmmdGpVM6HM/exec"

    const formData = new FormData()
    formData.append("event", event)
    formData.append("name", name)
    formData.append("department", department)
    formData.append("year", year)
    formData.append("rollNo", rollNo)
    formData.append("phone", phone)

    try {
      const response = await fetch(googleScriptURL, {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      if (data.status === "success") {
        setRegistrationNumber(data.regNum)
        fetchRegistrationData()
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    }

    setIsLoading(false)
    setEvent("")
    setName("")
    setDepartment("")
    setYear("")
    setRollNo("")
    setPhone("")
  }

  const handleViewRegistrations = () => {
    navigate("/registered-list", { state: { event, registrations } })
  }

  return (
    <div>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="absolute inset-0  bg-cover bg-center mix-blend-overlay opacity-10"></div>
      
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
          {/* Today's Events Card */}
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
              {getTodaysEvents().length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-300">No events scheduled for today</p>
                </div>
              ) : (
                <ul className="space-y-6">
                  {getTodaysEvents().map((item, index) => {
                    const { date, time } = formatDateTime(item.date, item.time)
                    return (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
                      >
                        <h3 className="text-xl font-bold text-white mb-3">{item.event}</h3>
                        <div className="space-y-2 text-gray-300">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-pink-400" />
                            <span>{date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-violet-400" />
                            <span>{time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-indigo-400" />
                            <span>{item.venue}</span>
                          </div>
                        </div>
                      </motion.li>
                    )
                  })}
                </ul>
              )}
            </div>
          </motion.div>

          {/* Registration Form Card */}
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
              <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }} className="space-y-6">
                <div className="space-y-4">
                  {/* Event Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Event</label>
                    <select
                      value={event}
                      onChange={(e) => setEvent(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="" className="bg-gray-900">Select Event</option>
                      {getTodaysEvents().map((item, index) => (
                        <option key={index} value={item.event} className="bg-gray-900">
                          {item.event}
                        </option>
                      ))}
                    </select>
                    {errors.event && (
                      <p className="text-pink-500 text-sm mt-1">{errors.event}</p>
                    )}
                  </div>

                  {/* Name Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter your full name"
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    {errors.name && (
                      <p className="text-pink-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Department Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
                    <div className="relative">
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                      >
                        <option value="" className="bg-gray-900">Select Department</option>
                        {[
                          "Arabic", "B.Voc Auto", "B.Voc IT", "BCom CA", "BMMC", "Botany",
                          "Chemistry", "Commerce", "Computer Science", "Economics",
                          "English (Aided)", "English (SF)", "Functional English", "Geology",
                          "History", "Library Science", "Malayalam", "Management Studies",
                          "Maths", "MCJ", "Physics", "Psychology (Aided)", "Psychology (SF)",
                          "Sociology", "Statistics", "Zoology"
                        ].map((dept) => (
                          <option key={dept} value={dept} className="bg-gray-900">{dept}</option>
                        ))}
                      </select>
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    {errors.department && (
                      <p className="text-pink-500 text-sm mt-1">{errors.department}</p>
                    )}
                  </div>

                  {/* Year Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="" className="bg-gray-900">Select Year</option>
                      {["UG 1st Year", "UG 2nd Year", "UG 3rd Year", "PG 1st Year", "PG 2nd Year"].map((y) => (
                        <option key={y} value={y} className="bg-gray-900">{y}</option>
                      ))}
                    </select>
                    {errors.year && (
                      <p className="text-pink-500 text-sm mt-1">{errors.year}</p>
                    )}
                  </div>

                  {/* Roll Number Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Roll Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={rollNo}
                        onChange={(e) => setRollNo(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter your roll number"
                      />
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    {errors.rollNo && (
                      <p className="text-pink-500 text-sm mt-1">{errors.rollNo}</p>
                    )}
                  </div>

                  {/* Phone Number Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter your phone number"
                      />
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    {errors.phone && (
                      <p className="text-pink-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-violet-500 text-white py-3 rounded-lg font-medium hover:from-pink-600 hover:to-violet-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    </div>
                  ) : (
                    "Register Now"
                  )}
                </motion.button>
              </form>

              {/* Success Message */}
              {registrationNumber && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4"
                >
                  <div className="flex items-center gap-2 text-emerald-400 font-medium mb-1">
                    <Sparkles className="w-5 h-5" />
                    <span>Registration Successful!</span>
                  </div>
                  <p className="text-white">
                    Your Registration Number: <span className="font-mono font-bold">{registrationNumber}</span>
                  </p>
                </motion.div>
              )}

              {/* View Registrations Button */}
              <motion.button
                onClick={handleViewRegistrations}
                className="w-full mt-4 bg-white/5 border border-white/10 text-white py-3 rounded-lg font-medium hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Registered Participants
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  )
}

export default OffStageRegistration