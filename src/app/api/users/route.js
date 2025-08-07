// import { NextResponse } from 'next/server';
// import { getConnection } from '@/lib/db'; // Import getConnection from your db.js
// import { verifyToken } from '@/lib/auth'; // Authentication helper (JWT verification)
// import { writeFile ,mkdir} from 'fs/promises'; // For file system operations (saving uploads)
// import path from 'path'; // For path manipulation

// // GET handler to fetch user profile
// export async function GET(req) {
//   let connection;
//   try {
//     const token = req.cookies.get('token')?.value;
//     const decoded = verifyToken(token); // Verify the JWT token

//     if (!decoded) {
//       // If no valid token, return unauthorized
//       return NextResponse.json({ message: 'Unauthorized: No valid token provided.' }, { status: 401 });
//     }

//     connection = await getConnection(); // Get a database connection from the pool

//     // Fetch user details from the 'user' table, matching your schema
//     const [users] = await connection.execute(
//       'SELECT id, name, email, role, company, created_at, updated_at FROM user WHERE id = ?',
//       [decoded.id]
//     );

//     const user = users[0];
//     if (!user) {
//       return NextResponse.json({ message: 'User not found.' }, { status: 404 });
//     }

//     // Fetch profile details from the 'profiles' table for the user, matching your schema
//     const [profiles] = await connection.execute(
//       'SELECT profile_id, user_id, bio, phone_number, address, linkedin_url, github_url, profile_picture_url, resume_url, created_at, updated_at FROM profiles WHERE user_id = ?',
//       [decoded.id]
//     );

//     const profile = profiles[0] || null; // Will be null if no profile exists

//     // Return user data along with their profile
//     return NextResponse.json({
//       user: {
//         id: user.id,
//         name: user.name, // Matches 'name' column in 'user' table
//         email: user.email,
//         role: user.role,
//         company: user.company,
//         created_at: user.created_at,
//         updated_at: user.updated_at,
//       },
//       profile: profile, // Profile data will be null if no profile exists
//     }, { status: 200 });

//   } catch (error) {
//     console.error('API Users GET Route Error:', error);
//     return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
//   } finally {
//     if (connection) {
//       connection.release(); // Release the connection back to the pool
//     }
//   }
// }

// // PUT handler to update user profile
// export async function PUT(req) {
//   let connection;
//   try {
//     const token = req.cookies.get('token')?.value;
//     const decoded = verifyToken(token); // Verify the JWT token

//     if (!decoded) {
//       return NextResponse.json({ message: 'Unauthorized: No valid token provided.' }, { status: 401 });
//     }

//     const formData = await req.formData(); // Get data from FormData (for file uploads)

//     // Extract text fields from formData, matching 'profiles' table columns
//     const bio = formData.get('bio');
//     const phone_number = formData.get('phone_number');
//     const address = formData.get('address'); // Matches 'address' column
//     const linkedin_url = formData.get('linkedin_url');
//     const github_url = formData.get('github_url');

//     const profileImage = formData.get('profileImage'); // Get file for profile picture
//     const resumeFile = formData.get('resume');         // Get file for resume

//     // Define upload directory path: public/uploads
//     const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
//     // Ensure the uploads directory exists, create it if not
//     //await require('fs/promises').mkdir(uploadsDir, { recursive: true });
//     await mkdir(uploadsDir, { recursive: true });

//     let profile_picture_url = null;
//     if (profileImage && profileImage.size > 0) {
//       const imageFileName = `${Date.now()}-${profileImage.name}`;
//       const imagePath = path.join(uploadsDir, imageFileName);
//       const buffer = Buffer.from(await profileImage.arrayBuffer());
//       await writeFile(imagePath, buffer);
//       profile_picture_url = `/uploads/${imageFileName}`; // Store public URL
//     }

//     let resume_url = null;
//     if (resumeFile && resumeFile.size > 0) {
//       const resumeFileName = `${Date.now()}-${resumeFile.name}`;
//       const resumePath = path.join(uploadsDir, resumeFileName);
//       const buffer = Buffer.from(await resumeFile.arrayBuffer());
//       await writeFile(resumePath, buffer);
//       resume_url = `/uploads/${resumeFileName}`; // Store public URL
//     }

//     connection = await getConnection(); // Get a database connection from the pool

//     // Check if a profile already exists for this user_id in the 'profiles' table
//     const [existingProfiles] = await connection.execute(
//       'SELECT profile_id FROM profiles WHERE user_id = ?', // Use 'profiles' table
//       [decoded.id]
//     );

//     if (existingProfiles.length > 0) {
//       // If profile exists, update it in the 'profiles' table
//       await connection.execute(
//         `UPDATE profiles SET
//            bio = COALESCE(?, bio),
//            phone_number = COALESCE(?, phone_number),
//            address = COALESCE(?, address),
//            linkedin_url = COALESCE(?, linkedin_url),
//            github_url = COALESCE(?, github_url),
//            profile_picture_url = COALESCE(?, profile_picture_url),
//            resume_url = COALESCE(?, resume_url),
//            updated_at = NOW()
//          WHERE user_id = ?`,
//         [
//           bio, phone_number, address, linkedin_url, github_url,
//           profile_picture_url, resume_url,
//           decoded.id
//         ]
//       );
//     } else {
//       // If no profile exists, insert a new one into the 'profiles' table
//       await connection.execute(
//         `INSERT INTO profiles (user_id, bio, phone_number, address, linkedin_url, github_url, profile_picture_url, resume_url, created_at, updated_at)
//          VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
//         [
//           decoded.id, bio, phone_number, address, linkedin_url, github_url,
//           profile_picture_url, resume_url
//         ]
//       );
//     }

