'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bankFromId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'banks',
          key: 'id'
        }
      },
      bankToId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          customValidator(value) {
            if (value && this.invoiceId){
              throw new Error('We can\'t have a bank to and an invoice in the same times');
            } else if (!value && !this.invoiceId) {
              throw new Error('We need a bank to or an invoice');
            }
          }
        },
        references: {
          model: 'banks',
          key: 'id',
        }
      },
      invoiceId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'invoices',
          key: 'id'
        }
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
    await queryInterface.dropTable('transactions');
  }
};