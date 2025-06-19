const User = require('./User');
const Credit = require('./Credit');
const Payment = require('./Payment');

// Associations
User.hasMany(Credit, { foreignKey: 'userId', as: 'credits' });
Credit.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Payment, { foreignKey: 'userId', as: 'payments' });
Payment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Credit.hasMany(Payment, { foreignKey: 'creditId', as: 'payments' });
Payment.belongsTo(Credit, { foreignKey: 'creditId', as: 'credit' });

// Admin approval relationship
User.hasMany(Credit, { foreignKey: 'approvedBy', as: 'approvedCredits' });
Credit.belongsTo(User, { foreignKey: 'approvedBy', as: 'approver' });

module.exports = {
  User,
  Credit,
  Payment,
}; 