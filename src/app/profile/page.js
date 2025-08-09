'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ProfilePage() {
  const router = useRouter();

  // State for user and profile data
  const [userData, setUserData] = useState(null); // Stores user details (name, email, role, company)
  const [profileData, setProfileData] = useState({ // Stores profile details (bio, phone_number, etc.)
    bio: '',
    phone_number: '',
    address: '',
    linkedin_url: '',
    github_url: '',
    profile_picture_url: '',
    resume_url: '',
    profileImageFile: null, // Holds the actual file object for profile image
    resumeFile: null, // Holds the actual file object for resume
  });

  // State for loading and error messages
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // State for file previews (local file URLs for images, or file names for resumes)
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [resumePreview, setResumePreview] = useState('');

  // --- Function to fetch User Profile Data ---
  // Moved outside useEffect so it can be called again after profile update
  const fetchUserProfile = async () => {
    setLoading(true);
    setError('');
    try {
      console.log("1. Attempting to fetch /api/users...");
      const res = await fetch('/api/users', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Debug': 'true'
        }
      });
      console.log("2. Response status:", res.status);

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch profile.');
      }

      const data = await res.json();
      setUserData(data.user);

      setProfileData(prev => ({
        ...prev,
        bio: data.profile?.bio || '',
        phone_number: data.profile?.phone_number || '',
        address: data.profile?.address || '',
        linkedin_url: data.profile?.linkedin_url || '',
        github_url: data.profile?.github_url || '',
        profile_picture_url: data.profile?.profile_picture_url || '',
        resume_url: data.profile?.resume_url || '',
      }));

      // Set initial previews for existing files from the database
      if (data.profile?.profile_picture_url) {
        setProfileImagePreview(data.profile.profile_picture_url);
      } else {
        setProfileImagePreview(''); // Ensure it's explicitly empty if no URL
      }
      if (data.profile?.resume_url) {
        setResumePreview(data.profile.resume_url);
      } else {
        setResumePreview(''); // Ensure it's explicitly empty if no URL
      }

    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Failed to load profile. Please try again.');
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  // --- Fetch Profile Data on Component Mount ---
  useEffect(() => {
    fetchUserProfile();
  }, [router, fetchUserProfile]); // router is a dependency, but fetchUserProfile itself is stable.

  // --- Handle Input Changes ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccessMessage('');
  };

  // --- Handle File Input Changes ---
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    setProfileData(prev => ({ ...prev, [`${name}File`]: file }));

    if (file) {
      if (name === 'profileImage') {
        // Create a temporary URL for immediate client-side preview
        setProfileImagePreview(URL.createObjectURL(file));
      } else if (name === 'resume') {
        setResumePreview(file.name); // Display file name for resume preview
      }
    } else {
      // If file input is cleared, reset preview to current DB URL or empty
      if (name === 'profileImage') {
        setProfileImagePreview(profileData.profile_picture_url || '');
      } else if (name === 'resume') {
        setResumePreview(profileData.resume_url || '');
      }
    }
    setError('');
    setSuccessMessage('');
  };

  // --- Handle Form Submission (Update Profile) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    const formData = new FormData();
    formData.append('bio', profileData.bio);
    formData.append('phone_number', profileData.phone_number);
    formData.append('address', profileData.address);
    formData.append('linkedin_url', profileData.linkedin_url);
    formData.append('github_url', profileData.github_url);

    if (profileData.profileImageFile) {
      formData.append('profileImage', profileData.profileImageFile);
    }
    if (profileData.resumeFile) {
      formData.append('resume', profileData.resumeFile);
    }

    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update profile.');
      }

      const data = await res.json();
      setSuccessMessage(data.message || 'Profile updated successfully!');

      // --- CRUCIAL FIX: Update Frontend State After Successful Upload ---
      // ASSUMPTION: Your backend's PUT /api/users response will include the new 'profile_picture_url'.
      // If it does, we update the state directly for immediate display.
      if (data.profile_picture_url) {
        setProfileData(prev => ({
          ...prev,
          profile_picture_url: data.profile_picture_url,
        }));
        // Also update the preview state to show the newly saved permanent image
        setProfileImagePreview(data.profile_picture_url);
      } else {
        // FALLBACK: If backend DOES NOT return the new URL, re-fetch all profile data.
        // This is less efficient but ensures data consistency.
        await fetchUserProfile();
      }

      // Clear the temporary file object from state after successful upload
      setProfileData(prev => ({ ...prev, profileImageFile: null, resumeFile: null }));

    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'An error occurred while updating profile.');
    } finally {
      setSubmitting(false);
    }
  };

  // --- Render Loading State ---
  if (loading) {
    return (
      <div className="flex-center min-h-screen">
        <p className="text-lg font-semibold text-gray-700">Loading profile...</p>
      </div>
    );
  }

  // --- Render Not Logged In State ---
  if (!userData) {
    return (
      <div className="flex-center min-h-screen flex-col">
        <p className="text-lg font-semibold text-red-500 mb-4">You must be logged in to view this page.</p>
        <button
          onClick={() => router.push('/login')}
          className="black_btn"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // --- Main Profile Form ---
  return (
    <div className="max-w-3xl mx-auto my-8 p-6 bg-black rounded-lg shadow-xl border border-gray-200">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">My Profile</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic User Info (Read-only from 'user' table) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1 p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-800">
              {userData.name}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-800">
              {userData.email}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <p className="mt-1 p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-800 capitalize">
              {userData.role?.replace('_', ' ')}
            </p>
          </div>
          {userData.company && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <p className="mt-1 p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-800">
                {userData.company}
              </p>
            </div>
          )}
        </div>

        <hr className="my-6 border-gray-200" />

        {/* Editable Profile Fields (from 'profiles' table) */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Profile Details</h2>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={profileData.bio}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Tell us about yourself..."
          ></textarea>
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            id="phone_number"
            name="phone_number"
            value={profileData.phone_number}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., +1234567890"
          />
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={profileData.address}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Your full address"
          />
        </div>

        {/* LinkedIn URL */}
        <div>
          <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700">
            LinkedIn URL
          </label>
          <input
            type="url"
            id="linkedin_url"
            name="linkedin_url"
            value={profileData.linkedin_url}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        {/* GitHub URL */}
        <div>
          <label htmlFor="github_url" className="block text-sm font-medium text-gray-700">
            GitHub URL
          </label>
          <input
            type="url"
            id="github_url"
            name="github_url"
            value={profileData.github_url}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="https://github.com/yourprofile"
          />
        </div>

        {/* Profile Image Upload */}
        <div>
          <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">
            Profile Image
          </label>
          <input
            type="file"
            id="profileImage"
            name="profileImage"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {/* --- CORRECTED IMAGE DISPLAY BLOCK --- */}
          {(profileImagePreview && profileImagePreview !== '') || (profileData.profile_picture_url && profileData.profile_picture_url !== '') ? (
            <div className="mt-2 flex items-center space-x-2">
              <Image
                src={profileImagePreview || profileData.profile_picture_url}
                alt="Profile Picture"
                width={80}
                height={80} // Height is required by Next.js Image component
                className="rounded-full object-cover"
              />
              <span className="text-sm text-gray-600">Current/New Image</span>
            </div>
          ) : (
            <div className="mt-2 flex items-center space-x-2">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                No Photo
              </div>
              <span className="text-sm text-gray-600">No profile image set</span>
            </div>
          )}
          {/* --- END OF CORRECTED IMAGE DISPLAY BLOCK --- */}
        </div>

        {/* Resume Upload */}
        <div>
          <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
            Resume (PDF, DOCX)
          </label>
          <input
            type="file"
            id="resume"
            name="resume"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {resumePreview && (
            <div className="mt-2 flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {resumePreview.startsWith('/uploads/') ? (
                  <a href={resumePreview} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    View Current Resume
                  </a>
                ) : (
                  `New Resume: ${resumePreview}`
                )}
              </span>
            </div>
          )}
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
        >
          {submitting ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}