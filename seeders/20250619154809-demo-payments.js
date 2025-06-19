'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    
    await queryInterface.bulkInsert('payments', [
      // Thanh toán cho khoản vay 1 (john_doe - mua xe máy)
      {
        creditId: 1,
        userId: 2,
        amount: 450000,
        paymentDate: now,
        paymentMethod: 'bank_transfer',
        status: 'completed',
        transactionId: 'TXN001',
        notes: 'Thanh toán tháng đầu tiên',
        dueDate: now,
        isLate: false,
        lateFee: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        creditId: 1,
        userId: 2,
        amount: 450000,
        paymentDate: oneMonthAgo,
        paymentMethod: 'cash',
        status: 'completed',
        transactionId: 'TXN002',
        notes: 'Thanh toán tháng thứ 2',
        dueDate: oneMonthAgo,
        isLate: false,
        lateFee: 0,
        createdAt: oneMonthAgo,
        updatedAt: oneMonthAgo,
      },
      
      // Thanh toán cho khoản vay 3 (mike_wilson - kinh doanh)
      {
        creditId: 3,
        userId: 4,
        amount: 720000,
        paymentDate: now,
        paymentMethod: 'credit_card',
        status: 'completed',
        transactionId: 'TXN003',
        notes: 'Thanh toán tháng đầu tiên',
        dueDate: now,
        isLate: false,
        lateFee: 0,
        createdAt: now,
        updatedAt: now,
      },
      
      // Thanh toán cho khoản vay 4 (john_doe - học phí - đã hoàn thành)
      {
        creditId: 4,
        userId: 2,
        amount: 525000,
        paymentDate: threeMonthsAgo,
        paymentMethod: 'bank_transfer',
        status: 'completed',
        transactionId: 'TXN004',
        notes: 'Thanh toán tháng thứ 1',
        dueDate: threeMonthsAgo,
        isLate: false,
        lateFee: 0,
        createdAt: threeMonthsAgo,
        updatedAt: threeMonthsAgo,
      },
      {
        creditId: 4,
        userId: 2,
        amount: 525000,
        paymentDate: twoMonthsAgo,
        paymentMethod: 'bank_transfer',
        status: 'completed',
        transactionId: 'TXN005',
        notes: 'Thanh toán tháng thứ 2',
        dueDate: twoMonthsAgo,
        isLate: false,
        lateFee: 0,
        createdAt: twoMonthsAgo,
        updatedAt: twoMonthsAgo,
      },
      {
        creditId: 4,
        userId: 2,
        amount: 525000,
        paymentDate: oneMonthAgo,
        paymentMethod: 'bank_transfer',
        status: 'completed',
        transactionId: 'TXN006',
        notes: 'Thanh toán tháng thứ 3',
        dueDate: oneMonthAgo,
        isLate: false,
        lateFee: 0,
        createdAt: oneMonthAgo,
        updatedAt: oneMonthAgo,
      },
      {
        creditId: 4,
        userId: 2,
        amount: 525000,
        paymentDate: now,
        paymentMethod: 'bank_transfer',
        status: 'completed',
        transactionId: 'TXN007',
        notes: 'Thanh toán tháng thứ 4',
        dueDate: now,
        isLate: false,
        lateFee: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        creditId: 4,
        userId: 2,
        amount: 525000,
        paymentDate: now,
        paymentMethod: 'bank_transfer',
        status: 'completed',
        transactionId: 'TXN008',
        notes: 'Thanh toán tháng thứ 5',
        dueDate: now,
        isLate: false,
        lateFee: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        creditId: 4,
        userId: 2,
        amount: 525000,
        paymentDate: now,
        paymentMethod: 'bank_transfer',
        status: 'completed',
        transactionId: 'TXN009',
        notes: 'Thanh toán tháng thứ 6 (cuối cùng)',
        dueDate: now,
        isLate: false,
        lateFee: 0,
        createdAt: now,
        updatedAt: now,
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('payments', null, {});
  }
};
