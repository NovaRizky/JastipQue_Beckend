// // Setup for testing
// const request = require('supertest');
// const app = require('../../app');
// const { sequelize } = require('../../models/index');
// const { encrypt } = require('../../helpers/bcrypt');
// const { sign } = require('../../helpers/jwt');
// const { queryInterface } = sequelize;

// // Endpoint test
// let endpoint = "/users";
// let accessTokenAdmin = sign({ id: 1, email: "adm_1@mail.com", role: 'admin' });

// beforeAll(async () => {
//   // Query Bulk Delete to Database
//   await queryInterface.bulkDelete('Users', null, {
//     truncate: true,
//     restartIdentity: true,
//     cascade: true
//   });

//   await queryInterface.bulkDelete('Profiles', null, {
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

//   await queryInterface.bulkInsert('Profiles', [
//     {
//       firstName: "First",
//       lastName: "Admin",
//       birthDate: "Jakarta, 17-11-1995",
//       gender: "Male",
//       address: "Jakarta",
//       phoneNumber: "021340123",
//       UserId: 1,
//       createdAt: new Date(),
//       updatedAt: new Date()
//     },
//     {
//       firstName: "First",
//       lastName: "Customer",
//       birthDate: "Bandung, 17-12-1996",
//       gender: "Female",
//       address: "Bandung",
//       phoneNumber: "021340123",
//       UserId: 2,
//       createdAt: new Date(),
//       updatedAt: new Date()
//     },
//   ], {});
// });

// describe('TEST ENDPOINT /users/:id Feature', () => {
//   // -- Start of DELETE -- 
//   test('DELETE /users should return 200, access_token, success, id, and role', (done) => {
//     request(app)
//       .delete(`${endpoint}/2`)
//       .expect(200)
//       .set('access_token', accessTokenAdmin)
//       .then(({ body }) => {
//         expect(body).toMatchObject({
//           message: `success delete data`
//         })
//         done();
//       })
//       .catch((error) => {
//         done(error);
//       });
//   });
//   // -- End of DELETE -- 
// })