"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrderHeader extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderHeader.belongsTo(models.User);
      OrderHeader.belongsTo(models.Order);
      OrderHeader.belongsTo(models.Store);
      OrderHeader.belongsTo(models.Shipping);
    }
  }
  OrderHeader.init(
    {
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      costShippings: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      OrderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      StoreId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ShippingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "OrderHeader",
    }
  );
  return OrderHeader;
};
