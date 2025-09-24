import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// GET handler to fetch the user's profile and basic user data
export async function GET(req) {
  let connection;
  try {
    console.log("Starting GET request to /api/users...");

    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);

    if (!decoded) {
      console.log("Error: Unauthorized token for GET request.");
      return NextResponse.json({ message: 'Unauthorized: No valid token provided.' }, { status: 401 });
    }

    connection = await getConnection();

    // Fetch user data
    const [users] = await connection.execute(
      'SELECT id, name, email, role, company FROM user WHERE id = ?',
      [decoded.id]
    );

    const user = users[0];
    if (!user) {
      console.log("User not found for GET request.");
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    // Fetch profile data
    const [profiles] = await connection.execute(
      'SELECT * FROM profiles WHERE user_id = ?',
      [decoded.id]
    );

    const profile = profiles[0] || null;

    console.log("Successfully fetched user and profile data.");
    return NextResponse.json({
      user,
      profile,
    }, { status: 200 });

  } catch (error) {
    console.error('API Users GET Route Error:', error);
    return NextResponse.json({ message: 'Internal server error.', details: error.message }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// POST handler to create or update the user's profile
export async function POST(req) {
  let connection;
  try {
    console.log("Starting POST request to /api/users...");

    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);

    if (!decoded) {
      console.log("Error: Unauthorized token.");
      return NextResponse.json({ message: 'Unauthorized: No valid token provided.' }, { status: 401 });
    }
    
    const formData = await req.formData();
    console.log("Form data received. Processing fields...");
    
    // Extract non-file fields
    const bio = formData.get('bio');
    const phone_number = formData.get('phone_number');
    const address = formData.get('address');
    const linkedin_url = formData.get('linkedin_url');
    const github_url = formData.get('github_url');

    // Get file objects from form data
    const profileImageFile = formData.get('profileImage');
    const resumeFile = formData.get('resume');
    
    // Get the existing URLs passed from the client
    const currentProfileImageUrl = formData.get('currentProfileImageUrl');
    const currentResumeUrl = formData.get('currentResumeUrl');

    console.log(`Current Profile URL: ${currentProfileImageUrl}`);
    console.log(`Current Resume URL: ${currentResumeUrl}`);
    console.log(`Profile Image File Received: ${profileImageFile ? profileImageFile.name : 'No file'}`);
    console.log(`Resume File Received: ${resumeFile ? resumeFile.name : 'No file'}`);

    // Default to the existing URLs in case no new file is uploaded
    let profile_picture_url = currentProfileImageUrl;
    let resume_url = currentResumeUrl;

    // Use Vercel Blob for profile image if a new file is provided
    if (profileImageFile && profileImageFile.size > 0) {
      console.log(`Uploading new profile image: ${profileImageFile.name}`);
      const blob = await put(profileImageFile.name, profileImageFile, {
        access: 'public',
        addRandomSuffix: true,
      });
      profile_picture_url = blob.url;
      console.log(`Uploaded new profile image to Vercel Blob: ${profile_picture_url}`);
    }

    // Use Vercel Blob for resume if a new file is provided
    if (resumeFile && resumeFile.size > 0) {
      console.log(`Uploading new resume: ${resumeFile.name}`);
      const blob = await put(resumeFile.name, resumeFile, {
        access: 'public',
        addRandomSuffix: true,
      });
      resume_url = blob.url;
      console.log(`Uploaded new resume to Vercel Blob: ${resume_url}`);
    }

    // Now, connect to the database to perform the update
    connection = await getConnection();
    
    const [existingProfiles] = await connection.execute(
      'SELECT profile_id FROM profiles WHERE user_id = ?',
      [decoded.id]
    );

    if (existingProfiles.length > 0) {
      console.log("Profile exists, performing UPDATE.");
      await connection.execute(
        `UPDATE profiles SET
           bio = COALESCE(?, bio),
           phone_number = COALESCE(?, phone_number),
           address = COALESCE(?, address),
           linkedin_url = COALESCE(?, linkedin_url),
           github_url = COALESCE(?, github_url),
           profile_picture_url = ?,
           resume_url = ?,
           updated_at = NOW()
         WHERE user_id = ?`,
        [
          bio, phone_number, address, linkedin_url, github_url,
          profile_picture_url, resume_url,
          decoded.id
        ]
      );
    } else {
      console.log("Profile does not exist, performing INSERT.");
      await connection.execute(
        `INSERT INTO profiles (user_id, bio, phone_number, address, linkedin_url, github_url, profile_picture_url, resume_url, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          decoded.id, bio, phone_number, address, linkedin_url, github_url,
          profile_picture_url, resume_url
        ]
      );
    }

    console.log("Database operation successful. Returning response.");
    return NextResponse.json({
      message: 'Profile updated successfully!',
      profile_picture_url: profile_picture_url,
      resume_url: resume_url
    }, { status: 200 });

  } catch (error) {
    console.error('API Users POST Route Error:', error);
    return NextResponse.json({ message: 'Internal server error.', details: error.message }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
