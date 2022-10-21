'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class recurringBill extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      recurringBill.belongsTo(models.company, {
        foreignKey: 'companyId'
      });
      recurringBill.hasMany(models.invoice, {
        foreignKey: 'recurringBillId'
      });
      recurringBill.hasMany(models.userRecurringBill, {
        foreignKey: 'recurringBillId'
      });
    }
  };
  recurringBill.init({
    name: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    dueDate: DataTypes.DATE,
    pathToAttachedFile: DataTypes.STRING,
    companyId: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN,
    recurrenceUnit: DataTypes.ENUM('day', 'week', 'month', 'year'),
    recurrence: DataTypes.INTEGER,
    recurringCount: DataTypes.INTEGER,
    recurringEndDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'recurringBill',
  });
  return recurringBill;
};