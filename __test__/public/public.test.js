// // Setup for testing
// const request = require('supertest');
// const app = require('../../app');
// const { sequelize } = require('../../models/index');
// const { encrypt } = require('../../helpers/bcrypt');
// const { sign } = require('../../helpers/jwt');
// const { queryInterface } = sequelize;

// // Endpoint test
// let endpoint = "/pub";

// beforeAll(async () => {
//   // Query Bulk Insert to Database
//   await queryInterface.bulkDelete('Users', null, {
//     truncate: true,
//     restartIdentity: true,
//     cascade: true
//   });

//   await queryInterface.bulkDelete('Events', null, {
//     truncate: true,
//     restartIdentity: true,
//     cascade: true
//   });

//   await queryInterface.bulkDelete('Products', null, {
//     truncate: true,
//     restartIdentity: true,
//     cascade: true
//   });

//   await queryInterface.bulkDelete('Stores', null, {
//     truncate: true,
//     restartIdentity: true,
//     cascade: true
//   });

//   await queryInterface.bulkDelete('Categories', null, {
//     truncate: true,
//     restartIdentity: true,
//     cascade: true
//   });
  
//   // Query Bulk Insert to Database
//   await queryInterface.bulkInsert('Users', [
//     {
//       username: "admin1",
//       email: "adm_1@mail.com",
//       password: encrypt("password"),
//       role: "admin",
//       createdAt: new Date(),
//       updatedAt: new Date()
//     },
//     {
//       username: "customer1",
//       email: "cust_1@mail.com",
//       password: encrypt("password"),
//       role: "customer",
//       createdAt: new Date(),
//       updatedAt: new Date()
//     },
//   ], {});

//   await queryInterface.bulkInsert('Categories', [
//     {
//       name: "Hardware",
//       createdAt: new Date(),
//       updatedAt: new Date()
//     },
//     {
//       name: "PC Gaming",
//       createdAt: new Date(),
//       updatedAt: new Date()
//     },
//     {
//       name: "Laptop Gaming",
//       createdAt: new Date(),
//       updatedAt: new Date()
//     }
//   ], {});

//   await queryInterface.bulkInsert('Events', [
//     {
//       name: "TechComp Fest",
//       start: new Date(),
//       finish: new Date(),
//       address: "Tanah Abang, Jakarta, Indonesia",
//       mapsUrl: "https://tomwoolley.com/v2/wp-content/uploads/2020/02/BDF-Venue-Map.jpg",
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//     {
//       name: "ELCCO: Electrical and Computer Competition",
//       start: new Date(),
//       finish: new Date(),
//       address: "Kompleks Taman Lumbini, Kawasan Candi Borobudur, Kabupaten Magelang, Jawa Tengah",
//       mapsUrl: "https://awsimages.detik.net.id/community/media/visual/2020/08/26/tangkap-layar-google-maps-usulan-jalur-sepeda-di-tol-cawang-tanjung-priok_43.jpeg?w=700&q=90",
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//   ], {});

//   await queryInterface.bulkInsert('Stores', [
//     {
//       name: "Dx Computer Shop",
//       statusStore: "active",
//       UserId: 1,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//     {
//       name: "Test Computer Shop",
//       statusStore: "inactive",
//       UserId: 2,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     }
//   ]);

