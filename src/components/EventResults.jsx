import React, { useState, useEffect } from "react"
import { Search } from 'lucide-react'

// Custom Input component
const Input = ({ className, ...props }) => (
  <input
    className={`w-full px-3 py-2 text-darkAccent border-2 border-primary rounded-lg focus:outline-none focus:border-secondary ${className}`}
    {...props}
  />
)

// Custom Button component


// Custom Card components
const Card = ({ className, children, ...props }) => (
  <div className={`bg-white shadow-xl rounded-lg overflow-hidden ${className}`} {...props}>
    {children}
  </div>
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

const EventResults = () => {
  const [results, setResults] = useState([])
  const [cachedResults, setCachedResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

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

        setCachedResults(finalResults)
        setResults(finalResults)
      } catch (error) {
        console.error("Error fetching results:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [])

  const renderPrize = (prize, prizeLabel, type) => {
    if (!prize || prize.length === 0) return null

    const isValidPrize = prize.some((winner) =>
      type === "individual"
        ? typeof winner === "object" &&
          (winner.name || winner.department || winner.year || winner.group)
        : typeof winner === "string" && winner
    )

    if (!isValidPrize) return null

    return (
      <div className={`p-4 rounded-lg ${
        prizeLabel === "1st"
          ? "bg-amber-200"
          : prizeLabel === "2nd"
          ? "bg-lightAccent"
          : "bg-purple-200"
      }`}>
        <h4 className="font-bold text-lg mb-2 text-darkAccent">{prizeLabel} Prize</h4>
        {(Array.isArray(prize) ? prize : [prize]).map((winner, idx) => (
          <div key={idx} className="mb-2 last:mb-0">
            {type === "individual" ? (
              typeof winner === "object" ? (
                <>
                  {winner.name && <p className="font-semibold text-darkAccent">{winner.name}</p>}
                  {winner.department && winner.year && (
                    <p className="text-sm text-secondary">
                      {winner.department}, {winner.year}
                    </p>
                  )}
                  {winner.group && <p className="text-sm text-secondary">{winner.group}</p>}
                </>
              ) : (
                <p className="text-darkAccent">{winner}</p>
              )
            ) : (
              <p className="text-darkAccent">{winner}</p>
            )}
          </div>
        ))}
      </div>
    )
  }

  const filteredResults = results.filter((result) => {
    const searchRegex = new RegExp(searchTerm, 'i')
    return (
      searchRegex.test(result.item) ||
      result.first.some((winner) => searchRegex.test(JSON.stringify(winner))) ||
      result.second.some((winner) => searchRegex.test(JSON.stringify(winner))) ||
      result.third.some((winner) => searchRegex.test(JSON.stringify(winner)))
    )
  })

  const resultsToDisplay = loading ? cachedResults : filteredResults

  return (
    <div className="bg-gradient-to-b from-primary/50 to-secondary/20 min-h-screen pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-darkAccent text-center mb-8">
          Event Results
        </h2>
        
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-md">
            <Input
              type="text"
              placeholder="Search by event, team, or participant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary" />
          </div>
        </div>

        {loading && resultsToDisplay.length === 0 ? (
          <div className="text-center text-darkAccent">Loading results...</div>
        ) : resultsToDisplay.length === 0 ? (
          <div className="text-center text-darkAccent">No results found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resultsToDisplay.map((result, index) => {
              const hasValidResults =
                (result.first && result.first.length > 0) ||
                (result.second && result.second.length > 0) ||
                (result.third && result.third.length > 0)

              if (!hasValidResults) return null

              return (
                <Card key={index}>
                  <CardHeader className="bg-primary text-white">
                    <CardTitle className="text-center">
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
          </div>
        )}
      </div>
    </div>
  )
}

export default EventResults

