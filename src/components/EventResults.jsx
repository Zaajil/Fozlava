import React, { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Award } from 'lucide-react'
import { useInView } from 'react-intersection-observer'

const Input = ({ className, ...props }) => (
  <input
    className={`w-full px-4 py-3 text-darkAccent border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary transition-all duration-300 ${className}`}
    {...props}
  />
)

const Card = ({ className, children, ...props }) => (
  <motion.div
    className={`bg-white shadow-xl rounded-lg overflow-hidden ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    {...props}
  >
    {children}
  </motion.div>
)

const CardHeader = ({ className, children, ...props }) => (
  <div className={`px-6 py-4 ${className}`} {...props}>
    {children}
  </div>
)

const CardContent = ({ className, children, ...props }) => (
  <div className={`px-6 py-4 ${className}`} {...props}>
    {children}
  </div>
)

const CardTitle = ({ className, children, ...props }) => (
  <h3 className={`text-xl font-bold ${className}`} {...props}>
    {children}
  </h3>
)

const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-5/6 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-4/6"></div>
  </div>
)

const EventResults = () => {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [visibleResults, setVisibleResults] = useState(12)
  const [ref, inView] = useInView({
    threshold: 0,
    triggerOnce: false,
  })

  useEffect(() => {
    const fetchResults = async () => {
      try {
        console.log("Fetching results...")
        const response = await fetch("https://script.google.com/macros/s/AKfycbxu0ehjZKgAxTq4REiMrfdZlE5eZ5IhyURpggvW0AJEA8ikdzqOaRrbeg3_2Ag5jIXJGg/exec")
        const data = await response.json()

        const combinedResults = [
          ...data.individual.map((result) => ({
            type: "individual",
            item: result.item,
            first: result.first || null,
            second: result.second || null,
            third: result.third || null,
          })),
          ...data.group.map((result) => ({
            type: "group",
            item: result.item,
            first: result.first || null,
            second: result.second || null,
            third: result.third || null,
          })),
        ]

        const groupedResults = combinedResults.reduce((acc, result) => {
          if (!acc[result.item]) {
            acc[result.item] = { ...result, first: [], second: [], third: [] }
          }

          if (result.first) acc[result.item].first.push(result.first)
          if (result.second) acc[result.item].second.push(result.second)
          if (result.third) acc[result.item].third.push(result.third)

          return acc
        }, {})

        const finalResults = Object.values(groupedResults)

        setResults(finalResults)
      } catch (error) {
        console.error("Error fetching results:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [])

  useEffect(() => {
    if (inView) {
      setVisibleResults((prevVisible) => prevVisible + 12)
    }
  }, [inView])

  const renderPrize = (prize, prizeLabel, type) => {
    if (!prize || prize.length === 0) return null

    const isValidPrize = prize.some((winner) =>
      type === "individual"
        ? typeof winner === "object" &&
          (winner.name || winner.department || winner.year || winner.group)
        : typeof winner === "string" && winner
    )

    if (!isValidPrize) return null

    const bgColor = prizeLabel === "1st" ? "bg-yellow-100" : prizeLabel === "2nd" ? "bg-gray-100" : "bg-orange-100"
    const textColor = prizeLabel === "1st" ? "text-yellow-800" : prizeLabel === "2nd" ? "text-gray-800" : "text-orange-800"

    return (
      <motion.div
        className={`p-4 rounded-lg ${bgColor} ${textColor}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h4 className="font-bold text-lg mb-2 flex items-center">
          <Award className="mr-2" />
          {prizeLabel} Prize
        </h4>
        {(Array.isArray(prize) ? prize : [prize]).map((winner, idx) => (
          <motion.div
            key={idx}
            className="mb-2 last:mb-0"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
          >
            {type === "individual" ? (
              typeof winner === "object" ? (
                <>
                  {winner.name && <p className="font-semibold">{winner.name}</p>}
                  {winner.department && winner.year && (
                    <p className="text-sm">
                      {winner.department}, {winner.year}
                    </p>
                  )}
                  {winner.group && <p className="text-sm">{winner.group}</p>}
                </>
              ) : (
                <p>{winner}</p>
              )
            ) : (
              <p>{winner}</p>
            )}
          </motion.div>
        ))}
      </motion.div>
    )
  }

  const filteredResults = useMemo(() => {
    const searchRegex = new RegExp(searchTerm, 'i')
    return results.filter((result) => {
      return (
        searchRegex.test(result.item) ||
        result.first.some((winner) => searchRegex.test(JSON.stringify(winner))) ||
        result.second.some((winner) => searchRegex.test(JSON.stringify(winner))) ||
        result.third.some((winner) => searchRegex.test(JSON.stringify(winner)))
      )
    })
  }, [results, searchTerm])

  const resultsToDisplay = filteredResults.slice(0, visibleResults)

  return (
    <div className=" bg-gradient-to-br from-primary via-secondary to-primary min-h-screen pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-5xl font-bold text-lightAccent text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Event Results
        </motion.h2>
        
        <motion.div
          className="mb-12 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative w-full max-w-md">
            <Input
              type="text"
              placeholder="Search by event, team, or participant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-12"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary" size={20} />
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index}>
                <CardContent>
                  <LoadingSkeleton />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : resultsToDisplay.length === 0 ? (
          <motion.div
            className="text-center text-darkAccent text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            No results found.
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {resultsToDisplay.map((result, index) => {
                const hasValidResults =
                  (result.first && result.first.length > 0) ||
                  (result.second && result.second.length > 0) ||
                  (result.third && result.third.length > 0)

                if (!hasValidResults) return null

                return (
                  <Card key={index}>
                    <CardHeader className="bg-primary text-white">
                      <CardTitle className="text-center flex items-center justify-center">
                        {result.item}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {renderPrize(result.first, "1st", result.type)}
                        {renderPrize(result.second, "2nd", result.type)}
                        {renderPrize(result.third, "3rd", result.type)}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </motion.div>
          </AnimatePresence>
        )}
        
        {!loading && filteredResults.length > visibleResults && (
          <div ref={ref} className="flex justify-center mt-8">
            <motion.div
              className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default EventResults

