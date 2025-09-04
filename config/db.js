import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || null, // Explicitly set to null
  database: process.env.DB_NAME || "monfortschoolmettur",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: 10000
};

const db = mysql.createPool(dbConfig);

// Test connection with retries
const testConnection = async (retries = 3, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await db.getConnection();
      connection.release();
      console.log("✅ Connected to MySQL database");
      return true;
    } catch (err) {
      console.error(`❌ Connection attempt ${i + 1} failed:`, err.message);
      if (i < retries - 1) {
        await new Promise(res => setTimeout(res, delay));
      }
    }
  }
  console.error("Failed to connect after multiple attempts");
  process.exit(1);
};

testConnection();

export default db;