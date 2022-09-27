"use strict";
const dataOrders = require("./json/orders.json");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Orders",
      dataOrders.map((el) => {
        el.createdAt = new Date();
        el.updatedAt = new Date();
        return el;
      }),
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Orders", null, {
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  },
};
