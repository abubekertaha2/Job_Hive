// import mysql from 'mysql2/promise';

// const pool = mysql.createPool(process.env.DATABASE_URL);

// export async function getConnection() {
//   return pool.getConnection();
// }

// async function testDbConnection() {
//   try {
//     const connection = await pool.getConnection();
//     await connection.ping();
//     console.log('Database connection pool established and tested successfully.');
//     connection.release();
//   } catch (error) {
//     console.error('Failed to establish database connection pool:', error);
//     process.exit(1);
//   }
// }

// testDbConnection();
import mysql from 'mysql2/promise';

console.log('Attempting to connect with:', process.env.DATABASE_URL);

const pool = mysql.createPool(process.env.DATABASE_URL);
// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0

// })

export async function getConnection() {
  return pool.getConnection();
}
