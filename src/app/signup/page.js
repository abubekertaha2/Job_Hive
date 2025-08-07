// 'use client';

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';

// function SignUp() {
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     fullName: '', // Matches backend's expected 'fullName'
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });

//   const [errors, setErrors] = useState({
//     fullName: false,
//     email: false,
//     password: false,
//     confirmPassword: false
//   });

//   const [apiError, setApiError] = useState(''); // State to display API error messages

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     // Clear specific error when user starts typing in that field
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: false }));
//     }
//     setApiError(''); // Clear general API error on input change
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setApiError(''); // Clear any previous API errors

//     const newErrors = {
//       fullName: formData.fullName.trim() === '',
//       email: formData.email.trim() === '',
//       password: formData.password === '',
//       confirmPassword: formData.confirmPassword === ''
//     };

//     // Specific check for password mismatch
//     if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }

//     setErrors(newErrors); // Update validation errors state

//     // Check if any validation errors exist
//     const hasValidationErrors =
//       Object.values(newErrors).includes(true) || typeof newErrors.confirmPassword === 'string';

//     if (hasValidationErrors) {
//       console.log('Frontend validation errors:', newErrors);
//       return; // Stop submission if there are validation errors
//     }

//     try {
//       // Direct fetch call to your API route
//       const response = await fetch('/api/auth', { // Correct API endpoint: /api/auth
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           fullName: formData.fullName, // Send fullName
//           email: formData.email,
//           password: formData.password,
//           action: 'signup', // Crucial: tell the backend it's a signup action
//         }),
//       });

//       // Check if the response was successful (status 2xx)
//       if (!response.ok) {
//         let errorData;
//         try {
//           errorData = await response.json(); // Try to parse JSON error from API
//         } catch (e) {
//           // Fallback if API doesn't return JSON (e.g., 404 HTML page)
//           errorData = { message: `Server error: ${response.status} ${response.statusText}` };
//         }
//         throw new Error(errorData.message || 'Signup failed due to an unknown error.');
//       }

//       const data = await response.json();
//       console.log('Signup successful:', data.message);

//       // Redirect to the login page after successful signup
//       router.push('/login');

//     } catch (error) {
//       console.error('Signup API call error:', error.message);
//       setApiError(error.message || 'An unexpected error occurred. Please try again.'); // Display API error to user
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">
//       <div className="bg-white/15 backdrop-blur-3xl w-full max-w-md p-8 mt-16 rounded-lg shadow-lg text-white border border-white/20">
//         <h2 className="text-2xl font-bold text-center mb-6">Complete Your Sign Up</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label htmlFor="fullName" className="block text-sm font-medium text-white">
//               Enter Your Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               id="fullName"
//               name="fullName"
//               value={formData.fullName}
//               onChange={handleChange}
//               className={`w-full p-3 mt-2 border ${
//                 errors.fullName ? 'border-red-500' : 'border-gray-300'
//               } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white placeholder-gray-400`}
//               placeholder="First and Last Name"
//               required
//             />
//             {errors.fullName && <p className="text-red-500 text-xs mt-1">Full name is required.</p>}
//           </div>

//           <div className="mb-4">
//             <label htmlFor="email" className="block text-sm font-medium text-white">
//               Enter Your Email <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className={`w-full p-3 mt-2 border ${
//                 errors.email ? 'border-red-500' : 'border-gray-300'
//               } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white placeholder-gray-400`}
//               placeholder="Enter your email"
//               required
//             />
//             {errors.email && <p className="text-red-500 text-xs mt-1">Email is required.</p>}
//           </div>

//           <div className="mb-4">
//             <label htmlFor="password" className="block text-sm font-medium text-white">
//               Create Password <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               className={`w-full p-3 mt-2 border ${
//                 errors.password ? 'border-red-500' : 'border-gray-300'
//               } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white placeholder-gray-400`}
//               placeholder="Enter your password"
//               required
//             />
//             {errors.password && <p className="text-red-500 text-xs mt-1">Password is required.</p>}
//           </div>

