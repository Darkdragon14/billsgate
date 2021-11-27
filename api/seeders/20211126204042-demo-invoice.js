'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('invoices', [
      {
        name: 'home',
        amount: 750.10,
        dueDate: '2021-12-12',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'electricity',
        amount: 200,
        dueDate: '2021-12-20',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    await queryInterface.bulkInsert('userInvoices', [
      {
        userId: 1,
        invoiceId: 1,
        weight: 0.5,
        isPayer: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        invoiceId: 1,
        weight: 0.5,
        isPayer: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        invoiceId: 2,
        weight: 1,
        isPayer: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('invoices');
    await queryInterface.bulkDelete('userInvoices');
  }
};
