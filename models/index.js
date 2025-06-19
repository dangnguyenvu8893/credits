const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool,
    logging: dbConfig.logging,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  }
);

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

// Import models here
// const User = require('./user')(sequelize, Sequelize.DataTypes);
// const Credit = require('./credit')(sequelize, Sequelize.DataTypes);

// Define associations here
// User.hasMany(Credit);
// Credit.belongsTo(User);

module.exports = {
  sequelize,
  Sequelize,
  testConnection
}; 