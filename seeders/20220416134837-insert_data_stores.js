"use strict";
const dataStores = require("./json/stores.json");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Stores",
      dataStores.map((el) => {
        el.createdAt = new Date();
        el.updatedAt = new Date();
        return el;
      }),
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Stores", null, {
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  },
};
