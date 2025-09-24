// import { NextResponse } from 'next/server';
// import { getConnection } from '@/lib/db';
// import { verifyToken, getAuthHeader } from '@/lib/auth';

// export async function GET(req) {
//     let connection;

//     try {
//         const token = getAuthHeader(req);
//         const user = verifyToken(token);
        
//         // This check is crucial for security
//         if (!user || user.role !== 'employer') {
//             return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//         }
        
//         // Get the userId from the verified token
//         const userId = user.userId;

//         connection = await getConnection();
        
//         // --- THE KEY FIX IS HERE ---
//         // Modify the query to select only jobs posted by this user
//         const [jobs] = await connection.execute(
//             'SELECT * FROM job WHERE userId = ?',
//             [userId]
//         );
//         // --- END OF FIX ---

//         if (jobs.length === 0) {
//             return NextResponse.json({ message: "No jobs found for this user" }, { status: 404 });
//         }

//         return NextResponse.json({ jobs }, { status: 200 });

//     } catch (error) {
//         console.error("Failed to fetch jobs:", error);
//         return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
//     } finally {
//         if (connection) {
//             connection.release();
//         }
//     }
// }

// import { NextResponse } from 'next/server';
// import { getConnection } from '@/lib/db';
// import { verifyToken, getAuthHeader } from '@/lib/auth';

// export async function GET(req) {
//     let connection;

//     try {
//         console.log("Incoming GET request to /api/employer");

//         // Get the token from the Authorization header
//         const token = getAuthHeader(req);
//         console.log("Authorization Header Token:", token);
//         if (!token) {
//             console.error("Error: Authorization header not found");

//             return NextResponse.json({ message: "Authorization header not found" }, { status: 401 });
//         }
        
//         const user = verifyToken(token);
//         console.log("Decoded User from Token:", user);       
//         // This check is crucial for security
//         if (!user || user.role !== 'employer') {
//             console.error("Error: Unauthorized access attempt");
//             return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//         }
        
//         // Get the userId from the verified token
//         const userId = user.id;
        
//         // --- THIS IS THE DEBUGGING LOG ---
//         console.log("Fetching jobs for userId:", userId);

//         try {
//             connection = await getConnection();
//             console.log("Database connection established successfully.");
//         } catch (dbError) {
//             console.error("Database connection failed:", dbError);
//             return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
//         }

//         // The key fix is here
//         const [jobs] = await connection.execute(
//             'SELECT * FROM job WHERE userId = ?',
//             [userId]
//         );

//         if (jobs.length === 0) {
//             console.log("No jobs found for userId:", userId);
//             return NextResponse.json({ jobs: [] }, { status: 200 });
//         }

//         return NextResponse.json({ jobs }, { status: 200 });

//     } catch (error) {
//         console.error("Failed to fetch jobs:", error);
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     } finally {
//         if (connection) {
//             connection.release();
//         }
//     }
// }

import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
  let connection;

  try {
    
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || user.role !== "employer") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    connection = await getConnection();
    const [jobs] = await connection.execute(
      "SELECT * FROM job WHERE userId = ?",
      [userId]
    );

    return NextResponse.json({ jobs }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
