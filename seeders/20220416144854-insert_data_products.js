"use strict";

const dataProducts = require("./json/products.json");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Products",
      dataProducts.map((el) => {
        el.createdAt = new Date();
        el.updatedAt = new Date();
        return el;
      }),
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Products", null, {
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  },
};
