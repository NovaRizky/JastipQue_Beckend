// Setup for testing
const request = require('supertest');
const app = require('../../app');
const { sequelize } = require('../../models/index');
const { encrypt } = require('../../helpers/bcrypt');
const { queryInterface } = sequelize;

// Endpoint test
let endpoint = "/users";

beforeAll(async () => {
  // Query Bulk Delete to Database
  await queryInterface.bulkDelete('Users', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  });

  await queryInterface.bulkDelete('Profiles', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  });

  // Query Bulk Insert to Database
  await queryInterface.bulkInsert('Users', [
    {
      username: "admin1",
      email: "adm_1@mail.com",
      password: encrypt("password"),
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: "customer1",
      email: "cust_1@mail.com",
      password: encrypt("password"),
      role: "customer",
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ], {});

  await queryInterface.bulkInsert('Profiles', [
    {
      firstName: "First",
      lastName: "Admin",
      birthDate: "Jakarta, 17-11-1995",
      gender: "Male",
      address: "Jakarta",
      phoneNumber: "021340123",
      UserId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      firstName: "First",
      lastName: "Customer",
      birthDate: "Bandung, 17-12-1996",
      gender: "Female",
      address: "Bandung",
      phoneNumber: "021340123",
      UserId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ], {});
});

describe('TEST ENDPOINT /users Feature', () => {
  // -- Start of POST -- 
  test('POST /users/login should return 200, access_token, success, id, and role', (done) => {
    const testData = {
      email: "adm_1@mail.com",
      password: "password"
    };

    request(app)
      .post(`${endpoint}/login`)
      .expect(200)
      .send(testData)
      .set('Content-Type', 'application/json')
      .then(({ body }) => {
        expect(body).toMatchObject({
          success: expect.anything(),
          message: expect.anything(),
          access_token: expect.anything(),
          id: expect.anything(),
          role: expect.anything()
        })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test('POST /users/login without email or password should return 400', (done) => {
    const testData = {};

    request(app)
      .post(`${endpoint}/login`)
      .send(testData)
      .expect(400)
      .set('Content-Type', 'application/json')
      .then(({ body }) => {
        expect(body).toMatchObject({
          success: false,
          err: "Email/Password is required"
        })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test('POST /users/login with wrong password should return 401', (done) => {
    const testData = {
      email: "adm_1@mail.com",
      password: "wrongpassword"
    };

    request(app)
      .post(`${endpoint}/login`)
      .expect(401)
      .send(testData)
      .set('Content-Type', 'application/json')
      .then(({ body }) => {
        expect(body).toMatchObject({
          success: false,
          err: "Email or password not found!"
        })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test('POST /users/login with unregistered email should return 401', (done) => {
    const testData = {
      email: "adm_99@mail.com",
      password: "wrongpassword"
    };

    request(app)
      .post(`${endpoint}/login`)
      .expect(401)
      .send(testData)
      .set('Content-Type', 'application/json')
      .then(({ body }) => {
        expect(body).toMatchObject({
          success: false,
          err: "Email or password not found!"
        })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test('POST /users/login with empty string on email or password should return 400', (done) => {
    const testData = {
      email: "",
      password: ""
    };

    request(app)
      .post(`${endpoint}/login`)
      .expect(400)
      .send(testData)
      .set('Content-Type', 'application/json')
      .then(({ body }) => {
        expect(body).toMatchObject({
          success: false,
          err: "Email/Password is required"
        })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });
  // -- End of POST -- 
})