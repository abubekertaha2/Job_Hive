'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function JobDetailsPage() {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [user, setUser] = useState(null);
  const [applicationSuccess, setApplicationSuccess] = useState('');
  const [applicationError, setApplicationError] = useState('');

  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const userDataString = localStorage.getItem('user');
    if (userDataString) {
      try {
        setUser(JSON.parse(userDataString));
      } catch (e) {
        console.error('Failed to parse user data from localStorage', e);
        localStorage.removeItem('user');
      }
    }

    fetchJob();
  }, [params.id, router]);

  const fetchJob = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/jobs/${params.id}`);
      const data = await response.json();

      if (response.ok) {
        setJob(data.job);
      } else {
        console.error('Failed to fetch job:', data.message || 'Unknown error');
        router.push('/jobs');
      }
    } catch (error) {
      console.error('Error fetching job:', error);
      router.push('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setApplicationSuccess('');
    setApplicationError('');

    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'job_seeker') {
      setApplicationError('Only job seekers can apply for jobs.');
      return;
    }

    setApplying(true);

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: params.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setApplicationSuccess(data.message || 'Application submitted successfully!');
      } else {
        setApplicationError(data.message || 'Failed to submit application.');
      }
    } catch (error) {
      console.error('Application submission network error:', error);
      setApplicationError('Network error occurred. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white p-8 rounded-lg shadow animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded mt-8 w-1/4"></div>
          <div className="h-24 bg-gray-200 rounded mt-4"></div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <p className="text-xl font-semibold text-gray-700">Job not found.</p>
        <button onClick={() => router.push('/jobs')} className="mt-4 black_btn">
          Back to Job Listings
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{job.title}</h1>
            <p className="text-xl text-gray-600 mb-2">{job.company}</p>
            <p className="text-gray-500 text-sm">{job.location}</p>
          </div>
          <div className="text-left sm:text-right mt-4 sm:mt-0">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {job.type}
            </span>
            {job.salary && <p className="text-green-600 font-semibold mt-2">{job.salary}</p>}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Job Description</h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{job.description}</p>
          </div>

          {job.employerName && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Posted By</h2>
              <p className="text-gray-700">
                {job.employerName} {job.employerCompany ? `at ${job.employerCompany}` : ''}
              </p>
            </div>
          )}
        </div>
      </div>

      {user && user.role === 'job_seeker' ? (
        <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Apply for this Job</h2>

          {applicationSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{applicationSuccess}</span>
            </div>
          )}
          {applicationError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{applicationError}</span>
            </div>
          )}

          <form onSubmit={handleApply} className="space-y-4">
            <button
              type="submit"
              disabled={applying}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 font-semibold transition duration-150 ease-in-out"
            >
              {applying ? 'Submitting Application...' : 'Submit Application'}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-blue-50 p-6 rounded-lg text-center shadow-md border border-blue-200">
          <p className="text-blue-800 mb-4 text-lg">
            {user ? 'Only job seekers can apply for jobs.' : 'Please log in to apply for this job.'}
          </p>
          {!user && (
            <button
              onClick={() => router.push('/login')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-semibold"
            >
              Login to Apply
            </button>
          )}
        </div>
      )}
    </div>
  );
}