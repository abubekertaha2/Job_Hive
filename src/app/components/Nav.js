'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { Menu, X } from 'lucide-react';

export default function Nav() {
  const { user, logout } = useUser();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', { method: 'POST' });
      logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      logout();
      router.push('/');
    }
  };

  return (
    <nav className="bg-gray-700 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
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

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-6">
            <Link href="/jobs" className="text-gray-400 hover:text-blue-600">
              Browse Jobs
            </Link>
            {user?.role === 'employer' && (
              <>
                <Link
                  href="/post_jobs"
                  className="text-gray-400 hover:text-blue-600"
                >
                  Post Job
                </Link>
                <Link
                  href="/dashboard"
                  className="text-gray-400 hover:text-blue-600"
                >
                  Dashboard
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded hover:bg-gray-300"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="text-gray-400 hover:text-blue-600"
                >
                  {user.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* ✅ Mobile Menu Content (links + auth) */}
        {menuOpen && (
          <div className="md:hidden bg-gray-100 p-4 space-y-3 rounded-lg mt-2">
            {/* Links */}
            <Link
              href="/jobs"
              className="block text-gray-700 hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              Browse Jobs
            </Link>
            {user?.role === 'employer' && (
              <>
                <Link
                  href="/post_jobs"
                  className="block text-gray-700 hover:text-blue-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Post Job
                </Link>
                <Link
                  href="/dashboard"
                  className="block text-gray-700 hover:text-blue-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </>
            )}

            {/* ✅ Auth Buttons for mobile */}
            <div className="pt-3 border-t border-gray-300">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className="block text-gray-700 hover:text-blue-600 mb-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    {user.name}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block text-blue-600 hover:text-blue-800 mb-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
