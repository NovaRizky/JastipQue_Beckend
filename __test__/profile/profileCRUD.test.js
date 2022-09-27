// Setup for testing
const request = require('supertest');
const app = require('../../app');
const { sequelize } = require('../../models/index');
const { encrypt } = require('../../helpers/bcrypt');
const { sign } = require('../../helpers/jwt');
const { queryInterface } = sequelize;

// Endpoint test
let endpoint = "/profile";
let accessTokenAdmin = sign({ id: 1, email: "adm_1@mail.com", role: 'admin' });
let accessTokenCustomer = sign({ id: 2, email: "cust_1@mail.com", role: 'customer' });

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
    }
  ], {});
});

describe('TEST ENDPOINT /profile Feature', () => {
  // -- Start of GET -- 
  test('GET /profile/:id should return 200 and user profile', (done) => {
    request(app)
      .get(`${endpoint}/1`)
      .expect(200)
      .set('access_token', accessTokenAdmin)
      .then(({ body }) => {
        console.log(body, "...");
        expect(body).toMatchObject({
          data: {
            firstName: "First",
          lastName: "Admin",
          birthDate: "Jakarta, 17-11-1995",
          gender: "Male",
          address: "Jakarta",
          phoneNumber: "021340123",
          UserId: 1,
          createdAt: expect.anything(),
          updatedAt: expect.anything()
        }})
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test('GET /profile/:id without matching id should return 403', (done) => {
    request(app)
      .get(`${endpoint}/1`)
      .expect(403)
      .set('access_token', accessTokenCustomer)
      .then(({ body }) => {
        expect(body).toMatchObject({
          success: false,
          err: "Forbidden"
        })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test('POST /profile should return 201 and the profile itself', (done) => {
    const testData = {
      firstName: "Orange",
      lastName: "Soda",
      birthDate: "05-05-1995",
      gender: "Female",
      address: "Jakarta",
      phoneNumber: "+62798989"
    };

    request(app)
      .post(`${endpoint}`)
      .expect(201)
      .send(testData)
      .set('access_token', accessTokenCustomer)
      .then(({ body }) => {
        expect(body).toMatchObject({
          profile: {
            id: expect.any(Number),
            firstName: "Orange",
            lastName: "Soda",
            birthDate: "05-05-1995",
            gender: "Female",
            address: "Jakarta",
            phoneNumber: "+62798989",
            createdAt: expect.anything(),
            updatedAt: expect.anything()
          }
        })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test('POST /profile to user that already have profile should return 409', (done) => {
    const testData = {
      firstName: "Orange",
      lastName: "Soda",
      birthDate: "05-05-1995",
      gender: "Female",
      address: "Jakarta",
      phoneNumber: "+62798989"
    };

    request(app)
      .get(`${endpoint}`)
      .expect(409)
      .send(testData)
      .set('access_token', accessTokenCustomer)
      .then(({ body }) => {
        expect(body).toMatchObject({
          success: false,
          err: "User already has profile"
        })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test('PUT /profile should return 200', (done) => {
    const testData = {
      firstName: "Orange",
      lastName: "Sodas",
      birthDate: "05-05-1995",
      gender: "Female",
      address: "Jakarta",
      phoneNumber: "+62798989"
    };

    request(app)
      .put(`${endpoint}`)
      .expect(200)
      .send(testData)
      .set('access_token', accessTokenCustomer)
      .then(({ body }) => {
        expect(body).toMatchObject({
          message : "success update data"
        })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });
  // -- End of GET -- 
})
