'use strict';
const crypto = require('crypto');

const saltJohn = crypto.randomBytes(16);
const saltAlice = crypto.randomBytes(16);

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
        hashed_password: crypto.pbkdf2Sync('john', saltJohn, 310000, 32, 'sha256'),
        salt: saltJohn,
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
        hashed_password: crypto.pbkdf2Sync('alice', saltAlice, 310000, 32, 'sha256'),
        salt: saltAlice,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
