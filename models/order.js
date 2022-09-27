"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.hasOne(models.OrderHeader, { foreignKey: "OrderId" });
      Order.belongsTo(models.Product);
      Order.belongsTo(models.User);
    }
  }
  Order.init(
    {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Quantity is required",
          },
          notEmpty: {
            msg: "Quantity cannot be empty",
          },
          min: {
            args: 1,
            msg: "Minimum order is 1",
          },
          isNumeric: true,
        },
      },
      totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: DataTypes.STRING,
      note: DataTypes.STRING,
      ProductId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
