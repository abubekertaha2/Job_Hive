// export async function apiRequest(url, options = {}) {
//   const token = localStorage.getItem("token")

//   const config = {
//     headers: {
//       "Content-Type": "application/json",
//       ...(token && { Authorization: `Bearer ${token}` }),
//       ...options.headers,
//     },
//     ...options,
//   }


//   try {
//     const response = await fetch(url, config)
//     const data = await response.json()

//     if (!response.ok) {
//       throw new Error(data.error || "Request failed")
//     }

//     return data
//   } catch (error) {
//     console.error("API Request Error:", error)
//     throw error
//   }
// }

// export const authAPI = {
//   login: (credentials) =>
//     apiRequest("/api/auth", {
//       method: "POST",
//       body: JSON.stringify({ action: "login", ...credentials }),
//     }),

//   signup: (userData) =>
//     apiRequest("/api/auth", {
//       method: "POST",
//       body: JSON.stringify({ action: "signup", ...userData }),
//     }),
// }

// export const jobsAPI = {
//   getAll: (params = {}) => {
//     const searchParams = new URLSearchParams(params)
//     return apiRequest(`/api/jobs?${searchParams}`)
//   },

//   getById: (id) => apiRequest(`/api/jobs/${id}`),

//   create: (jobData) =>
//     apiRequest("/api/jobs", {
//       method: "POST",
//       body: JSON.stringify(jobData),
//     }),
// }

// export const applicationsAPI = {
//   create: (applicationData) =>
//     apiRequest("/api/applications", {
//       method: "POST",
//       body: JSON.stringify(applicationData),
//     }),
// }

export async function apiRequest(url, options = {}) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // Important: sends cookies with each request
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
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
};

export const jobsAPI = {
  getAll: (params = {}) => {
    const searchParams = new URLSearchParams(params);
    return apiRequest(`/api/jobs?${searchParams}`);
  },

  getById: (id) => apiRequest(`/api/jobs/${id}`),

  create: (jobData) =>
    apiRequest("/api/jobs", {
      method: "POST",
      body: JSON.stringify(jobData),
    }),
};

export const applicationsAPI = {
  create: (applicationData) =>
    apiRequest("/api/applications", {
      method: "POST",
      body: JSON.stringify(applicationData),
    }),
};
