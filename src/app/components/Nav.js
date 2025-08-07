// 'use client';

// import Image from 'next/image';
// import React, { useState } from 'react';
// import Link from 'next/link';

// const Nav = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const handleMenuToggle = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   return (
//     // The main nav container now becomes a column on small screens (flex-col)
//     // This allows the top bar (logo+button) and the mobile menu to stack vertically.
//     <nav className="flex flex-col md:flex-row justify-between items-center w-full py-4 px-4 sm:px-8 bg-gradient-to-r from-blue-700 to-indigo-800 shadow-xl rounded-b-3xl relative z-20">

//       {/* This div acts as the top bar of the navigation.
//           It will be flex (row) to align logo and hamburger/desktop links. */}
//       <div className="flex justify-between items-center w-full">
//         {/* Logo Section */}
//         <div className="flex gap-2 items-center py-2">
//           <Link href="/">
//             <Image
//               alt="Company logo"
//               src="/assets/images/logo.png"
//               width={40}
//               height={40}
//               className="rounded-full object-contain shadow-md cursor-pointer"
//             />
//           </Link>
//           <p className="logo_text text-3xl font-extrabold text-white max-md:hidden tracking-tight">
//             JobBoard <span className="text-blue-300">Pro</span>
//           </p>
//         </div>

//         {/* Desktop Navigation Links (hidden on small screens, flex on medium and up) */}
//         <div className="hidden md:flex gap-6 items-center">
//           <Link href="/jobs" className="text-white text-lg font-semibold hover:text-blue-300">
//             Jobs
//           </Link>
//           <Link href="/post-job" className="text-white text-lg font-semibold hover:text-blue-300">
//             Post a Job
//           </Link>
//           <Link href="/about" className="text-white text-lg font-semibold hover:text-blue-300">
//             About Us
//           </Link>
//           <Link href="/contact" className="text-white text-lg font-semibold hover:text-blue-300">
//             Contact
//           </Link>
//           <div className="flex gap-4">
//             <Link href="/login" className="text-blue-300 font-semibold hover:underline">
//               Login
//             </Link>
//             <Link
//               href="/signup"
//               className="bg-blue-300 text-blue-800 px-4 py-2 rounded-full font-bold hover:bg-blue-400 inline-block"
//             >
//               Sign Up
//             </Link>
//           </div>
//         </div>

//         {/* Mobile Menu Button (visible only on small screens) */}
//         <button
//           className="md:hidden text-white focus:outline-none"
//           onClick={handleMenuToggle}
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
//             />
//           </svg>
//         </button>
//       </div> {/* End of the top bar div */}


//       {/* Mobile Navigation Links - This is the collapsible part */}
//       {/* It's now a direct child of the <nav> and will expand within the document flow. */}
//       <div
//         className={`md:hidden w-full bg-blue-800 shadow-lg rounded-b-xl transition-all duration-300 ease-in-out overflow-hidden
//           ${isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'}`}
//       >
//         <div className="flex flex-col gap-4 p-4">
//           <Link
//             href="/jobs"
//             className="text-white text-lg font-semibold hover:text-blue-300 self-start"
//             onClick={handleMenuToggle} // Close menu on link click
//           >
//             Jobs
//           </Link>
//           <Link
//             href="/post-job"
//             className="text-white text-lg font-semibold hover:text-blue-300 self-start"
//             onClick={handleMenuToggle} // Close menu on link click
//           >
//             Post a Job
//           </Link>
//           <Link
//             href="/about"
//             className="text-white text-lg font-semibold hover:text-blue-300 self-start"
//             onClick={handleMenuToggle} // Close menu on link click
//           >
//             About Us
//           </Link>
//           <Link
//             href="/contact"
//             className="text-white text-lg font-semibold hover:text-blue-300 self-start"
//             onClick={handleMenuToggle} // Close menu on link click
//           >
//             Contact
//           </Link>
//           <div className="flex flex-col gap-2">
//             <Link
//               href="/login"
//               className="text-blue-300 font-semibold hover:underline self-start"
//               onClick={handleMenuToggle} // Close menu on link click
//             >
//               Login
//             </Link>
//             <Link
//               href="/signup"
//               className="bg-blue-300 text-blue-800 px-4 py-2 rounded-full font-bold hover:bg-blue-400 inline-block self-start"
//               onClick={handleMenuToggle} // Close menu on link click
//             >
//               Sign Up
//             </Link>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Nav;
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
              <Link href="/post-job" className="text-gray-700 hover:text-blue-600">
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