'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transaction.belongsTo(models.invoice, {
        foreignKey: 'invoiceId'
      });
      transaction.belongsTo(models.bank, {
        foreignKey: 'bankToId'
      });
      transaction.belongsTo(models.bank, {
        foreignKey: 'bankFromId'
      });
    }
  };
  transaction.init({
    bankFromId: DataTypes.INTEGER,
    bankToId: DataTypes.INTEGER,
    invoiceId: DataTypes.INTEGER,
    availableDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'transaction',
  });
  return transaction;
};