//     return NextResponse.json({ message: 'Profile updated successfully!' }, { status: 200 });

//   } catch (error) {
//     console.error('API Users PUT Route Error:', error);
//     return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
//   } finally {
//     if (connection) {
//       connection.release(); // Release the connection back to the pool
//     }
//   }
// }


import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db'; // Import getConnection from your db.js
import { verifyToken } from '@/lib/auth'; // Authentication helper (JWT verification)
import { writeFile ,mkdir} from 'fs/promises'; // For file system operations (saving uploads)
import path from 'path'; // For path manipulation

// GET handler to fetch user profile
export async function GET(req) {
  let connection;
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token); // Verify the JWT token

    if (!decoded) {
      // If no valid token, return unauthorized
      return NextResponse.json({ message: 'Unauthorized: No valid token provided.' }, { status: 401 });
    }

    connection = await getConnection(); // Get a database connection from the pool

    // Fetch user details from the 'user' table, matching your schema
    const [users] = await connection.execute(
      'SELECT id, name, email, role, company, created_at, updated_at FROM user WHERE id = ?',
      [decoded.id]
    );

    const user = users[0];
    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    // Fetch profile details from the 'profiles' table for the user, matching your schema
    const [profiles] = await connection.execute(
      'SELECT profile_id, user_id, bio, phone_number, address, linkedin_url, github_url, profile_picture_url, resume_url, created_at, updated_at FROM profiles WHERE user_id = ?',
      [decoded.id]
    );

    const profile = profiles[0] || null; // Will be null if no profile exists

    // Return user data along with their profile
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name, // Matches 'name' column in 'user' table
        email: user.email,
        role: user.role,
        company: user.company,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      profile: profile, // Profile data will be null if no profile exists
    }, { status: 200 });

  } catch (error) {
    console.error('API Users GET Route Error:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  } finally {
    if (connection) {
      connection.release(); // Release the connection back to the pool
    }
  }
}

// PUT handler to update user profile
export async function PUT(req) {
  let connection;
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token); // Verify the JWT token

    if (!decoded) {
      return NextResponse.json({ message: 'Unauthorized: No valid token provided.' }, { status: 401 });
    }

    const formData = await req.formData(); // Get data from FormData (for file uploads)

    // Extract text fields from formData, matching 'profiles' table columns
    const bio = formData.get('bio');
    const phone_number = formData.get('phone_number');
    const address = formData.get('address'); // Matches 'address' column
    const linkedin_url = formData.get('linkedin_url');
    const github_url = formData.get('github_url');

    const profileImage = formData.get('profileImage'); // Get file for profile picture
    const resumeFile = formData.get('resume');         // Get file for resume

    // Define upload directory path: public/uploads
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    // Ensure the uploads directory exists, create it if not
    await mkdir(uploadsDir, { recursive: true });

    let profile_picture_url = null;
    if (profileImage && profileImage.size > 0) {
      const imageFileName = `${Date.now()}-${profileImage.name}`;
      const imagePath = path.join(uploadsDir, imageFileName);
      const buffer = Buffer.from(await profileImage.arrayBuffer());
      await writeFile(imagePath, buffer);
      profile_picture_url = `/uploads/${imageFileName}`; // Store public URL
    }

    let resume_url = null;
    if (resumeFile && resumeFile.size > 0) {
      const resumeFileName = `${Date.now()}-${resumeFile.name}`;
      const resumePath = path.join(uploadsDir, resumeFileName);
      const buffer = Buffer.from(await resumeFile.arrayBuffer());
      await writeFile(resumePath, buffer);
      resume_url = `/uploads/${resumeFileName}`; // Store public URL
    }

    connection = await getConnection(); // Get a database connection from the pool

    // Check if a profile already exists for this user_id in the 'profiles' table
    const [existingProfiles] = await connection.execute(
      'SELECT profile_id FROM profiles WHERE user_id = ?', // Use 'profiles' table
      [decoded.id]
    );

    if (existingProfiles.length > 0) {
      // If profile exists, update it in the 'profiles' table
      await connection.execute(
        `UPDATE profiles SET
           bio = COALESCE(?, bio),
           phone_number = COALESCE(?, phone_number),
           address = COALESCE(?, address),
           linkedin_url = COALESCE(?, linkedin_url),
           github_url = COALESCE(?, github_url),
           profile_picture_url = COALESCE(?, profile_picture_url),
           resume_url = COALESCE(?, resume_url),
           updated_at = NOW()
         WHERE user_id = ?`,
        [
          bio, phone_number, address, linkedin_url, github_url,
          profile_picture_url, resume_url,
          decoded.id
        ]
      );
    } else {
      // If no profile exists, insert a new one into the 'profiles' table
      await connection.execute(
        `INSERT INTO profiles (user_id, bio, phone_number, address, linkedin_url, github_url, profile_picture_url, resume_url, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          decoded.id, bio, phone_number, address, linkedin_url, github_url,
          profile_picture_url, resume_url
        ]
      );
    }

    // --- IMPORTANT: Return the new profile_picture_url in the response ---
    // This allows your frontend to update the image preview immediately without re-fetching
    return NextResponse.json({
      message: 'Profile updated successfully!',
      profile_picture_url: profile_picture_url // Send the new URL back
    }, { status: 200 });

  } catch (error) {
    console.error('API Users PUT Route Error:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  } finally {
    if (connection) {
      connection.release(); // Release the connection back to the pool
    }
  }
}