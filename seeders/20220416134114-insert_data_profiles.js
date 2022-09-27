"use strict";
const dataProfiles = require("./json/profiles.json");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Profiles",
      dataProfiles.map((el) => {
        el.createdAt = new Date();
        el.updatedAt = new Date();
        return el;
      }),
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Profiles", null, {
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  },
};
