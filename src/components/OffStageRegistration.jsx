import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, Clock, MapPin, User, Briefcase, Phone, Hash } from 'lucide-react'

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
    <div className="bg-lightAccent min-h-screen pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-darkAccent text-center mb-12">
          Off-Stage Event Registration
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Offstage Events Section */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-primary text-white py-4 px-6">
              <h2 className="text-2xl font-semibold">Today's Off-Stage Events</h2>
            </div>
            <div className="p-6">
              {getTodaysEvents().length === 0 ? (
                <p className="text-center text-gray-500">No events today.</p>
              ) : (
                <ul className="space-y-4">
                  {getTodaysEvents().map((item, index) => {
                    const { date, time } = formatDateTime(item.date, item.time)
                    return (
                      <li key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                        <h3 className="text-lg font-semibold text-darkAccent mb-2">{item.event}</h3>
                        <div className="flex items-center text-gray-600 mb-1">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{date}</span>
                        </div>
                        <div className="flex items-center text-gray-600 mb-1">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{time}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{item.venue}</span>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-secondary text-white py-4 px-6">
              <h2 className="text-2xl font-semibold">Registration Form</h2>
            </div>
            <div className="p-6">
              <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }} className="space-y-4">
                <div>
                  <label htmlFor="event" className="block text-sm font-medium text-gray-700 mb-1">
                    Event
                  </label>
                  <select
                    id="event"
                    value={event}
                    onChange={(e) => setEvent(e.target.value)}
                    className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  >
                    <option value="">-- Select Event --</option>
                    {getTodaysEvents().map((item, index) => (
                      <option key={index} value={item.event}>
                        {item.event}
                      </option>
                    ))}
                  </select>
                  {errors.event && <p className="text-red-500 text-xs mt-1">{errors.event}</p>}
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <div className="relative">
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-gray-300 rounded-md shadow-sm pl-10 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="Enter your full name"
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <div className="relative">
                    <select
                      id="department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full border border-gray-300 rounded-md shadow-sm pl-10 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    >
                      <option value="">-- Select Department --</option>
                      {[
                        "Arabic", "B.Voc Auto", "B.Voc IT", "BCom CA", "BMMC", "Botany",
                        "Chemistry", "Commerce", "Computer Science", "Economics",
                        "English (Aided)", "English (SF)", "Functional English", "Geology",
                        "History", "Library Science", "Malayalam", "Management Studies",
                        "Maths", "MCJ", "Physics", "Psychology (Aided)", "Psychology (SF)",
                        "Sociology", "Statistics", "Zoology"
                      ].map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                  {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                </div>

                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <select
                    id="year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  >
                    <option value="">-- Select Year --</option>
                    <option value="UG 1st Year">UG 1st Year</option>
                    <option value="UG 2nd Year">UG 2nd Year</option>
                    <option value="UG 3rd Year">UG 3rd Year</option>
                    <option value="PG 1st Year">PG 1st Year</option>
                    <option value="PG 2nd Year">PG 2nd Year</option>
                  </select>
                  {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
                </div>

                <div>
                  <label htmlFor="rollNo" className="block text-sm font-medium text-gray-700 mb-1">
                    Roll No
                  </label>
                  <div className="relative">
                    <input
                      id="rollNo"
                      type="text"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      className="w-full border border-gray-300 rounded-md shadow-sm pl-10 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="Enter your roll number"
                    />
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                  {errors.rollNo && <p className="text-red-500 text-xs mt-1">{errors.rollNo}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-gray-300 rounded-md shadow-sm pl-10 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="Enter your phone number"
                    />
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    </div>
                  ) : (
                    "Register"
                  )}
                </button>
              </form>

              {registrationNumber && (
                <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                  <p className="font-semibold">Registration Successful!</p>
                  <p>Your Registration Number: <span className="font-bold">{registrationNumber}</span></p>
                </div>
              )}

              <button
                onClick={handleViewRegistrations}
                className="w-full mt-4 bg-secondary text-white px-4 py-2 rounded-md hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors duration-300"
              >
                View Registered Participants
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OffStageRegistration
