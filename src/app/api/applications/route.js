import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db'; // Import the direct mysql2 connection helper
import { verifyToken } from '@/lib/auth'; // Authentication helper (JWT verification)

// POST handler to submit a new job application
export async function POST(request) {
  let connection;
  try {
    const token = request.cookies.get('token')?.value;
    const decoded = verifyToken(token); // Verify the JWT token

    if (!decoded) {
      return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
    }

    // Only job seekers can submit applications
    if (decoded.role !== "job_seeker") {
      return NextResponse.json({ message: 'Only job seekers can submit applications.' }, { status: 403 });
    }

    const { jobId } = await request.json(); // Expecting jobId from the frontend

    if (!jobId) {
      return NextResponse.json({ message: 'Job ID is required to submit an application.' }, { status: 400 });
    }

    connection = await getConnection(); // Get a database connection

    // Check if the job exists
    const [jobs] = await connection.execute(
      'SELECT id FROM job WHERE id = ?',
      [jobId]
    );
    if (jobs.length === 0) {
      return NextResponse.json({ message: 'Job not found.' }, { status: 404 });
    }

    // Check if the user has already applied for this job
    const [existingApplication] = await connection.execute(
      'SELECT id FROM applications WHERE user_id = ? AND job_id = ?',
      [decoded.id, jobId]
    );
    if (existingApplication.length > 0) {
      return NextResponse.json({ message: 'You have already applied for this job.' }, { status: 409 }); // 409 Conflict
    }

    // Insert the new application into the 'applications' table
    const [result] = await connection.execute(
      `INSERT INTO applications (user_id, job_id, status, application_date)
       VALUES (?, ?, ?, NOW())`,
      [decoded.id, jobId, 'Pending'] // Default status to 'Pending'
    );

    return NextResponse.json({
      message: 'Application submitted successfully!',
      applicationId: result.insertId
    }, { status: 201 }); // 201 Created

  } catch (error) {
    console.error('Job application submission error:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// GET handler to fetch applications (e.g., for a specific user or for an employer's jobs)
export async function GET(request) {
  let connection;
  try {
    const token = request.cookies.get('token')?.value;
    const decoded = verifyToken(token); // Verify the JWT token

    if (!decoded) {
      return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
    }

    connection = await getConnection(); // Get a database connection

    let applications;
    // If the user is a job seeker, fetch their own applications
    if (decoded.role === 'job_seeker') {
      const [rows] = await connection.execute(
        `SELECT
           a.id, a.status, a.application_date,
           j.title as jobTitle, j.company as jobCompany, j.location as jobLocation,
           u.name as employerName
         FROM applications a
         JOIN job j ON a.job_id = j.id
         JOIN user u ON j.userId = u.id
         WHERE a.user_id = ?
         ORDER BY a.application_date DESC`,
        [decoded.id]
      );
      applications = rows;
    }
    // If the user is an employer, fetch applications for their posted jobs
    else if (decoded.role === 'employer') {
      const [rows] = await connection.execute(
        `SELECT
           a.id, a.status, a.application_date,
           j.title as jobTitle, j.company as jobCompany, j.location as jobLocation,
           u.name as applicantName, u.email as applicantEmail,
           p.phone_number as applicantPhone, p.resume_url as applicantResumeUrl,
           p.linkedin_url as applicantLinkedinUrl, p.github_url as applicantGithubUrl
         FROM applications a
         JOIN job j ON a.job_id = j.id
         JOIN user u ON a.user_id = u.id
         LEFT JOIN profiles p ON u.id = p.user_id -- LEFT JOIN as profile might not exist
         WHERE j.userId = ? -- Filter by the employer's user ID
         ORDER BY a.application_date DESC`,
        [decoded.id]
      );
      applications = rows;
    } else {
      // Handle other roles or no specific role access
      return NextResponse.json({ message: 'Access denied for this role.' }, { status: 403 });
    }

    return NextResponse.json({ applications: applications }, { status: 200 });

  } catch (error) {
    console.error('Applications fetch error:', error);
    return NextResponse.json({ message: 'Failed to fetch applications.' }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// adding also add PUT (update application status) and DELETE methods here if needed
// Example PUT to update application status (e.g., by employer)
/*
export async function PUT(request) {
  let connection;
  try {
    const token = request.cookies.get('token')?.value;
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'employer') {
      return NextResponse.json({ message: 'Unauthorized: Employer access required.' }, { status: 401 });
    }

    const { applicationId, newStatus } = await request.json();

    if (!applicationId || !newStatus) {
      return NextResponse.json({ message: 'Application ID and new status are required.' }, { status: 400 });
    }

    connection = await getConnection();

    // Verify the application belongs to a job posted by this employer
    const [applicationCheck] = await connection.execute(
      `SELECT a.id FROM applications a
       JOIN job j ON a.job_id = j.id
       WHERE a.id = ? AND j.userId = ?`,
      [applicationId, decoded.id]
    );

    if (applicationCheck.length === 0) {
      return NextResponse.json({ message: 'Application not found or you do not have permission to update it.' }, { status: 404 });
    }

    await connection.execute(
      `UPDATE applications SET status = ?, application_date = NOW() WHERE id = ?`,
      [newStatus, applicationId]
    );

    return NextResponse.json({ message: 'Application status updated successfully!' }, { status: 200 });

  } catch (error) {
    console.error('Application status update error:', error);
    return NextResponse.json({ message: 'Failed to update application status.' }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
*/