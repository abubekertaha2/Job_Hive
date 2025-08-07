import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getConnection } from '@/lib/db'; // Import getConnection from your db.js

const JWT_SECRET = process.env.JWT_SECRET ;

export async function POST(req) {
  let connection; // Declare connection variable for use in finally block
  try {
    // Destructure fields from the request body, matching your 'user' table and frontend
    const { name, email, password, action, role = 'job_seeker', company = null } = await req.json();

    // Basic validation for required fields
    if (!email || !password || (action === 'signup' && !name)) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    // Specific validation for 'employer' role during signup
    if (action === 'signup' && role === 'employer' && !company) {
        return NextResponse.json({ message: 'Company name is required for employers.' }, { status: 400 });
    }

    // Password length validation for signup
    if (action === 'signup' && password.length < 8) {
        return NextResponse.json({ message: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    connection = await getConnection(); // Get a connection from the pool

    // Handle 'signup' action
    if (action === 'signup') {
      // Check if a user with the given email already exists in the 'user' table
      const [existingUsers] = await connection.execute(
        'SELECT id FROM user WHERE email = ?',
        [email]
      );

      if (existingUsers.length > 0) {
        return NextResponse.json({ message: 'Email already registered.' }, { status: 409 }); // 409 Conflict
      }

      // Hash the user's password for security
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert a new user record into the 'user' table, including 'role' and 'company'
      const [result] = await connection.execute(
        `INSERT INTO user (name, email, password, role, company, created_at) VALUES (?, ?, ?, ?, ?, NOW())`,
        [name, email, hashedPassword, role, company]
      );

      const newUserId = result.insertId;

      // Generate a JWT token for the newly registered user
      const token = jwt.sign({ id: newUserId, email: email, role: role }, JWT_SECRET, { expiresIn: '7d' });

      // Prepare success response for signup
      const response = NextResponse.json(
        {
          message: 'User registered successfully!',
          user: { id: newUserId, email: email, name: name, role: role, company: company }
        },
        { status: 201 } // 201 Created
      );

      // Set the JWT token as an HttpOnly cookie for security
      response.cookies.set('token', token, {
        httpOnly: true,
        secure: false, // <--- CHANGE THIS LINE TO FALSE FOR LOCAL HTTP TESTING
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      });

      return response;

    }
    // Handle 'login' action
    else if (action === 'login') {
      // Find the user in the 'user' table by their email
      const [users] = await connection.execute(
        'SELECT id, name, email, password, role, company FROM user WHERE email = ?',
        [email]
      );

      const user = users[0];
      if (!user) {
        return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 }); // 401 Unauthorized
      }

      // Compare the provided password with the hashed password from the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
      }

      // Generate a JWT token for the authenticated user
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

      // Prepare success response for login
      const response = NextResponse.json(
        {
          message: 'Login successful!',
          user: { id: user.id, email: user.email, name: user.name, role: user.role, company: user.company }
        },
        { status: 200 } // 200 OK
      );

      // Set the JWT token as an HttpOnly cookie
      response.cookies.set('token', token, {
        httpOnly: true,
        secure: false, // <--- CHANGE THIS LINE TO FALSE FOR LOCAL HTTP TESTING
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });

      return response;

    }
    // If the 'action' field is neither 'signup' nor 'login'
    else {
      return NextResponse.json({ message: 'Invalid action specified.' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error in auth route:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  } finally {
    // IMPORTANT: Release the connection back to the pool in the finally block
    if (connection) {
      connection.release();
    }
  }
}