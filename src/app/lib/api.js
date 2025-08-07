// // src/app/lib/api.js

// export async function fetchJobs() {
//   const res = await fetch('/api/jobs');
//   if (!res.ok) throw new Error('Failed to fetch jobs');
//   return res.json();
// }

// export async function fetchJobById(id) {
//   const res = await fetch(`/api/jobs/${id}`);
//   if (!res.ok) throw new Error('Failed to fetch job');
//   return res.json();
// }

// export async function postJob(jobData) {
//   const res = await fetch('/api/jobs', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(jobData),
//   });
//   if (!res.ok) {
//     const errorData = await res.json();
//     throw new Error(errorData.message || 'Failed to post job');
//   }
//   return res.json();
// }

// export async function loginUser(credentials) {
//   const res = await fetch('/api/auth', { // Corrected URL to /api/auth
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ ...credentials, action: 'login' }), // Added action: 'login'
//   });
//   if (!res.ok) {
//     const errorData = await res.json();
//     throw new Error(errorData.message || 'Login failed');
//   }
//   return res.json();
// }

// export async function signupUser(data) {
//   const res = await fetch('/api/auth', { // Corrected URL to /api/auth
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ ...data, action: 'signup' }), // Added action: 'signup'
//   });
//   if (!res.ok) {
//     const errorData = await res.json();
//     throw new Error(errorData.message || 'Signup failed');
//   }
//   return res.json();
// }

// export async function fetchProfile() {
//   const res = await fetch('/api/users');
//   if (!res.ok) {
//     const errorData = await res.json();
//     throw new Error(errorData.message || 'Failed to fetch profile');
//   }
//   return res.json();
// }

// export async function updateProfile(formData) {
//   // formData is FormData instance (for files)
//   const res = await fetch('/api/users', {
//     method: 'PUT',
//     body: formData, // No 'Content-Type' header needed for FormData; browser sets it
//   });
//   if (!res.ok) {
//     const errorData = await res.json();
//     throw new Error(errorData.message || 'Failed to update profile');
//   }
//   return res.json();
// }


// API helper functions for the frontend

export async function apiRequest(url, options = {}) {
  const token = localStorage.getItem("token")

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Request failed")
    }

    return data
  } catch (error) {
    console.error("API Request Error:", error)
    throw error
  }
}

export const authAPI = {
  login: (credentials) =>
    apiRequest("/api/auth", {
      method: "POST",
      body: JSON.stringify({ action: "login", ...credentials }),
    }),

  signup: (userData) =>
    apiRequest("/api/auth", {
      method: "POST",
      body: JSON.stringify({ action: "signup", ...userData }),
    }),
}

export const jobsAPI = {
  getAll: (params = {}) => {
    const searchParams = new URLSearchParams(params)
    return apiRequest(`/api/jobs?${searchParams}`)
  },

  getById: (id) => apiRequest(`/api/jobs/${id}`),

  create: (jobData) =>
    apiRequest("/api/jobs", {
      method: "POST",
      body: JSON.stringify(jobData),
    }),
}

export const applicationsAPI = {
  create: (applicationData) =>
    apiRequest("/api/applications", {
      method: "POST",
      body: JSON.stringify(applicationData),
    }),
}
