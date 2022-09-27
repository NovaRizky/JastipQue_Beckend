"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Shipping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Shipping.hasMany(models.OrderHeader, { foreignKey: "ShippingId" });
    }
  }
  Shipping.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Name is required",
          },
          notEmpty: {
            msg: "Name cannot be empty",
          },
        },
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "type is required",
          },
          notEmpty: {
            msg: "type cannot be empty",
          },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "price is required",
          },
          notEmpty: {
            msg: "price cannot be empty",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Shipping",
    }
  );
  return Shipping;
};
