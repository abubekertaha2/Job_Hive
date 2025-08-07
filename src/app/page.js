"use client"

import { useState, useEffect } from "react"
import SearchBar from "@/components/SearchBar.js"
import JobCard from "@/components/JobCard.js"

export default function HomePage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    type: "",
  })

  useEffect(() => {
    fetchJobs()
  }, [filters])

  const fetchJobs = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.search) params.append("search", filters.search)
      if (filters.location) params.append("location", filters.location)
      if (filters.type) params.append("type", filters.type)

      const response = await fetch(`/api/jobs?${params}`)
      const data = await response.json()

      if (response.ok) {
        setJobs(data.jobs)
      }
    } catch (error) {
      console.error("Error fetching jobs:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-400 mb-4">Find Your Dream Job</h1>
        <p className="text-xl text-gray mb-8">Discover thousands of job opportunities from top companies</p>
      </div>

      <SearchBar filters={filters} setFilters={setFilters} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))
        ) : jobs.length > 0 ? (
          jobs.map((job) => <JobCard key={job.id} job={job} />)
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-300 text-lg">No jobs found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}