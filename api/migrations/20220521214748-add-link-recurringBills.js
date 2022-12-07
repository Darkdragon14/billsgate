'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('invoices', 'recurringBillId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'recurringBills',
        key: 'id'
      }
    });
    await queryInterface.createTable('userRecurringBills', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      recurringBillId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'recurringBills',
          key: 'id'
        }
      },
      weight: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: 0,
          max: 1
        }
      },
      isPayer: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
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
    await queryInterface.removeColumn('invoices', 'recurringBillId');
    await queryInterface.drop_table('user_recurringBill');
  }
};
