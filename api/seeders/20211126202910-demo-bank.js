'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('banks', [
      {
        name: 'Bank John Doe',
        userId: 1,
        amount: 500,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bank Alice Bob',
        userId: 2,
        amount: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('banks', null, {});
  }
};
