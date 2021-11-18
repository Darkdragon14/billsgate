'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bank extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      bank.belongsTo(models.user, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });
      bank.hasMany(models.transaction, {
        foreignKey: 'bankToId'
      });
      bank.hasMany(models.transaction, {
        foreignKey: 'bankFromId'
      });
    }
  };
  bank.init({
    name: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    amount: DataTypes.FLOAT,
    iban: DataTypes.STRING,
    bic: DataTypes.STRING,
    accountNumber: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'bank',
  });
  return bank;
};