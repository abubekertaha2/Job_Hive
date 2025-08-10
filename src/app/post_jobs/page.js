'use client';

// Make sure to import 'useCallback'
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function PostJobPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    salary: '',
    type: 'full-time',
  });

  // --- CORRECTED ---
  // Wrap the function in useCallback to make its reference stable.
  // It uses the 'router' so that is its only dependency.
  const checkUser = useCallback(() => {
    const userDataString = localStorage.getItem('user');
    if (userDataString) {
      try {
        const parsedUser = JSON.parse(userDataString);
        setUser(parsedUser);

        if (parsedUser.role !== 'employer') {
          router.push('/');
        } else if (parsedUser.company) {
          setJobData(prev => ({ ...prev, company: parsedUser.company }));
        }
      } catch (e) {
        console.error('Failed to parse user data from localStorage', e);
        localStorage.removeItem('user');
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  // --- Check User Authentication and Role on Load ---
  // The dependency array now uses the stable 'checkUser' function
  useEffect(() => {
    checkUser();
  }, [checkUser]);

  // --- Handle Form Input Changes ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccessMessage('');
  };

  // --- Handle Job Post Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    if (!jobData.title || !jobData.description || !jobData.company || !jobData.location || !jobData.type) {
      setError('Please fill in all required fields (Title, Description, Company, Location, Job Type).');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message || 'Job posted successfully!');
        setJobData({
          title: '',
          description: '',
          company: user?.company || '',
          location: '',
          salary: '',
          type: 'full-time',
        });
      } else {
        setError(data.message || data.error || 'Failed to post job. Please try again.');
      }
    } catch (err) {
      console.error('Job post network error:', err);
      setError('Network error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // --- Render Loading State ---
  if (loading) {
    return (
      <div className="flex-center min-h-screen">
        <p className="text-lg font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  // --- Render Unauthorized State ---
  if (!user || user.role !== 'employer') {
    return (
      <div className="flex-center min-h-screen flex-col">
        <p className="text-lg font-semibold text-red-500 mb-4">
          You must be logged in as an employer to post a job.
        </p>
        <button
          onClick={() => router.push('/login')}
          className="black_btn"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // --- Main Post Job Form ---
  return (
    <div className="max-w-3xl mx-auto my-8 p-6 bg-black rounded-lg shadow-xl border border-gray-200">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Post a New Job</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={jobData.title}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., Senior Software Engineer"
            required
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={jobData.company}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., Tech Solutions Inc."
            required
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={jobData.location}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., New York, NY or Remote"
            required
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Job Type <span className="text-red-500">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={jobData.type}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>

        <div>
          <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
            Salary (Optional)
          </label>
          <input
            type="text"
            id="salary"
            name="salary"
            value={jobData.salary}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., $80,000 - $100,000"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Job Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={jobData.description}
            onChange={handleChange}
            rows="8"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Provide a detailed description of the job responsibilities, qualifications, etc."
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
        >
          {submitting ? 'Posting Job...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
}