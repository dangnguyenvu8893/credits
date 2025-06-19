import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

let sequelize;

const createSequelizeInstance = () => {
  if (process.env.NODE_ENV === 'production') {
    // Production - sử dụng DATABASE_URL từ Render.com
    return new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      logging: false,
    });
  } else {
    // Development
    return new Sequelize(
      process.env.DB_NAME || 'credits_db',
      process.env.DB_USER || 'credits_user',
      process.env.DB_PASSWORD || 'credits_password',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
          max: parseInt(process.env.DB_POOL_MAX) || 5,
          min: parseInt(process.env.DB_POOL_MIN) || 0,
          acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
          idle: parseInt(process.env.DB_POOL_IDLE) || 10000,
        },
      }
    );
  }
};

// Initialize sequelize only when needed
const getSequelize = () => {
  if (!sequelize) {
    sequelize = createSequelizeInstance();
  }
  return sequelize;
};

// Test connection
const testConnection = async () => {
  try {
    const db = getSequelize();
    await db.authenticate();
    console.log('✅ Database connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

export { getSequelize, testConnection }; 