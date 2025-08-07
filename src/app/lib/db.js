import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function getConnection() {
  return pool.getConnection();
}

async function testDbConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    console.log('Database connection pool established and tested successfully.');
    connection.release();
  } catch (error) {
    console.error('Failed to establish database connection pool:', error);
    process.exit(1);
  }
}

testDbConnection();


// import mysql from 'mysql2/promise';

// export async function createConnection() {
//   const connection = await mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     timezone: 'Z', // UTC timestamps
//     charset: 'utf8mb4',
//     namedPlaceholders: true, // Enable :param syntax
//     decimalNumbers: true // Return decimals as numbers
//   });

//   // Verify connection immediately
//   try {
//     await connection.ping();
//     console.log('✅ New DB connection established');
//     return connection;
//   } catch (error) {
//     console.error('❌ DB connection failed:', error.message);
//     await connection.end(); // Cleanup
//     throw new Error('DB_CONNECTION_FAILED');
//   }
// }

// // Health check utility
// export async function testConnection() {
//   let conn;
//   try {
//     conn = await createConnection();
//     return true;
//   } catch (error) {
//     console.error('Connection test failed:', error);
//     return false;
//   } finally {
//     if (conn) await conn.end();
//   }
// }

// // Optional: Run test on startup
// testConnection().catch(() => process.exit(1));