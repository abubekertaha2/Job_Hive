// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { useUser } from '@/context/UserContext';

// export default function SignUpPage() {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     role: 'job_seeker', // Default role
//     company: '', // Only for employers
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [signupSuccess, setSignupSuccess] = useState(false);
//   const router = useRouter();
//   const { login } = useUser();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     setError('');
//   };

//   const handleSignUp = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSignupSuccess(false);

//     if (!formData.name || !formData.email || !formData.password) {
//       setError('Please fill in all required fields.');
//       setLoading(false);
//       return;
//     }
//     if (formData.role === 'employer' && !formData.company) {
//       setError('Company name is required for employers.');
//       setLoading(false);
//       return;
//     }

//     try {
//       // Step 1: Attempt to create the user (signup)
//       const signupResponse = await fetch('/api/auth', {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           action: 'signup',
//           name: formData.name,
//           email: formData.email,
//           password: formData.password,
//           role: formData.role,
//           company: formData.role === 'employer' ? formData.company : null,
//         }),
//       });

//       const signupData = await signupResponse.json();

//       if (!signupResponse.ok) {
//         setError(signupData.message || signupData.error || 'Signup failed.');
//         setLoading(false);
//         return;
//       }

//       setSignupSuccess(true);

//       // Step 2: Automatically log in the user after successful signup
//       const loginResponse = await fetch('/api/auth', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           action: 'login',
//           email: formData.email,
//           password: formData.password,
//         }),
//       });

//       const loginData = await loginResponse.json();

//       if (loginResponse.ok) {
//         // --- THIS IS THE KEY FIX ---
//         // Pass BOTH the user object and the token to the login function
//         login(loginData.user, loginData.token);

//         // Redirect based on the user's role
//         const redirectTo = loginData.user.role === 'employer' ? '/dashboard' : '/';
//         router.push(redirectTo);
//       } else {
//         setError(loginData.message || loginData.error || 'Signup successful, but auto-login failed. Please try logging in manually.');
//       }

//     } catch (err) {
//       console.error('Signup/Auto-login network error:', err);
//       setError('Network error occurred. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-xl border border-gray-200">
//         <div>
//           <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
//             Create Your Account
//           </h1>
//         </div>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//             <span className="block sm:inline">{error}</span>
//           </div>
//         )}
//         {signupSuccess && !error && (
//           <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
//             <span className="block sm:inline">Signup successful! Redirecting to your dashboard...</span>
//           </div>
//         )}

//         <form onSubmit={handleSignUp} className="mt-8 space-y-6">
//           {/* Name */}
//           <div>
//             <label htmlFor="name" className="sr-only">Name</label>
//             <input
//               id="name"
//               name="name"
//               type="text"
//               autoComplete="name"
//               required
//               className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//               placeholder="Full Name"
//               value={formData.name}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label htmlFor="email-address" className="sr-only">Email address</label>
//             <input
//               id="email-address"
//               name="email"
//               type="email"
//               autoComplete="email"
//               required
//               className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//               placeholder="Email address"
//               value={formData.email}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label htmlFor="password" className="sr-only">Password</label>
//             <input
//               id="password"
//               name="password"
//               type="password"
//               autoComplete="new-password"
//               required
//               className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Role Selection */}
//           <div>
//             <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
//               I am a:
//             </label>
//             <select
//               id="role"
//               name="role"
//               required
//               className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//               value={formData.role}
//               onChange={handleChange}
//             >
//               <option value="job_seeker">Job Seeker</option>
//               <option value="employer">Employer</option>
//             </select>
//           </div>

//           {/* Company Name (only for employers) */}
//           {formData.role === 'employer' && (
//             <div>
//               <label htmlFor="company" className="sr-only">Company Name</label>
//               <input
//                 id="company"
//                 name="company"
//                 type="text"
//                 autoComplete="organization"
//                 required={formData.role === 'employer'}
//                 className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="Company Name"
//                 value={formData.company}
//                 onChange={handleChange}
//               />
//             </div>
//           )}

//           {/* Submit Button */}
//           <div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? 'Signing Up...' : 'Sign Up'}
//             </button>
//           </div>
//         </form>

//         <div className="text-sm text-center">
//           <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
//             Already have an account? Sign In
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'job_seeker', // Default role
    company: '', // Only for employers
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const router = useRouter();
  const { login } = useUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSignupSuccess(false);

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }
    if (formData.role === 'employer' && !formData.company) {
      setError('Company name is required for employers.');
      setLoading(false);
      return;
    }

    try {
      // Step 1: Attempt to create the user (signup)
      const signupResponse = await fetch('/api/auth', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'signup',
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          company: formData.role === 'employer' ? formData.company : null,
        }),
      });

      const signupData = await signupResponse.json();

      if (!signupResponse.ok) {
        setError(signupData.message || signupData.error || 'Signup failed.');
        setLoading(false);
        return;
      }

      setSignupSuccess(true);

      // Step 2: Automatically log in the user after successful signup
      const loginResponse = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'login',
          email: formData.email,
          password: formData.password,
        }),
      });

      const loginData = await loginResponse.json();

      if (loginResponse.ok) {
        // --- THIS IS THE KEY FIX ---
        // Pass the entire loginData object to the login function to save the user and token
        login(loginData);

        // Redirect based on the user's role
        const redirectTo = loginData.user.role === 'employer' ? '/dashboard' : '/';
        router.push(redirectTo);
      } else {
        setError(loginData.message || loginData.error || 'Signup successful, but auto-login failed. Please try logging in manually.');
      }

    } catch (err) {
      console.error('Signup/Auto-login network error:', err);
      setError('Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-xl border border-gray-200">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
            Create Your Account
          </h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {signupSuccess && !error && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">Signup successful! Redirecting to your dashboard...</span>
          </div>
        )}

        <form onSubmit={handleSignUp} className="mt-8 space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="sr-only">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email-address" className="sr-only">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Role Selection */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              I am a:
            </label>
            <select
              id="role"
              name="role"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="job_seeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
          </div>

          {/* Company Name (only for employers) */}
          {formData.role === 'employer' && (
            <div>
              <label htmlFor="company" className="sr-only">Company Name</label>
              <input
                id="company"
                name="company"
                type="text"
                autoComplete="organization"
                required={formData.role === 'employer'}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Company Name"
                value={formData.company}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>
        </form>

        <div className="text-sm text-center">
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Already have an account? Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