//   await queryInterface.bulkInsert('Products', [
//     {
//       name: "PC Gaming Core I5 9400/RX 570 4 GB/DDR4 16 GB/Samsung 24 Curved",
//       description: "PC gaming rakitan keluaran terbaru",
//       imageUrl: "https://br.atsit.in/id/wp-content/uploads/2022/01/npd-group-pengeluaran-konsumen-untuk-perangkat-keras-dan-aksesori-pc-gaming-meningkat-25-pada-tahun-2021.jpg",
//       status: "Active",
//       price: 10000000,
//       weight: 30,
//       stock: 10,
//       CategoryId: 2,
//       EventId: 1,
//       StoreId: 1,
//       createdAt: new Date(),
//       updatedAt: new Date()
//     },
//     {
//       name: "ROG Zephyrus Duo 15 SE",
//       description: "Laptop Gaming Dua Layar Paling Berharga",
//       imageUrl: "https://pict-c.sindonews.net/dyn/620/pena/news/2021/04/28/123/411468/rog-zephyrus-duo-15-se-laptop-gaming-dua-layar-paling-bertenaga-ksg.jpg",
//       status: "Active",
//       price: 15000000,
//       weight: 15,
//       stock: 5,
//       CategoryId: 3,
//       EventId: 1,
//       StoreId: 1,
//       createdAt: new Date(),
//       updatedAt: new Date()
//     },
//     {
//       name: "Motherboard Socket 1700 MSI Z690 Godlike",
//       description: "Rekomendasi motherboard bertenaga super",
//       imageUrl: "https://i0.wp.com/www.murdockcruz.com/wp-content/uploads/2019/06/MSI-MEG-X570-Godlike-Feat.jpg?fit=650%2C420&ssl=1",
//       status: "Active",
//       price: 12500000,
//       weight: 10,
//       stock: 7,
//       CategoryId: 1,
//       EventId: 2,
//       StoreId: 1,
//       createdAt: new Date(),
//       updatedAt: new Date()
//     },
//     {
//       name: "Motherboard Socket 1700 MSI Z90 Godlike",
//       description: "Rekomendasi motherboard bertenaga super",
//       imageUrl: "https://i0.wp.com/www.murdockcruz.com/wp-content/uploads/2019/06/MSI-MEG-X570-Godlike-Feat.jpg?fit=650%2C420&ssl=1",
//       status: "Inactive",
//       price: 12500000,
//       weight: 10,
//       stock: 0,
//       CategoryId: 1,
//       EventId: 1,
//       StoreId: 1,
//       createdAt: new Date(),
//       updatedAt: new Date()
//     }
//   ], {});
// });


// describe('TEST ENDPOINT /pub Feature', () => {
//   // -- Start of GET -- 
//   test('GET /pub/products should return 200 and all products', (done) => {
//     request(app)
//       .get(`${endpoint}/products`)
//       .expect(200)
//       .then(({ body }) => {
//         expect(body.products.length).toBe(3)
//         done();
//       })
//       .catch((error) => {
//         done(error);
//       });
//   });

//   test('GET /pub/events should return 200 and all events', (done) => {
//     request(app)
//       .get(`${endpoint}/events`)
//       .expect(200)
//       .then(({ body }) => {
//         expect(body.events.length).toBe(2)
//         done();
//       })
//       .catch((error) => {
//         done(error);
//       });
//   });

//   test('GET /pub/products/:productId should return 200 and the chosen product itself', (done) => {
//     request(app)
//       .get(`${endpoint}/products/1`)
//       .expect(200)
//       .then(({ body }) => {
//         expect(body).toMatchObject({
//           id: 1,
//           name: "PC Gaming Core I5 9400/RX 570 4 GB/DDR4 16 GB/Samsung 24 Curved",
//           description: "PC gaming rakitan keluaran terbaru",
//           imageUrl: "https://br.atsit.in/id/wp-content/uploads/2022/01/npd-group-pengeluaran-konsumen-untuk-perangkat-keras-dan-aksesori-pc-gaming-meningkat-25-pada-tahun-2021.jpg",
//           status: "Active",
//           price: 10000000,
//           weight: 30,
//           stock: 10,
//           CategoryId: 2,
//           EventId: 1,
//           StoreId: 1,
//           createdAt: expect.anything(),
//           updatedAt: expect.anything()
//         })
//         done();
//       })
//       .catch((error) => {
//         done(error);
//       });
//   });
//   // -- End of GET -- 
// })
