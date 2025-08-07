'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar'; // Updated import path
import JobCard from '@/components/JobCard';   // Updated import path

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // Added error state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: '',
  });

  useEffect(() => {
    fetchJobs();
  }, [filters, pagination.currentPage]); // Dependencies for refetching jobs

  const fetchJobs = async () => {
    setLoading(true);
    setError(''); // Clear previous errors
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.location) params.append('location', filters.location);
      if (filters.type) params.append('type', filters.type);
      params.append('page', pagination.currentPage.toString());

      const response = await fetch(`/api/jobs?${params.toString()}`); // Use params.toString()
      const data = await response.json();

      if (response.ok) {
        setJobs(data.jobs);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalCount: data.totalCount,
        });
      } else {
        // Handle API errors
        throw new Error(data.message || 'Failed to fetch jobs.');
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err.message || 'An error occurred while fetching jobs.');
      setJobs([]); // Clear jobs on error
      setPagination({ currentPage: 1, totalPages: 1, totalCount: 0 }); // Reset pagination
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return; // Prevent invalid page changes
    setPagination({ ...pagination, currentPage: page });
    // setLoading(true); // setLoading is already called in fetchJobs
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
      <div className="text-center py-4">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Browse Job Opportunities</h1>
        <p className="text-lg text-gray-600">Discover your next career move with thousands of listings.</p>
      </div>

      <SearchBar filters={filters} setFilters={setFilters} />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600 font-medium">
          {pagination.totalCount} jobs found
        </p>
        {/* Add sorting options here if desired */}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          // Loading skeleton for better UX
          Array.from({ length: 6 }).map((_, i) => ( // Use 'limit' from pagination
            <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))
        ) : jobs.length > 0 ? (
          jobs.map((job) => <JobCard key={job.id} job={job} />)
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-8">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1 || loading}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                page === pagination.currentPage
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-300'
              }`}
              disabled={loading}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages || loading}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
