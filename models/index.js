const { getSequelize } = require('../lib/database');

// Lazy load models to avoid Sequelize initialization during build
let User, Credit, Payment;

const getModels = () => {
  if (!User) {
    User = require('./User');
  }
  if (!Credit) {
    Credit = require('./Credit');
  }
  if (!Payment) {
    Payment = require('./Payment');
  }
  
  return { User, Credit, Payment };
};

// Test the connection
const testConnection = async () => {
  try {
    const sequelize = getSequelize();
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

// Setup associations when models are loaded
const setupAssociations = () => {
  const models = getModels();
  
  // Define associations here
  models.User.hasMany(models.Credit, { foreignKey: 'userId', as: 'credits' });
  models.Credit.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });

  models.User.hasMany(models.Credit, { foreignKey: 'approvedBy', as: 'approvedCredits' });
  models.Credit.belongsTo(models.User, { foreignKey: 'approvedBy', as: 'approver' });

  models.Credit.hasMany(models.Payment, { foreignKey: 'creditId', as: 'payments' });
  models.Payment.belongsTo(models.Credit, { foreignKey: 'creditId', as: 'credit' });

  models.User.hasMany(models.Payment, { foreignKey: 'userId', as: 'payments' });
  models.Payment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
};

module.exports = {
  getSequelize,
  testConnection,
  getModels,
  setupAssociations
}; 