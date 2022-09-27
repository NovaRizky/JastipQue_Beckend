"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Events",
      [
        {
          name: "TechComp Fest",
          start: new Date(),
          finish: new Date(),
          address: "Tanah Abang, Jakarta, Indonesia",
          mapsUrl: "https://tomwoolley.com/v2/wp-content/uploads/2020/02/BDF-Venue-Map.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "ELCCO: Electrical and Computer Competition",
          start: new Date(),
          finish: new Date(),
          address: "Kompleks Taman Lumbini, Kawasan Candi Borobudur, Kabupaten Magelang, Jawa Tengah",
          mapsUrl: "https://awsimages.detik.net.id/community/media/visual/2020/08/26/tangkap-layar-google-maps-usulan-jalur-sepeda-di-tol-cawang-tanjung-priok_43.jpeg?w=700&q=90",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Events", null, {
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  },
};
