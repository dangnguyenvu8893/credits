import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

let sequelize;

const createSequelizeInstance = () => {
  if (process.env.NODE_ENV === 'production') {
    // Production - sử dụng DATABASE_URL từ Render.com
    return new Sequelize(process.env.DATABASE_URL, {
      dialect: 'mysql',
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
      process.env.DB_USER || 'root',
      process.env.DB_PASSWORD || 'password',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        dialectModule: require('mysql2'),
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