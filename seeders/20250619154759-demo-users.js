'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        fullName: 'Administrator',
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'john_doe',
        email: 'john.doe@example.com',
        password: hashedPassword,
        fullName: 'John Doe',
        role: 'user',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'jane_smith',
        email: 'jane.smith@example.com',
        password: hashedPassword,
        fullName: 'Jane Smith',
        role: 'user',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'mike_wilson',
        email: 'mike.wilson@example.com',
        password: hashedPassword,
        fullName: 'Mike Wilson',
        role: 'user',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
