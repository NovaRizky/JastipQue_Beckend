"use strict";
const { Model } = require("sequelize");
const { encrypt } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Store, { foreignKey: "UserId" });
      User.hasOne(models.Profile, { foreignKey: "UserId" });
      User.hasOne(models.OrderHeader, { foreignKey: "UserId" });
      User.hasMany(models.Message);
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate : {
          notNull: {
              msg : 'Username Not Null'
              },
          notEmpty: {
              msg : 'Username cannot be empty'
            }
          }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate : {
          isEmail: {
            msg: 'Invalid email format'
          }, 
          notNull: {
            msg : 'Email Not Null'
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate : {
          len : {
            args : [5],
            msg : 'password minimal 5 character'
          },
          notNull : {
            msg : 'password not Null'
          }
        }
      },
      role: DataTypes.STRING,
    },
    {
      hooks: {
        beforeCreate : (user) => { 
          user.password = encrypt(user.password); 
        }
      },
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
