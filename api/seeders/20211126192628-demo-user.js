'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
        username: 'JohnDoe',
        firstname: 'John',
        lastname: 'Doe',
        email: 'johndoe@billsgate.com',
        gender: "M",
        external: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'AliceBob',
        firstname: 'Alice',
        lastname: 'Bob',
        email: 'AliceBob@billsgate.com',
        gender: "F",
        external: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
