"use strict";

const dataUsers = require("./json/users.json");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      dataUsers.map((el) => {
        el.createdAt = new Date();
        el.updatedAt = new Date();
        return el;
      }),
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  },
};
