'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('banks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        validate: {
          customValidator(value) {
            if (value && this.companyId){
              throw new Error('We can\'t have an user and an company in the same times');
            } else if (!value && !this.companyId) {
              throw new Error('We need an user or a company');
            }
          }
        },
        references: {
          model: 'users',
          key: 'id'
        }
      },
      companyId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'companies',
          key: 'id'
        }
      },
      amount: {
        type: Sequelize.FLOAT
      },
      iban: {
        type: Sequelize.STRING
      },
      bic: {
        type: Sequelize.STRING
      },
      accountNumber: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('banks');
  }
};