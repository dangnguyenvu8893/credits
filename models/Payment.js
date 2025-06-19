const { DataTypes } = require('sequelize');
const { getSequelize } = require('../lib/database');

const Payment = (() => {
  const sequelize = getSequelize();
  
  return sequelize.define('Payment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    creditId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'credits',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    paymentMethod: {
      type: DataTypes.ENUM('cash', 'bank_transfer', 'credit_card', 'debit_card'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled'),
      defaultValue: 'pending',
    },
    transactionId: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isLate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lateFee: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
  }, {
    tableName: 'payments',
    timestamps: true,
  });
})();

module.exports = Payment; 