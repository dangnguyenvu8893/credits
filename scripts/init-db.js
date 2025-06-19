const { Client } = require('pg');
require('dotenv').config();

async function initDatabase() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'credits_user',
    password: process.env.DB_PASSWORD || 'credits_password',
    database: 'postgres', // Connect to default postgres database first
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Check if database exists
    const dbExists = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME || 'credits_db']
    );

    if (dbExists.rows.length === 0) {
      // Create database
      await client.query(`CREATE DATABASE ${process.env.DB_NAME || 'credits_db'}`);
      console.log(`✅ Database '${process.env.DB_NAME || 'credits_db'}' created successfully`);
    } else {
      console.log(`✅ Database '${process.env.DB_NAME || 'credits_db'}' already exists`);
    }

  } catch (error) {
    console.error('❌ Error initializing database:', error);
  } finally {
    await client.end();
  }
}

// Run if called directly
if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase }; 