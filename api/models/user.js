'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasMany(models.bank, {
        foreignKey: 'userId'
      });
      user.hasMany(models.userInvoice, {
        foreignKey: 'userId'
      });
      user.hasMany(models.userRecurringBill, {
        foreignKey: 'userId'
      });
    }
  };
  user.init({
    username: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    gender: DataTypes.STRING,
    external: DataTypes.BOOLEAN,
    hashed_password: DataTypes.BLOB,
    salt: DataTypes.BLOB
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};