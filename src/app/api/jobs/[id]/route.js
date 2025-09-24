// src/app/api/jobs/[id]/route.js
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db'; // Assuming you have this helper
import { verifyToken } from '@/lib/auth'; 

export async function GET(request, {params}) {
  let connection;
  try {
    // if (!decoded) {
    //   return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    // }

    const jobId = params.id; 

    if (!jobId) {
      return NextResponse.json({ message: 'Job ID is required.' }, { status: 400 });
    }

    connection = await getConnection();

    
    const [jobs] = await connection.execute(
      `SELECT
         j.id, j.title, j.description, j.company, j.location, j.salary, j.type, j.created_at,
         u.name as employerName, u.company as employerCompany
       FROM job j
       JOIN user u ON j.userId = u.id
       WHERE j.id = ?`,
      [jobId]
    );

    const job = jobs[0]; 

    if (!job) {
      return NextResponse.json({ message: 'Job not found.' }, { status: 404 });
    }
    return NextResponse.json({ job: job }, { status: 200 });

  } catch (error) {
    console.error('API Jobs GET by ID Route Error:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}