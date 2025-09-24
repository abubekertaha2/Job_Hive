import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getConnection } from '@/lib/db';

export async function GET(req) {
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });

  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute('SELECT id, name, email, role, company FROM user WHERE id = ?', [decoded.id]);
    const user = rows[0];
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    return NextResponse.json({ user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
