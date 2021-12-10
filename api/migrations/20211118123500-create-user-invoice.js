'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('userInvoices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      invoiceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'invoices',
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
      paymentDate: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('userInvoices');
  }
};