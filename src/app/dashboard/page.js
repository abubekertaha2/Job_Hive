// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useUser } from '@/context/UserContext';
// import Link from 'next/link';

// export default function DashboardPage() {
//   const router = useRouter();
//   const { user, token, loading: userLoading, logout } = useUser();

//   const [jobs, setJobs] = useState([]);
//   const [loadingJobs, setLoadingJobs] = useState(true);
//   const [error, setError] = useState('');

//   // Effect to handle redirection if not an employer
//   useEffect(() => {
//     console.log("Checking user role for redirection:", { user, userLoading });
//     if (!userLoading && (!user || user.role !== 'employer')) {
//       // You can redirect to login or homepage
//       router.push('/login');
//     }
//   }, [user, userLoading, router]);

//   // Effect to fetch jobs once the user and token are available
//   useEffect(() => {
//     // --- NEW DEBUGGING LOG ---
//     console.log("Dashboard useEffect is running. User:", user, "Token:", token);
    
//     const fetchPostedJobs = async () => {
//       // Only proceed if user and token are available and not in a loading state
//       if (!user || !token) {
//         setLoadingJobs(false);
//         return;
//       }

//       setLoadingJobs(true);
//       setError('');
//       try {
//         const response = await fetch(`/api/employer`, {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         });

//         const data = await response.json();

//         if (response.ok) {
//           setJobs(data.jobs || []);
//         } else {
//           setError(data.message || 'Failed to fetch jobs.');
//           // If the token is invalid, log out the user
//           if (response.status === 401) {
//             logout();
//           }
//         }
//       } catch (err) {
//         console.error('Failed to fetch jobs:', err);
//         setError('Network error occurred. Please try again.');
//       } finally {
//         setLoadingJobs(false);
//       }
//     };

//     fetchPostedJobs();
//   }, [user, token, logout]);

//   // Handle loading and access control rendering
//   if (userLoading) {
//     return (
//       <div className="flex-center min-h-screen">
//         <p className="text-lg font-semibold text-gray-700">Loading...</p>
//       </div>
//     );
//   }

//   if (!user || user.role !== 'employer') {
//     return (
//       <div className="flex-center min-h-screen flex-col">
//         <p className="text-lg font-semibold text-red-500 mb-4">
//           You must be logged in as an employer to view this page.
//         </p>
//         <Link href="/login" className="black_btn">
//           Go to Login
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto my-8 p-6 bg-white rounded-lg shadow-xl border border-gray-200">
//       <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Employer Dashboard</h1>
//       <p className="text-lg text-gray-600 mb-6 text-center">
//         Welcome, {user.name}! Here are the jobs you've posted.
//       </p>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
//           <span className="block sm:inline">{error}</span>
//         </div>
//       )}

//       {loadingJobs ? (
//         <div className="text-center py-10">
//           <p className="text-lg text-gray-500">Loading your jobs...</p>
//         </div>
//       ) : (
//         <>
//           {jobs.length === 0 ? (
//             <div className="text-center py-10">
//               <p className="text-lg text-gray-500 mb-4">You have not posted any jobs yet.</p>
//               <Link href="/post_jobs" className="blue_btn">
//                 Post Your First Job
//               </Link>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {jobs.map((job) => (
//                 <div key={job.id} className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-100 transition-transform duration-200 hover:scale-105">
//                   <h3 className="text-xl font-bold text-gray-800 mb-2">{job.title}</h3>
//                   <p className="text-gray-600 mb-1"><strong>Company:</strong> {job.company}</p>
//                   <p className="text-gray-600 mb-1"><strong>Location:</strong> {job.location}</p>
//                   <p className="text-gray-600 mb-4"><strong>Salary:</strong> {job.salary}</p>
//                   <p className="text-gray-700 line-clamp-3">{job.description}</p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useUser } from '@/context/UserContext';
// import Link from 'next/link';

// export default function DashboardPage() {
//   const router = useRouter();
//   const { user, token, loading: userLoading, logout } = useUser();

//   const [jobs, setJobs] = useState([]);
//   const [loadingJobs, setLoadingJobs] = useState(true);
//   const [error, setError] = useState('');

//   // Effect to handle redirection if not an employer
//   useEffect(() => {
//     console.log("Checking user role for redirection:", { user, userLoading });
//     if (!userLoading && (!user || user.role !== 'employer')) {
//       router.push('/login');
//     }
//   }, [user, userLoading, router]);

//   // Effect to fetch jobs once the user and token are available
//   useEffect(() => {
//     console.log("Dashboard useEffect is running. User:", user, "Token:", token);
    
//     const fetchPostedJobs = async () => {
//       // Only proceed if user and token are available and not in a loading state
//       if (!user || !token) {
//         console.log("User or token not available. Exiting fetch.");
//         setLoadingJobs(false);
//         return;
//       }

//       setLoadingJobs(true);
//       setError('');
//       try {
//         console.log("Fetching jobs with Authorization Header:", `Bearer ${token}`);
//         const response = await fetch(`/api/employer`, {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         });

