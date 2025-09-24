// 'use client';

// import { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { useRouter } from 'next/navigation';

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   const loadUserFromStorage = useCallback(() => {
//     try {
//       const storedUser = localStorage.getItem('user');
//       const storedToken = localStorage.getItem('token');
//       console.log("Loading user from localStorage:", { storedUser, storedToken });
      
//       if (storedUser && storedToken) {
//         setUser(JSON.parse(storedUser));
//         setToken(storedToken);
//         console.log("User and token loaded:", { user: JSON.parse(storedUser), token: storedToken });
//       }
//     } catch (error) {
//       console.error("Failed to load user from localStorage:", error);
//       // Clear storage if it's corrupted
//       localStorage.removeItem('user');
//       localStorage.removeItem('token');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadUserFromStorage();
//   }, [loadUserFromStorage]);

//   const login = useCallback((userData) => {
//     console.log("Logging in user:", userData);
//     setUser(userData.user);
//     setToken(userData.token);
//     try {
//       localStorage.setItem('user', JSON.stringify(userData.user));
//       localStorage.setItem('token', userData.token);
//       console.log("User and token saved to localStorage:", { user: userData.user, token: userData.token });
//     } catch (error) {
//       console.error("Failed to save user to localStorage:", error);
//     }
//   }, []);

//   const logout = useCallback(async () => {
//     try {
//       // Clear context state
//       setUser(null);
//       setToken(null);
      
//       // Clear localStorage
//       localStorage.removeItem('user');
//       localStorage.removeItem('token');

//       // Call the API endpoint to clear the http-only cookie on the server
//       await fetch('/api/logout', { method: 'POST' });
//     } catch (error) {
//       console.error("Logout process failed:", error);
//     } finally {
//       // Redirect to home page
//       router.push('/');
//     }
//   }, [router]);

//   return (
//     <UserContext.Provider value={{ user, token, loading, login, logout }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => {
//   const context = useContext(UserContext);
//   if (context === undefined) {
//     throw new Error('useUser must be used within a UserProvider');
//   }
//   return context;
// };


// 'use client';

// import { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { useRouter } from 'next/navigation';

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   const loadUserFromStorage = useCallback(() => {
//     try {
//       const storedUser = localStorage.getItem('user');
//       const storedToken = localStorage.getItem('token');
//       console.log("Loading user from localStorage:", { storedUser, storedToken });
//       if (storedUser && storedToken) {
//         setUser(JSON.parse(storedUser));
//         setToken(storedToken);
//         console.log("User and token loaded:", { user: JSON.parse(storedUser), token: storedToken });
//       }
//     } catch (error) {
//       console.error("Failed to load user from localStorage:", error);
//       // Clear storage if it's corrupted
//       localStorage.removeItem('user');
//       localStorage.removeItem('token');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadUserFromStorage();
//   }, [loadUserFromStorage]);

//   const login = useCallback((userData) => {
//     setUser(userData.user);
//     setToken(userData.token);
//     try {
//       localStorage.setItem('user', JSON.stringify(userData.user));
//       localStorage.setItem('token', userData.token);
//     } catch (error) {
//       console.error("Failed to save user to localStorage:", error);
//     }
//   }, []);

//   const logout = useCallback(async () => {
//     try {
//       // Clear context state
//       setUser(null);
//       setToken(null);
      
//       // Clear localStorage
//       localStorage.removeItem('user');
//       localStorage.removeItem('token');

//       // Call the API endpoint to clear the http-only cookie on the server
//       await fetch('/api/logout', { method: 'POST' });

//     } catch (error) {
//       console.error("Logout process failed:", error);
//     } finally {
//       // Redirect to home page
//       router.push('/');
//     }
//   }, [router]);

//   return (
//     <UserContext.Provider value={{ user, token, loading, login, logout }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => {
//   const context = useContext(UserContext);
//   if (context === undefined) {
//     throw new Error('useUser must be used within a UserProvider');
//   }
//   return context;
// };

// /api/me/route.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch current user from cookie on load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me'
,       { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (userData) => {
    setUser(userData.user);
    router.push('/dashboard');
  };

  const logout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