//           <div className="mb-4">
//             <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
//               Confirm Password <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="password"
//               id="confirmPassword"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               className={`w-full p-3 mt-2 border ${
//                 errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
//               } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white placeholder-gray-400`}
//               placeholder="Confirm your password"
//               required
//             />
//             {typeof errors.confirmPassword === 'string' && (
//               <p className="text-red-500 text-xs mt-2">{errors.confirmPassword}</p>
//             )}
//              {errors.confirmPassword === true && typeof errors.confirmPassword !== 'string' && (
//               <p className="text-red-500 text-xs mt-1">Confirm Password is required.</p>
//             )}
//           </div>

//           {apiError && (
//             <p className="text-red-500 text-sm text-center mb-4">{apiError}</p>
//           )}

//           <button
//             type="submit"
//             className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold transition-colors duration-200"
//           >
//             Sign Up
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default SignUp;

// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import Link from "next/link"

// export default function SignupPage() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "job_seeker",
//     company: "",
//   })
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState("")
//   const router = useRouter()

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     setError("")

//     console.log("Submitting signup form:", { ...formData, password: "[HIDDEN]" })

//     try {
//       const response = await fetch("/api/auth", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           action: "signup",
//           ...formData,
//         }),
//       })

//       console.log("Response status:", response.status)
//       console.log("Response headers:", response.headers)

//       if (!response.ok) {
//         const errorText = await response.text()
//         console.error("Response error:", errorText)

//         try {
//           const errorData = JSON.parse(errorText)
//           setError(errorData.error || "Signup failed")
//         } catch {
//           setError(`Server error: ${response.status}`)
//         }
//         return
//       }

//       const data = await response.json()
//       console.log("Signup successful:", data)

//       if (data.token && data.user) {
//         localStorage.setItem("token", data.token)
//         localStorage.setItem("user", JSON.stringify(data.user))
//         router.push("/")
//       } else {
//         setError("Invalid response from server")
//       }
//     } catch (error) {
//       console.error("Network error:", error)
//       setError(`Network error: ${error.message}`)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
//       <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>

//       {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//           <input
//             type="text"
//             required
//             className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={formData.name}
//             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//           <input
//             type="email"
//             required
//             className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={formData.email}
//             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//           <input
//             type="password"
//             required
//             className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={formData.password}
//             onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">I am a</label>
//           <select
//             className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={formData.role}
//             onChange={(e) => setFormData({ ...formData, role: e.target.value })}
//           >
//             <option value="job_seeker">Job Seeker</option>
//             <option value="employer">Employer</option>
//           </select>
//         </div>

//         {formData.role === "employer" && (
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
//             <input
//               type="text"
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={formData.company}
//               onChange={(e) => setFormData({ ...formData, company: e.target.value })}
//             />
//           </div>
//         )}

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
//         >
//           {loading ? "Creating Account..." : "Sign Up"}
//         </button>
//       </form>

//       <p className="mt-4 text-center text-sm text-gray-600">
//         Already have an account?{" "}
//         <Link href="/login" className="text-blue-600 hover:text-blue-800">
//           Login
//         </Link>
//       </p>
//     </div>
//   )
// }


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
  const [signupSuccess, setSignupSuccess] = useState(false); // New state for success message
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(''); // Clear error on input change
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSignupSuccess(false);

    // Basic client-side validation
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

      setSignupSuccess(true); // Indicate successful signup

      // Step 2: Automatically log in the user after successful signup
      // This call will set the HttpOnly cookie on the browser
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
        // Store user data in localStorage for frontend display (not the token)
        localStorage.setItem('user', JSON.stringify(loginData.user));
        // Redirect directly to the profile page after auto-login
        router.push('/profile');
      } else {
        // If auto-login fails, show an error but still indicate signup success
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
            <span className="block sm:inline">Signup successful! Redirecting to your profile...</span>
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
