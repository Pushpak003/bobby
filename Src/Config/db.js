const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

const sslCertPath = path.join(__dirname,"ca.pem");
const sslCert = fs.readFileSync(sslCertPath, "utf8");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const logger = require("../utils/logger");
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  connectionTimeoutMillis: 10000, // 30 seconds
  idleTimeoutMillis: 20000, // 30 seconds
  ssl: {
    rejectUnauthorized: true,
    ca: sslCert,
  },
});


// ✅ **Test DB Connection**
if (process.env.NODE_ENV !== "test") {
  (async () => {
    try {
      const client = await pool.connect();
      console.log("✅ DB connection successful");
      client.release();
    } catch (err) {
      console.log(`❌ DB connection failed: ${err.message}`);
    }
  })();
}

module.exports = pool ;