//         const data = await response.json();
//         console.log("Response from backend:", { response, data });

//         if (response.ok) {
//           setJobs(data.jobs || []);
//           console.log("Jobs fetched successfully:", data.jobs);
//         } else {
//           setError(data.message || 'Failed to fetch jobs.');
//           console.error("Error fetching jobs:", data.message);
//           // If the token is invalid, log out the user
//           if (response.status === 401) {
//             console.warn("Unauthorized access. Logging out.");
//             logout();
//           }
//         }
//       } catch (err) {
//         console.error('Failed to fetch jobs:', err);
//         setError('Network error occurred. Please try again.');
//       } finally {
//         setLoadingJobs(false);
//       }
//     };

//     fetchPostedJobs();
//   }, [user, token, logout]);

//   // Handle loading and access control rendering
//   if (userLoading) {
//     return (
//       <div className="flex-center min-h-screen">
//         <p className="text-lg font-semibold text-gray-700">Loading...</p>
//       </div>
//     );
//   }

//   if (!user || user.role !== 'employer') {
//     return (
//       <div className="flex-center min-h-screen flex-col">
//         <p className="text-lg font-semibold text-red-500 mb-4">
//           You must be logged in as an employer to view this page.
//         </p>
//         <Link href="/login" className="black_btn">
//           Go to Login
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto my-8 p-6 bg-white rounded-lg shadow-xl border border-gray-200">
//       <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Employer Dashboard</h1>
//       <p className="text-lg text-gray-600 mb-6 text-center">
//         Welcome, {user.name}! Here are the jobs you've posted.
//       </p>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
//           <span className="block sm:inline">{error}</span>
//         </div>
//       )}

//       {loadingJobs ? (
//         <div className="text-center py-10">
//           <p className="text-lg text-gray-500">Loading your jobs...</p>
//         </div>
//       ) : (
//         <>
//           {jobs.length === 0 ? (
//             <div className="text-center py-10">
//               <p className="text-lg text-gray-500 mb-4">You have not posted any jobs yet.</p>
//               <Link href="/post_jobs" className="blue_btn">
//                 Post Your First Job
//               </Link>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {jobs.map((job) => (
//                 <div key={job.id} className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-100 transition-transform duration-200 hover:scale-105">
//                   <h3 className="text-xl font-bold text-gray-800 mb-2">{job.title}</h3>
//                   <p className="text-gray-600 mb-1"><strong>Company:</strong> {job.company}</p>
//                   <p className="text-gray-600 mb-1"><strong>Location:</strong> {job.location}</p>
//                   <p className="text-gray-600 mb-4"><strong>Salary:</strong> {job.salary}</p>
//                   <p className="text-gray-700 line-clamp-3">{job.description}</p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: userLoading, logout } = useUser();

  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [error, setError] = useState('');

  // Redirect if user is not employer
  useEffect(() => {
    if (!userLoading && (!user || user.role !== 'employer')) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  // Fetch jobs for employer using cookies
  useEffect(() => {
    if (!user || user.role !== 'employer') return;

    const fetchPostedJobs = async () => {
      setLoadingJobs(true);
      setError('');

      try {
        const response = await fetch('/api/employer', {method: 'GET',
          credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
          setJobs(data.jobs || []);
        } else {
          setError(data.message || 'Failed to fetch jobs.');
          if (response.status === 401) logout();
        }
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
        setError('Network error occurred. Please try again.');
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchPostedJobs();
  }, [user, logout]);

  if (userLoading) {
    return (
      <div className="flex-center min-h-screen">
        <p className="text-lg font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  if (!user || user.role !== 'employer') {
    return (
      <div className="flex-center min-h-screen flex-col">
        <p className="text-lg font-semibold text-red-500 mb-4">
          You must be logged in as an employer to view this page.
        </p>
        <Link href="/login" className="black_btn">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto my-8 p-6 bg-white rounded-lg shadow-xl border border-gray-200">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Employer Dashboard</h1>
      <p className="text-lg text-gray-600 mb-6 text-center">
        Welcome, {user.name}! Here are the jobs you've posted.
      </p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loadingJobs ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500">Loading your jobs...</p>
        </div>
      ) : (
        <>
          {jobs.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-lg text-gray-500 mb-4">You have not posted any jobs yet.</p>
              <Link href="/post_jobs" className="blue_btn">
                Post Your First Job
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <div key={job.id} className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-100 transition-transform duration-200 hover:scale-105">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{job.title}</h3>
                  <p className="text-gray-600 mb-1"><strong>Company:</strong> {job.company}</p>
                  <p className="text-gray-600 mb-1"><strong>Location:</strong> {job.location}</p>
                  <p className="text-gray-600 mb-4"><strong>Salary:</strong> {job.salary}</p>
                  <p className="text-gray-700 line-clamp-3">{job.description}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
