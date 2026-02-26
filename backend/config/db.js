import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// 🚂 Railway MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false  // ⚠️ Required for Railway MySQL external connection
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize tables on startup
const initDB = async () => {
  const conn = await pool.getConnection();
  try {
    // Users table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Watchlist table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS watchlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        movie_id INT NOT NULL,
        movie_title VARCHAR(255),
        poster_path VARCHAR(255),
        release_date VARCHAR(20),
        vote_average DECIMAL(3,1),
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_watchlist (user_id, movie_id)
      )
    `);

    console.log('✅ Railway MySQL connected & tables ready!');
  } catch (err) {
    console.error('❌ DB initialization failed:', err.message);
    throw err;
  } finally {
    conn.release();
  }
};

export { pool, initDB };