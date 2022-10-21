'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userRecurringBill extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      userRecurringBill.belongsTo(models.recurringBill, {
        foreignKey: 'recurringBillId'
      });
      userRecurringBill.belongsTo(models.user, {
        foreignKey: 'userId'
      });
    }
  };
  userRecurringBill.init({
    userId: DataTypes.INTEGER,
    recurringBillId: DataTypes.INTEGER,
    weight: DataTypes.FLOAT,
    isPayer: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'userRecurringBill',
  });
  return userRecurringBill;
};