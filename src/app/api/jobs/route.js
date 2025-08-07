// import { NextResponse } from 'next/server';
// import { getConnection } from '@/lib/db';
// import { verifyToken } from '@/lib/auth';

// export async function GET(request) {
//   let connection;
//   try {
//     connection = await getConnection();

//     const { searchParams } = new URL(request.url);
//     const search = searchParams.get("search");
//     const location = searchParams.get("location");
//     const type = searchParams.get("type");
//     const page = Number.parseInt(searchParams.get("page")) || 1;
//     const limit = Number.parseInt(searchParams.get("limit")) || 10;
//     const offset = (page - 1) * limit;

//     let whereClauses = [];
//     let queryParams = [];

//     if (search) {
//       whereClauses.push("(j.title LIKE ? OR j.description LIKE ?)");
//       queryParams.push(`%${search}%`, `%${search}%`);
//     }
//     if (location) {
//       whereClauses.push("j.location LIKE ?");
//       queryParams.push(`%${location}%`);
//     }
//     if (type) {
//       whereClauses.push("j.type = ?");
//       queryParams.push(type);
//     }

//     const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

//     const [countRows] = await connection.execute(
//       `SELECT COUNT(*) as count FROM job j ${whereSql}`,
//       queryParams
//     );
//     const totalCount = countRows[0].count;
//     const totalPages = Math.ceil(totalCount / limit);

//     const [jobs] = await connection.execute(
//       `SELECT
//          j.id, j.title, j.description, j.company, j.location, j.salary, j.type, j.created_at,
//          u.name as employerName, u.company as employerCompany
//        FROM job j
//        JOIN user u ON j.userId = u.id
//        ${whereSql}
//        ORDER BY j.created_at DESC
//        LIMIT ? OFFSET ?`,
//       [...queryParams, limit, offset] // Ensure queryParams are correctly spread with limit and offset
//     );

//     return NextResponse.json({
//       jobs: jobs,
//       totalCount: totalCount,
//       totalPages: totalPages,
//       currentPage: page,
//     }, { status: 200 });

//   } catch (error) {
//     console.error("Jobs fetch error:", error);
//     return NextResponse.json({ message: "Failed to fetch jobs" }, { status: 500 });
//   } finally {
//     if (connection) {
//       connection.release();
//     }
//   }
// }

// export async function POST(request) {
//   let connection;
//   try {
//     const token = request.cookies.get('token')?.value;
//     const decoded = verifyToken(token);

//     if (!decoded) {
//       return NextResponse.json({ message: "Authentication required." }, { status: 401 });
//     }

//     if (decoded.role !== "employer") {
//       return NextResponse.json({ message: "Employer access required." }, { status: 403 });
//     }

//     const { title, description, company, location, salary, type } = await request.json();

//     if (!title || !description || !company || !location || !type) {
//       return NextResponse.json({ message: "Missing required job fields." }, { status: 400 });
//     }

//     connection = await getConnection();

//     const [result] = await connection.execute(
//       `INSERT INTO job (title, description, company, location, salary, type, userId, created_at)
//        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
//       [title, description, company, location, salary || null, type, decoded.id]
//     );

//     const newJobId = result.insertId;

//     const [newJob] = await connection.execute(
//       'SELECT id, title, description, company, location, salary, type, userId, created_at FROM job WHERE id = ?',
//       [newJobId]
//     );

//     return NextResponse.json({
//       message: "Job posted successfully!",
//       job: newJob[0]
//     }, { status: 201 });

//   } catch (error) {
//     console.error("Job creation error:", error);
//     return NextResponse.json({ message: "Failed to create job." }, { status: 500 });
//   } finally {
//     if (connection) {
//       connection.release();
//     }
//   }
// }
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  let connection;
  try {
    connection = await getConnection();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const location = searchParams.get("location");
    const type = searchParams.get("type");
    const page = Number.parseInt(searchParams.get("page")) || 1;
    const limit = Number.parseInt(searchParams.get("limit")) || 10;
    const offset = (page - 1) * limit;

    const whereClauses = [];
    const queryParams = [];

    if (search) {
      whereClauses.push("(j.title LIKE ? OR j.description LIKE ?)");
      queryParams.push(`%${search}%`, `%${search}%`);
    }
    if (location) {
      whereClauses.push("j.location LIKE ?");
      queryParams.push(`%${location}%`);
    }
    if (type) {
      whereClauses.push("j.type = ?");
      queryParams.push(type);
    }

    const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const [countRows] = await connection.query(
      `SELECT COUNT(*) as count FROM job j ${whereSql}`,
      queryParams
    );
    const totalCount = countRows[0].count;
    const totalPages = Math.ceil(totalCount / limit);

    const [jobs] = await connection.query(
      `SELECT
         j.id, j.title, j.description, j.company, j.location, j.salary, j.type, j.created_at,
         u.name as employerName, u.company as employerCompany
       FROM job j
       JOIN user u ON j.userId = u.id
       ${whereSql}
       ORDER BY j.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    return NextResponse.json({
      jobs,
      totalCount,
      totalPages,
      currentPage: page,
    }, { status: 200 });

  } catch (error) {
    console.error("Jobs fetch error:", error);
    return NextResponse.json({ message: "Failed to fetch jobs" }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

export async function POST(request) {
  let connection;
  try {
    const token = request.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ message: "Authentication required." }, { status: 401 });
    if (decoded.role !== "employer") return NextResponse.json({ message: "Employer access required." }, { status: 403 });

    const { title, description, company, location, salary, type } = await request.json();
    if (!title || !description || !company || !location || !type) {
      return NextResponse.json({ message: "Missing required job fields." }, { status: 400 });
    }

    connection = await getConnection();
    const [result] = await connection.execute(
      `INSERT INTO job (title, description, company, location, salary, type, userId, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [title, description, company, location, salary || null, type, decoded.id]
    );
    const newJobId = result.insertId;

    const [newJobRows] = await connection.execute(
      `SELECT id, title, description, company, location, salary, type, userId, created_at
       FROM job WHERE id = ?`,
      [newJobId]
    );

    return NextResponse.json({
      message: "Job posted successfully!",
      job: newJobRows[0],
    }, { status: 201 });

  } catch (error) {
    console.error("Job creation error:", error);
    return NextResponse.json({ message: "Failed to create job." }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
