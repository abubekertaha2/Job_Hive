'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Nav() {
  const [user, setUser] = useState(null);
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
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });

      if (response.ok) {
        localStorage.removeItem('user');
        setUser(null);
        router.push('/');
      } else {
        console.error('Logout failed on server:', await response.json());
        localStorage.removeItem('user');
        setUser(null);
        router.push('/');
      }
    } catch (error) {
      console.error('Network error during logout:', error)
      localStorage.removeItem('user');
      setUser(null);
      router.push('/');
    }
  };
  return (
    <nav className="bg-gray-200 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* <Link href="/" className="text-2xl font-bold text-blue-600">
            JobBoard
          </Link> */}
          <Link href="/" className="flex items-center">
                <Image
                    src="/assets/images/logo.png" 
                    alt="Company Logo"
                    width={50} 
                    height={50}
                    className="rounded-full aspect-square object-cover"

                />
                <span className="text-2xl font-bold text-blue-600 ml-2">
                    JobBoard
                </span>
            </Link>

          <div className="hidden md:flex space-x-6">
            <Link href="/jobs" className="text-gray-700 hover:text-blue-600">
              Browse Jobs
            </Link>
            {user?.role === "employer" && (
              <Link href="/post_jobs" className="text-gray-700 hover:text-blue-600">
                Post Job
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="text-gray-700 hover:text-blue-600">
                  {user.name}
                </Link>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link href="/login" className="text-blue-600 hover:text-blue-800">
                  Login
                </Link>
                <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
