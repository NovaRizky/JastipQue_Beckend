"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "OrderHeaders",
      [
        {
          status: "Waiting Payment",
          date: new Date(),
          weight: 20,
          costShippings: 200000,
          address: "Jalan Mangga Besar III, Kec. Lawang, Kab. Malang, Jawa Timur",
          OrderId: 1,
          StoreId: 1,
          UserId: 2,
          ShippingId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          status: "Waiting Payment",
          date: new Date(),
          weight: 17,
          costShippings: 150000,
          address: "Jalan Mangga Besar III, Kec. Lawang, Kab. Malang, Jawa Timur",
          OrderId: 2,
          StoreId: 1,
          UserId: 2,
          ShippingId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("OrderHeaders", null, {
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  },
};
