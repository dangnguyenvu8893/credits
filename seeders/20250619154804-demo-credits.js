'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date();
    const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const sixMonthsFromNow = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000);
    const oneYearFromNow = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
    
    await queryInterface.bulkInsert('credits', [
      {
        userId: 2, // john_doe
        amount: 5000000, // 5 triệu VND
        interestRate: 12.5,
        term: 12, // 12 tháng
        status: 'approved',
        purpose: 'Mua xe máy',
        monthlyPayment: 450000,
        totalAmount: 5400000,
        approvedAt: now,
        approvedBy: 1, // admin
        startDate: now,
        endDate: oneYearFromNow,
        notes: 'Khoản vay mua xe máy cho công việc',
        createdAt: now,
        updatedAt: now,
      },
      {
        userId: 3, // jane_smith
        amount: 10000000, // 10 triệu VND
        interestRate: 15.0,
        term: 24, // 24 tháng
        status: 'pending',
        purpose: 'Sửa chữa nhà',
        monthlyPayment: 485000,
        totalAmount: 11640000,
        approvedAt: null,
        approvedBy: null,
        startDate: null,
        endDate: null,
        notes: 'Khoản vay sửa chữa nhà cửa',
        createdAt: now,
        updatedAt: now,
      },
      {
        userId: 4, // mike_wilson
        amount: 20000000, // 20 triệu VND
        interestRate: 18.0,
        term: 36, // 36 tháng
        status: 'active',
        purpose: 'Kinh doanh',
        monthlyPayment: 720000,
        totalAmount: 25920000,
        approvedAt: now,
        approvedBy: 1, // admin
        startDate: now,
        endDate: new Date(now.getTime() + 3 * 365 * 24 * 60 * 60 * 1000),
        notes: 'Khoản vay kinh doanh mở cửa hàng',
        createdAt: now,
        updatedAt: now,
      },
      {
        userId: 2, // john_doe
        amount: 3000000, // 3 triệu VND
        interestRate: 10.0,
        term: 6, // 6 tháng
        status: 'completed',
        purpose: 'Học phí',
        monthlyPayment: 525000,
        totalAmount: 3150000,
        approvedAt: new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000),
        approvedBy: 1, // admin
        startDate: new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000),
        endDate: now,
        notes: 'Khoản vay học phí đã hoàn thành',
        createdAt: new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000),
        updatedAt: now,
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('credits', null, {});
  }
};
