'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class invoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      invoice.belongsTo(models.compagnie, {
        foreignKey: 'compagnieId'
      });
      invoice.hasMany(models.transaction, {
        foreignKey: 'invoiceId'
      });
      invoice.hasMany(models.userInvoice, {
        foreignKey: 'invoiceId'
      });
    }
  };
  invoice.init({
    name: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    payementDate: DataTypes.DATE,
    dueDate: DataTypes.DATE,
    pathToAttachedFile: DataTypes.STRING,
    compagnieId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'invoice',
  });
  return invoice;
};