"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("OrderHeaders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.STRING,
      },
      date: {
        type: Sequelize.DATE,
      },
      weight: {
        type: Sequelize.INTEGER,
      },
      costShippings: {
        type: Sequelize.INTEGER,
      },
      address: {
        type: Sequelize.STRING,
      },
      OrderId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Orders",
          key: "id",
        },
      },
      StoreId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Stores",
          key: "id",
        },
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      ShippingId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Shippings",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("OrderHeaders");
  },
};
