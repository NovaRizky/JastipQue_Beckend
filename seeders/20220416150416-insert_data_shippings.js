"use strict";
const dataShipping = require("./json/shippings.json");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Shippings",
      dataShipping.map((el) => {
        el.createdAt = new Date();
        el.updatedAt = new Date();
        return el;
      }),
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Shippings", null, {
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  },
};
