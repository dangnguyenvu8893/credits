const { DataTypes } = require('sequelize');
const { sequelize } = require('../lib/database');

const Credit = sequelize.define('Credit', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  interestRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100,
    },
  },
  term: {
    type: DataTypes.INTEGER, // Số tháng
    allowNull: false,
    validate: {
      min: 1,
      max: 360, // Tối đa 30 năm
    },
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'active', 'completed', 'defaulted'),
    defaultValue: 'pending',
  },
  purpose: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  monthlyPayment: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  approvedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'credits',
  timestamps: true,
});

module.exports = Credit; 