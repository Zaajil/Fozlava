import React, { useState, useEffect } from 'react'
import { Search, ChevronDown, Loader2, Users, AlertCircle } from 'lucide-react'

const RegisteredList = () => {
  const [events, setEvents] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [selectedEvent, setSelectedEvent] = useState("")
  const [filteredRegistrations, setFilteredRegistrations] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(
          'https://script.google.com/macros/s/AKfycbzE0jNvKGLm0Sn3EEqhZdpioRIXGnK2fyb9zRPJ3nqWIHKBdOpEvYD9qNoT_mfbB6D6yA/exec'
        )
        if (!response.ok) throw new Error('Failed to fetch events')
        const data = await response.json()
        setEvents(data)
      } catch (error) {
        console.error("Error fetching events:", error)
        setError('Failed to load events. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const fetchRegistrations = async (event) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `https://script.google.com/macros/s/AKfycbzxzB61OITDNFIdKpk_eYKUbz59p-504uIukXZT7qOw2yuD55YldAmTfmmdGpVM6HM/exec?event=${encodeURIComponent(event)}`
      )
      if (!response.ok) throw new Error('Failed to fetch registrations')
      const data = await response.json()
      setRegistrations(data)
    } catch (error) {
      console.error("Error fetching registrations data:", error)
      setError('Failed to load registrations. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEventChange = (e) => {
    const event = e.target.value
    setSelectedEvent(event)
    if (event) fetchRegistrations(event)
    else setRegistrations([])
  }

  useEffect(() => {
    if (selectedEvent && registrations.length > 0) {
      const filtered = registrations.filter((reg) => reg.event === selectedEvent)
      setFilteredRegistrations(filtered)
    } else {
      setFilteredRegistrations([])
    }
  }, [selectedEvent, registrations])

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const filteredBySearch = filteredRegistrations.filter((reg) => {
    const searchTerm = searchQuery.toLowerCase()
    return (
      reg.name.toLowerCase().includes(searchTerm) ||
      reg.department.toLowerCase().includes(searchTerm) ||
      reg.regNum.toLowerCase().includes(searchTerm) ||
      (reg.group && reg.group.toLowerCase().includes(searchTerm))
    )
  })

  return (
    <div className="bg-lightAccent min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-darkAccent text-center mb-8">
          Registered Participants
        </h1>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="event-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Event
                </label>
                <div className="relative border border-gray-300 rounded-md focus-within:border-primary focus-within:ring-primary focus-within:ring-1">
  <select
    id="event-select"
    value={selectedEvent}
    onChange={handleEventChange}
    className="block w-full pl-3 pr-10 py-2 text-base border-none focus:outline-none rounded-md"
    disabled={isLoading}
  >
    <option value="">-- Select Event --</option>
    {events.map((event, index) => (
      <option key={index} value={event.event}>
        {event.event}
      </option>
    ))}
  </select>
  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
    <ChevronDown className="h-4 w-4" />
  </div>
</div>

              </div>

              {selectedEvent && (
                <div className="flex-1">
                  <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-1">
                    Search Participants
                  </label>
                  <div className="relative">
                    <input
                      id="search-input"
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search by name, department, or registration number"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <span className="ml-2 text-lg text-gray-700">Loading...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-lg text-gray-700">{error}</p>
              </div>
            ) : selectedEvent && filteredBySearch.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-primary">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Registration Number
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Department
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Roll Number
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Group
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBySearch.map((reg, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reg.regNum}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reg.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reg.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reg.rollNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reg.group || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : selectedEvent ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-700">No registrations found for this event.</p>
              </div>
            ) : (
              <div className="text-center py-2 ">
                <div className="h-1 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-700">Please select an event to view registrations.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisteredList

