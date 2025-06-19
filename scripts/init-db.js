const { sequelize, testConnection } = require('../models/index');

const initDatabase = async () => {
  try {
    // Test connection
    await testConnection();
    
    // Sync database (create tables if they don't exist)
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Database synchronized successfully.');
    
    // Close connection
    await sequelize.close();
    console.log('✅ Database connection closed.');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
};

// Run if this file is executed directly
if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase; 