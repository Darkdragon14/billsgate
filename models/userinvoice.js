'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userInvoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      userInvoice.belongsTo(models.invoice, {
        foreignKey: 'invoiceId'
      });
      userInvoice.belongsTo(models.user, {
        foreignKey: 'userId'
      });
    }
  };
  userInvoice.init({
    userId: DataTypes.INTEGER,
    invoiceId: DataTypes.INTEGER,
    weight: DataTypes.FLOAT,
    isPayer: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'userInvoice',
  });
  return userInvoice;
};