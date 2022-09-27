"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User);
    }
  }
  Profile.init(
    {
      firstName: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate : { 
          notNull: {
            msg : 'FirstName Not Null'
          }
        }
      },
      lastName: DataTypes.TEXT,
      birthDate: DataTypes.STRING,
      gender: DataTypes.STRING,
      address: {
          type: DataTypes.STRING,
          allowNull: false,
          validate : {
            notNull: {
              msg : 'Address Not Null'
            }
          }
      },
      phoneNumber: DataTypes.STRING,
      UserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Profile",
    }
  );
  return Profile;
};
